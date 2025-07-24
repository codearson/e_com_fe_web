import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { getProductsByUserId } from "../API/productApi";

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
            const products = await getProductsByUserId(userData.id);
            setUserProducts(products);
            setLoadingProducts(false);
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
                        className="bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                        onClick={() => navigate(`/productView/${product.id}`, { state: { product } })}
                      >
                        <img
                          src={
                            product.imageUrl && product.imageUrl.startsWith('http')
                              ? product.imageUrl
                              : "https://via.placeholder.com/150"
                          }
                          alt={product.title}
                          className="w-32 h-32 object-cover rounded mb-3"
                        />
                        <div className="font-semibold text-lg mb-1">{product.title}</div>
                        <div className="text-gray-600 mb-1">{product.brandDto?.brandName}</div>
                        <div className="text-gray-800 font-bold">{product.price ? `Rs. ${product.price}` : "Price not set"}</div>
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
