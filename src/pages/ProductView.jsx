import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getProductById, getSellerByProductId } from "../API/productApi";
import { getAllProductCategoriesBySearch } from "../API/ProductCategoryApi";
import { getActiveProductImages } from "../API/ProductImageApi";
import { findByUserId } from "../API/UserProfileImageApi";
import { BASE_BACKEND_URL } from "../API/config";
import { addToCart } from "../API/cartApi";
import { useCart } from "../utils/CartContext";

const ProductView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [seller, setSeller] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [sellerProfileImage, setSellerProfileImage] = useState(null);
  const { refreshCartCount } = useCart();

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Handle case where user is not logged in
      return;
    }
    try {
      await addToCart(userId, id);
      refreshCartCount();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      // If we already have the product data from navigation state, don't fetch
      if (location.state?.product) {
        setProduct(location.state.product);
        setLoading(false);
        return;
      }

      // Only fetch if we don't have the product and have an ID
      if (!product && id) {
        try {
          setLoading(true);
          const productData = await getProductById(id);
          if (productData) {
            setProduct(productData);
            setError(null);
          } else {
            setError("Product not found");
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Failed to load product");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, location.state, product]);

  // Fetch product images when product is loaded
  useEffect(() => {
    const fetchProductImages = async () => {
      if (product?.id) {
        try {
          setLoadingImages(true);
          const images = await getActiveProductImages(product.id);

          // Convert image objects to URLs
          const imageUrls = images.map((img) => {
            const imageUrl = img.url || img.imageUrl;

            // Handle different URL formats
            let fullUrl;
            if (imageUrl.startsWith("http")) {
              fullUrl = imageUrl;
            } else if (imageUrl.startsWith("/")) {
              fullUrl = `${BASE_BACKEND_URL}${imageUrl}`;
            } else {
              fullUrl = `${BASE_BACKEND_URL}/${imageUrl}`;
            }

            // Properly encode the URL for special characters
            const urlParts = fullUrl.split("/");
            const filename = urlParts[urlParts.length - 1];
            const path = urlParts.slice(0, -1).join("/");
            const encodedFilename = encodeURIComponent(filename);
            fullUrl = `${path}/${encodedFilename}`;

            return {
              id: img.id,
              url: fullUrl,
              alt: `${product.title} ${img.id}`,
            };
          });

          setProductImages(imageUrls);
        } catch (error) {
          console.error("Error fetching product images:", error);
          setProductImages([]);
        } finally {
          setLoadingImages(false);
        }
      }
    };

    fetchProductImages();
  }, [product?.id]);

  useEffect(() => {
    // Fetch all categories for breadcrumb
    const fetchCategories = async () => {
      const result = await getAllProductCategoriesBySearch();
      let cats = [];
      if (result && !result.errorDescription) {
        if (Array.isArray(result)) {
          cats = result;
        } else if (Array.isArray(result.responseDto)) {
          cats = result.responseDto;
        } else if (
          result.responseDto &&
          Array.isArray(result.responseDto.payload)
        ) {
          cats = result.responseDto.payload;
        }
      }
      setCategories(cats);
      // Build id -> category map
      const map = {};
      cats.forEach((cat) => {
        map[cat.id] = cat;
      });
      setCategoryMap(map);
    };
    fetchCategories();
  }, []);

  // Fetch seller information when product is loaded
  useEffect(() => {
    const fetchSeller = async () => {
      if (product?.id) {
        try {
          setLoadingSeller(true);

          // First check if product already has user information
          if (product.userDto && product.userDto.id) {
            setSeller(product.userDto);

            // Fetch seller's profile image
            try {
              const profileResponse = await findByUserId(product.userDto.id);
              if (
                profileResponse &&
                profileResponse.status &&
                profileResponse.responseDto
              ) {
                setSellerProfileImage(profileResponse.responseDto.profileImage);
              } else {
                setSellerProfileImage(null);
              }
            } catch (error) {
              console.error("Error fetching seller profile image:", error);
              setSellerProfileImage(null);
            }

            setLoadingSeller(false);
            return;
          }

          // If not, fetch seller information
          const sellerData = await getSellerByProductId(product.id);
          setSeller(sellerData);

          // Fetch seller's profile image if we have seller data
          if (sellerData?.id) {
            try {
              const profileResponse = await findByUserId(sellerData.id);
              if (
                profileResponse &&
                profileResponse.status &&
                profileResponse.responseDto
              ) {
                setSellerProfileImage(profileResponse.responseDto.profileImage);
              } else {
                setSellerProfileImage(null);
              }
            } catch (error) {
              console.error("Error fetching seller profile image:", error);
              setSellerProfileImage(null);
            }
          }
        } catch (error) {
          console.error("Error fetching seller information:", error);
        } finally {
          setLoadingSeller(false);
        }
      }
    };

    fetchSeller();
  }, [product?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center text-gray-500">
              {error || "Product not found"}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper to build category path for breadcrumb
  const getCategoryPath = () => {
    const catObj = product.productCategoryDto;
    if (!catObj || !categoryMap || Object.keys(categoryMap).length === 0)
      return [];
    let path = [];
    let current = null;
    // Always resolve by id if possible
    if (catObj.id && categoryMap[catObj.id]) {
      current = categoryMap[catObj.id];
    } else if (catObj.name) {
      // fallback: try to find by name
      current = Object.values(categoryMap).find(
        (cat) => cat.name === catObj.name
      );
    }
    if (!current) {
      return [catObj.name || catObj];
    }
    // Walk up the parentId chain to the root (level 1)
    while (current) {
      path.unshift(current.name);
      if (!current.parentId || !categoryMap[current.parentId]) break;
      current = categoryMap[current.parentId];
    }
    return path;
  };

  // Create fallback image array if no product images are loaded
  const fallbackImages = product.imageUrl
    ? [`${BASE_BACKEND_URL}${product.imageUrl}`]
    : ["https://placehold.co/400x400/png"];

  // Use product images if available, otherwise use fallback
  const displayImages =
    productImages.length > 0
      ? productImages
      : fallbackImages.map((url, index) => ({
          id: `fallback-${index}`,
          url: url,
          alt: `${product.title} ${index + 1}`,
        }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            Home
            {getCategoryPath().map((cat, idx) => (
              <span key={cat}>
                {" / "}
                {cat}
              </span>
            ))}
            {" / "}
            {product.title}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full relative group">
                {loadingImages ? (
                  <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    <img
                      src={
                        displayImages[selectedImage]?.url ||
                        "https://placehold.co/400x400/png"
                      }
                      alt={displayImages[selectedImage]?.alt || product.title}
                      className="w-full h-[400px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-in-out"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400/png";
                      }}
                    />

                    {/* Enhanced Navigation arrows for multiple images */}
                    {displayImages.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setSelectedImage((prev) =>
                              prev === 0 ? displayImages.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          <svg
                            className="w-6 h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            setSelectedImage((prev) =>
                              prev === displayImages.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          <svg
                            className="w-6 h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image counter overlay */}
                    {displayImages.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {selectedImage + 1} / {displayImages.length}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Enhanced Thumbnail navigation */}
              {displayImages.length > 1 && !loadingImages && (
                <div className="space-y-3">
                  <div className="flex justify-center space-x-2">
                    {displayImages.map((image, index) => (
                      <button
                        key={image.id || index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          selectedImage === index
                            ? "ring-2 ring-blue-500 ring-offset-2 scale-105"
                            : "ring-1 ring-gray-200 hover:ring-gray-300"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-16 h-16 object-cover"
                          onError={(e) => {
                            console.error(
                              "Thumbnail failed to load:",
                              e.target.src
                            );
                            // Stop the infinite loop and use placeholder
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x400/png";
                          }}
                          onLoad={(e) => {
                            console.log(
                              "Thumbnail loaded successfully:",
                              e.target.src
                            );
                          }}
                        />
                        {/* Active indicator */}
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-gray-600">
                      Brand:{" "}
                      {product.brandDto?.brandName ||
                        product.brandDto?.brand ||
                        "Unbranded"}
                    </span>
                  </div>
                  <span className="text-gray-500">|</span>
                  <div className="flex items-center">
                    <span
                      className={
                        product.quentity > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {product.quentity > 0
                        ? `${product.quentity} items in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                LKR {product.price?.toFixed(2)}
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description || "No description available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Size Information */}
                {product.size && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Size
                    </h3>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-700">{product.size}</p>
                    </div>
                  </div>
                )}

                {/* Color Information */}
                {product.color && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Color
                    </h3>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-700">{product.color}</p>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                {product.createdAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Listed On
                    </h3>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-700">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Condition */}
                {product.conditions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Condition
                    </h3>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-700">
                        {product.conditions?.conditionType ||
                          product.conditions?.name ||
                          "Used"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors ${
                    product.quentity > 0
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={product.quentity <= 0}
                >
                  Add to Cart
                </button>
                <button
                  className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors ${
                    product.quentity > 0
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={product.quentity <= 0}
                  onClick={() =>
                    navigate(`/checkout/${id}`, { state: { product } })
                  }
                >
                  Buy Now
                </button>
              </div>

              {/* Seller Information Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  Seller Information
                  <svg
                    className="w-5 h-5 ml-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </h3>
                {loadingSeller ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                ) : seller ? (
                  <div
                    className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => {
                      if (seller?.id) {
                        navigate(`/seller/${seller.id}`, {
                          state: {
                            seller: seller,
                            sellerProfileImage: sellerProfileImage,
                          },
                        });
                      }
                    }}
                  >
                    <div className="relative">
                      <img
                        src={
                          sellerProfileImage
                            ? `${BASE_BACKEND_URL}/uploads/profiles/${sellerProfileImage}`
                            : seller.profileImageUrl
                            ? `${BASE_BACKEND_URL}${seller.profileImageUrl}`
                            : seller.profileImage
                            ? `${BASE_BACKEND_URL}/uploads/profiles/${seller.profileImage}`
                            : "https://placehold.co/100x100/png"
                        }
                        alt={`${seller.firstName || seller.first_name || ""} ${
                          seller.lastName || seller.last_name || ""
                        }`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/100x100/png";
                        }}
                      />
                      {(seller.isActive || seller.status) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {seller.firstName || seller.first_name || ""}{" "}
                        {seller.lastName || seller.last_name || ""}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Member since{" "}
                        {seller.createdDate
                          ? new Date(seller.createdDate).getFullYear()
                          : "N/A"}
                      </p>
                      {(seller.email || seller.username) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {seller.email || seller.username}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                      <p className="text-xs text-gray-500">(24 reviews)</p>
                    </div>
                    <div className="text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Seller information not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductView;
