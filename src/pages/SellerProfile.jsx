import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getUserById } from "../API/UserApi";
import { getProductsByUserId } from "../API/productApi";
import { filterProductsWithActiveImages } from "../API/ProductImageApi";
import { findByUserId } from "../API/UserProfileImageApi";
import { getAllProductCategoriesBySearch } from "../API/ProductCategoryApi";
import { BASE_BACKEND_URL } from '../API/config'; 
import { getProductCategoryTree } from "../API/ProductCategoryApi";

export const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerId } = useParams();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Try to fetch all categories using the tree endpoint first
        const treeResult = await getProductCategoryTree();
        let cats = [];
        
        if (treeResult && !treeResult.errorDescription && Array.isArray(treeResult.responseDto)) {
          // If tree endpoint works, flatten the tree structure
          const flattenCategories = (categories, level = 1) => {
            let flattened = [];
            categories.forEach(cat => {
              flattened.push({
                ...cat,
                level: level
              });
              if (cat.children && cat.children.length > 0) {
                flattened.push(...flattenCategories(cat.children, level + 1));
              }
            });
            return flattened;
          };
          cats = flattenCategories(treeResult.responseDto);
        } else {
          // Fallback to the regular endpoint with larger page size
          const result = await getAllProductCategoriesBySearch({ pageSize: 1000 });
          if (result && !result.errorDescription) {
            if (Array.isArray(result)) {
              cats = result;
            } else if (Array.isArray(result.responseDto)) {
              cats = result.responseDto;
            } else if (result.responseDto && Array.isArray(result.responseDto.payload)) {
              cats = result.responseDto.payload;
            }
          }
        }
        
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Filter and sort products when filters change
  useEffect(() => {
    if (sellerProducts.length > 0) {
      let filtered = [...sellerProducts];

      // Filter by category
      if (selectedCategory) {
        // Get all subcategory IDs for the selected top-level category (including the main category itself)
        const getSubcategoryIds = (parentId) => {
          const subcategoryIds = [parentId]; // Include the main category itself
          const directChildren = categories.filter(cat => cat.parentId === parentId);
          
          directChildren.forEach(child => {
            subcategoryIds.push(child.id);
            // Recursively get grandchildren (level 3 and beyond)
            const grandchildren = getSubcategoryIds(child.id);
            subcategoryIds.push(...grandchildren);
          });
          
          return subcategoryIds;
        };

        const categoryIds = getSubcategoryIds(parseInt(selectedCategory));
        
        filtered = filtered.filter(product => {
          const productCategoryId = product.productCategoryDto?.id;
          return categoryIds.includes(productCategoryId);
        });
      }

      // Sort products
      switch (sortBy) {
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "oldest":
          filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "price-low":
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price-high":
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case "name-az":
          filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
          break;
        case "name-za":
          filtered.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
          break;
        default:
          break;
      }

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [sellerProducts, selectedCategory, sortBy, categories]);

  // Get unique main categories from seller's products (only level 1 categories)
  const getSellerMainCategories = () => {
    if (!sellerProducts.length || !categories.length) return [];
    
    const categoryMap = new Map();
    
    // Create a map for quick category lookup
    const categoryLookup = new Map();
    categories.forEach(cat => categoryLookup.set(cat.id, cat));
    
    // Track which categories have products
    const categoriesWithProducts = new Set();
    
    sellerProducts.forEach(product => {
      const productCategory = product.productCategoryDto;
      if (productCategory && productCategory.id) {
        
        // Find the top-level category for this product
        let currentCategory = categoryLookup.get(productCategory.id);
        if (!currentCategory) {
          return;
        }
        
        // Walk up the category tree to find the top-level category (level 1)
        while (currentCategory && currentCategory.parentId) {
          currentCategory = categoryLookup.get(currentCategory.parentId);
          if (!currentCategory) {
            break;
          }
        }
        
        // Only use categories that are actually top-level (level 1)
        if (currentCategory && currentCategory.level === 1) {
          
          // Mark this category as having products
          categoriesWithProducts.add(currentCategory.id);
          
          if (!categoryMap.has(currentCategory.id)) {
            categoryMap.set(currentCategory.id, {
              id: currentCategory.id,
              name: currentCategory.name,
              count: 1
            });
          } else {
            categoryMap.get(currentCategory.id).count++;
          }
        }
      }
    });
    
    // Only return categories that actually have products
    const result = Array.from(categoryMap.values())
      .filter(cat => categoriesWithProducts.has(cat.id))
      .sort((a, b) => b.count - a.count);
    
    return result;
  };

  // Get subcategories for a specific main category (level 2 and beyond)
  const getSubcategoriesForMainCategory = (mainCategoryId) => {
    if (!sellerProducts.length || !categories.length) return [];
    
    const categoryMap = new Map();
    
    // Get all subcategories of the main category (all levels)
    const getAllSubcategoryIds = (parentId) => {
      const subcategoryIds = [];
      const directChildren = categories.filter(cat => cat.parentId === parentId);
      
      directChildren.forEach(child => {
        subcategoryIds.push(child.id);
        // Recursively get all descendants
        const descendants = getAllSubcategoryIds(child.id);
        subcategoryIds.push(...descendants);
      });
      
      return subcategoryIds;
    };

    const allSubcategoryIds = getAllSubcategoryIds(mainCategoryId);
    
    sellerProducts.forEach(product => {
      const productCategory = product.productCategoryDto;
      if (productCategory && productCategory.id && allSubcategoryIds.includes(productCategory.id)) {
        if (!categoryMap.has(productCategory.id)) {
          categoryMap.set(productCategory.id, {
            id: productCategory.id,
            name: productCategory.name,
            count: 1,
            level: getCategoryLevel(productCategory.id)
          });
        } else {
          categoryMap.get(productCategory.id).count++;
        }
      }
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => a.level - b.level || b.count - a.count);
  };

  // Helper function to get category level
  const getCategoryLevel = (categoryId) => {
    let level = 1;
    let currentCategory = categories.find(cat => cat.id === categoryId);
    
    while (currentCategory && currentCategory.parentId) {
      level++;
      currentCategory = categories.find(cat => cat.id === currentCategory.parentId);
    }
    
    return level;
  };

  const sellerMainCategories = getSellerMainCategories();
  const sellerSubcategories = selectedMainCategory ? getSubcategoriesForMainCategory(selectedMainCategory.id) : [];

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    if (categoryId === "") {
      setSelectedCategory("");
      setSelectedMainCategory(null);
    } else {
      const category = sellerMainCategories.find(cat => cat.id === parseInt(categoryId));
      if (category) {
        setSelectedCategory(categoryId);
        setSelectedMainCategory(category);
      }
    }
  };

  useEffect(() => {
    const fetchSeller = async () => {
      // First check if we have seller data from navigation state
      if (location.state?.seller) {
        setSeller(location.state.seller);
        setProfileImage(location.state.sellerProfileImage || null);
        
        // Fetch products for this seller
        setLoadingProducts(true);
        try {
          const products = await getProductsByUserId(location.state.seller.id);
          const productsWithActiveImages = await filterProductsWithActiveImages(products);
          setSellerProducts(productsWithActiveImages);
        } catch (error) {
          console.error('Error fetching seller products:', error);
          setSellerProducts([]);
        } finally {
          setLoadingProducts(false);
          setLoading(false);
        }
        return;
      }

      // If no navigation state, fetch seller by ID
      if (!sellerId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        // Get seller information by ID
        const sellerData = await getUserById(sellerId);
        
        if (sellerData) {
          setSeller(sellerData);
          
          // Fetch profile image
          try {
            const profileResponse = await findByUserId(sellerData.id);
            if (profileResponse && profileResponse.status && profileResponse.responseDto) {
              setProfileImage(profileResponse.responseDto.profileImage);
            } else {
              setProfileImage(null);
            }
          } catch (error) {
            console.error("Error fetching profile image:", error);
            setProfileImage(null);
          }

          setLoadingProducts(true);
          try {
            const products = await getProductsByUserId(sellerData.id);
            const productsWithActiveImages = await filterProductsWithActiveImages(products);
            setSellerProducts(productsWithActiveImages);
          } catch (error) {
            console.error('Error fetching seller products:', error);
            setSellerProducts([]);
          } finally {
            setLoadingProducts(false);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching seller:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sellerId, navigate, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Seller not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8">
        {/* Profile Section - Improved mobile layout */}
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:space-x-8 bg-white rounded-2xl shadow p-4 sm:p-6 md:p-10 mb-8">
          {/* Profile Image - Centered on mobile */}
          <div className="flex justify-center md:justify-start mb-6 md:mb-0">
            <img
              src={profileImage ? `${BASE_BACKEND_URL}/uploads/profiles/${profileImage}` : `https://ui-avatars.com/api/?name=${seller.firstName}+${seller.lastName}&background=random&color=fff&size=160`}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 shadow"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${seller.firstName}+${seller.lastName}&background=random&color=fff&size=160`;
              }}
            />
          </div>
          
          {/* Profile Info - Centered on mobile */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center md:justify-start sm:space-x-2 mb-2 w-full">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                {seller.firstName} {seller.lastName}
              </span>
              <span className="text-gray-500 text-base mt-1 sm:mt-0 sm:ml-3">No reviews yet</span>
            </div>
            
            {/* Product count section */}
            <div className="flex items-center justify-center md:justify-start text-lg font-semibold text-[#1E90FF] mb-3 w-full">
              Selling {sellerProducts.length} product{sellerProducts.length !== 1 ? 's' : ''}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center md:justify-start sm:space-x-6 text-gray-600 text-base mb-2 gap-2 sm:gap-0 w-full">
              <div className="flex items-center justify-center sm:justify-start w-full">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                {seller.address || "Address not available"}
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Sort Section - Improved mobile layout */}
        <div className="w-full max-w-5xl mx-auto mb-6">
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center md:text-left w-full">
                Products by {seller.firstName}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full">
                {/* Category Filter */}
                <div className="flex flex-col w-full sm:w-auto items-center sm:items-start">
                  <label className="text-sm font-medium text-gray-700 mb-1 text-center sm:text-left w-full">Category</label>
                  <div className="w-full flex justify-center sm:justify-start">
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto max-w-xs text-center sm:text-left"
                    >
                      <option value="">All Categories ({sellerProducts.length})</option>
                      {sellerMainCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex flex-col w-full sm:w-auto items-center sm:items-start">
                  <label className="text-sm font-medium text-gray-700 mb-1 text-center sm:text-left w-full">Sort By</label>
                  <div className="w-full flex justify-center sm:justify-start">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto max-w-xs text-center sm:text-left"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-az">Name: A to Z</option>
                      <option value="name-za">Name: Z to A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section - Improved mobile layout */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
            {loadingProducts ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer w-full max-w-sm"
                    onClick={() => navigate(`/productView/${product.id}`, { state: { product } })}
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img
                        src={product.imageUrl ? `${BASE_BACKEND_URL}${product.imageUrl}` : "https://placehold.co/400x400/png"}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/400x400/png";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <h4 className="text-sm text-gray-600 mb-2">
                        {product.brandDto?.brandName || 'Unbranded'}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          LKR {product.price?.toFixed(2)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.conditionsDto?.conditionType === 'New' ? 'bg-green-100 text-green-800' :
                          product.conditionsDto?.conditionType === 'New without tags' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.conditionsDto?.conditionType || 'Used'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {selectedCategory 
                    ? `No products found in ${selectedMainCategory?.name || 'Selected Category'} category.`
                    : "No products available from this seller."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerProfile; 