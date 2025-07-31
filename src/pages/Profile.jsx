import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { getProductsByUserId } from "../API/productApi";
import { filterProductsWithActiveImages } from "../API/ProductImageApi";
import { BASE_BACKEND_URL } from '../API/config'; 

export const Profile = () => {
  const [tab, setTab] = useState("listings");
  const [user, setUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userData = await getUserByEmail(email);
          setUser(userData);
          if (userData?.id) {
            setLoadingProducts(true);
            try {
              const products = await getProductsByUserId(userData.id);
              
              // Filter products to only show those with active images
              const productsWithActiveImages = await filterProductsWithActiveImages(products);
              
              console.log('Original products:', products);
              console.log('Products with active images:', productsWithActiveImages);
              
              setUserProducts(productsWithActiveImages);
            } catch (error) {
              console.error('Error fetching user products:', error);
              setUserProducts([]);
            } finally {
              setLoadingProducts(false);
            }
          }
        }
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading profile...</div>; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:space-x-8 bg-white rounded-2xl shadow p-4 md:p-10 mb-8">
          <div className="flex-shrink-0 flex justify-center md:block mb-4 md:mb-0">
            <img
              src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff&size=160`}
              alt="Profile"
              className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 shadow"
            />
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                <span className="text-2xl md:text-3xl font-bold mr-0 sm:mr-3">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-gray-500 text-base">No reviews yet</span>
              </div>
              {/* Product count section */}
              <div className="flex items-center text-lg font-semibold text-[#1E90FF] mb-2">
                Selling {userProducts.length} product{userProducts.length !== 1 ? 's' : ''} 
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600 text-base mb-2 gap-1 sm:gap-0">
                <div className="flex items-center justify-center mb-1 sm:mb-0">
                  <svg
                    className="w-5 h-5 mr-1 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                  {user.address || "Address not available"}
                </div>
              </div>
            </div>
            <div className="flex md:justify-end w-full md:w-auto mt-4 md:mt-0">
              <button
                className="w-full md:w-auto px-6 py-2 bg-[#1E90FF] text-white rounded-lg font-medium hover:bg-[#1876cc] transition flex items-center justify-center"
                onClick={() => navigate("/profile/edit")}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                </svg>
                Edit profile
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex border-b mb-6">
            <button
              onClick={() => setTab("listings")}
              className={`px-6 py-2 font-medium text-lg focus:outline-none ${
                tab === "listings"
                  ? "border-b-2 border-[#1E90FF] text-[#1E90FF]"
                  : "text-gray-600"
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setTab("reviews")}
              className={`px-6 py-2 font-medium text-lg focus:outline-none ${
                tab === "reviews"
                  ? "border-b-2 border-[#1E90FF] text-[#1E90FF]"
                  : "text-gray-600"
              }`}
            >
              Reviews
            </button>
          </div>
          {/* Listings Tab */}
          {tab === "listings" && (
            <div className="w-full flex flex-col items-center justify-center py-8">
              {loadingProducts ? (
                <div>Loading your items...</div>
              ) : userProducts.length === 0 ? (
                <>
                  <svg
                    width="80"
                    height="80"
                    fill="none"
                    stroke="#6C63FF"
                    strokeWidth="2"
                    viewBox="0 0 64 64"
                    className="mb-6"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      fill="#f3f4f6"
                    />
                    <path
                      d="M24 44V28l8-8 8 8v16"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <circle cx="32" cy="36" r="2" fill="#6C63FF" />
                    <rect
                      x="28"
                      y="44"
                      width="8"
                      height="4"
                      rx="2"
                      fill="#6C63FF"
                    />
                  </svg>
                  <h2 className="text-2xl font-bold mb-2 text-center">
                    Upload items to start selling
                  </h2>
                  <p className="text-lg text-gray-500 mb-6 text-center">
                    Declutter your life. Sell what you don't wear anymore!
                  </p>
                  <button
                    className="px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors"
                    onClick={() => navigate("/sell")}
                  >
                    List now
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <h2 className="text-2xl font-bold mb-6 text-center">Your Listed Items</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                        onClick={() => navigate(`/productView/${product.id}`, { state: { product } })}
                      >
                        <div className="relative group">
                          <img
                            src={product.imageUrl ? `${BASE_BACKEND_URL}${product.imageUrl}` : '/default-image.jpg'}
                            alt={product.title}
                            className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onClick={() => navigate(`/productView/${product.id}`, { state: { product } })}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x400/png';
                            }}
                          />
                          <button
                            className="absolute top-3 left-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-product/${product.id}`, { state: { product } });
                            }}
                            aria-label="Edit product"
                          >
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="mb-3">
                            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                              {product.title}
                            </h3>
                            <h4 className="text-sm text-gray-600 mt-1">
                              {product.brandDto?.brandName || 'Unbranded'}
                            </h4>
                            {product.size && (
                              <p className="text-sm text-gray-600 mt-1">
                                {product.size}
                              </p>
                            )}
                          </div>
                          <div className="mt-4">
                            <div className="flex items-baseline">
                              <span className="text-lg font-bold text-gray-900">
                                Rs. {product.price?.toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  Rs. {product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className={`text-xs font-medium ${
                              product.statusDto?.type === 'Available' ? 'text-green-600' :
                              product.statusDto?.type === 'Out of Stock' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>
                              {product.statusDto?.type || (product.quantity > 0 ? 'In stock' : 'Out of stock')}
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
                  <div className="flex justify-center mt-8">
                    <button
                      className="px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors"
                      onClick={() => navigate("/sell")}
                    >
                      List another item
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Reviews Tab */}
          {tab === "reviews" && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                width="80"
                height="80"
                fill="none"
                stroke="#6C63FF"
                strokeWidth="2"
                viewBox="0 0 64 64"
                className="mb-6"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#6C63FF"
                  strokeWidth="2"
                  fill="#f3f4f6"
                />
                <path
                  d="M20 40h24M20 32h24M20 24h24"
                  stroke="#6C63FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-center">
                No reviews yet
              </h2>
              <p className="text-lg text-gray-500 mb-6 text-center">
                Once you get reviews, they'll show up here.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
