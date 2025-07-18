import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import React, { useEffect, useState } from "react";
import { getAllFavourites, updateFavourite } from "../API/favouriteApi";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { useNavigate } from "react-router-dom";
import { getProductById } from "../API/productApi";

export const Favourited = () => {
  const [favourites, setFavourites] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndFavourites = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userData = await getUserByEmail(email);
          setUser(userData);
          console.log('Current user:', userData);
          const favRes = await getAllFavourites();
          console.log('Raw favourites from API:', favRes);
          if (favRes.success && favRes.data.responseDto) {
            const userFavourites = favRes.data.responseDto.filter(fav => fav.userDto?.id === userData.id && fav.isActive);
            console.log('Filtered user favourites:', userFavourites);
            setFavourites(userFavourites);
            // Fetch full product details for each favourite
            const productIds = userFavourites.map(fav => fav.productDto?.id);
            console.log('Fetching product details for IDs:', productIds);
            const productPromises = userFavourites.map(fav => getProductById(fav.productDto?.id));
            const productResults = await Promise.all(productPromises);
            console.log('Fetched product details:', productResults);
            setProducts(productResults.filter(Boolean));
          }
        }
      }
      setLoading(false);
    };
    fetchUserAndFavourites();

    // Listen for favouritesUpdated event
    const handleFavouritesUpdated = () => {
      setLoading(true);
      fetchUserAndFavourites();
    };
    window.addEventListener('favouritesUpdated', handleFavouritesUpdated);
    return () => {
      window.removeEventListener('favouritesUpdated', handleFavouritesUpdated);
    };
  }, []);

  const handleProductClick = (product) => {
    navigate(`/productView/${product.id}`, { state: { product } });
  };

  const handleUnfavouriteClick = async (product) => {
    if (!user) return;
    // Find the favourite record for this product and user
    const fav = favourites.find(fav => fav.productDto?.id === product.id && fav.userDto?.id === user.id && fav.isActive);
    if (!fav) return;
    await updateFavourite({
      id: fav.id,
      productDto: { id: product.id },
      userDto: { id: user.id },
      isActive: false
    });
    window.dispatchEvent(new Event('favouritesUpdated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f8fafc] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        {products.length === 0 ? (
          <div className="animate-fadein w-full max-w-xs bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col items-center px-6 py-8 border border-white/30 relative" style={{boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.12)'}}>
            <span className="beating-heart mb-6 drop-shadow-xl" style={{filter: 'drop-shadow(0 0 12px #e573a6aa)'}}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="0" x2="2" y2="2" gradientUnits="userSpaceOnUse">
                    <stop offset="1" stopColor="#e573a6" />
                  </linearGradient>
                </defs>
                <path d="M28 48s-13.5-9.1-18-17.1C6.1 25.1 6 19.5 10.2 15.7c4.2-3.8 10.2-2.7 13.1 1.2C25.9 19.5 28 22 28 22s2.1-2.5 4.7-5.1c2.9-3.9 8.9-5 13.1-1.2 4.2 3.8 4.1 9.4.2 15.2C41.5 38.9 28 48 28 48z" fill="url(#heartGradient)" stroke="#fff" strokeWidth="2"/>
              </svg>
            </span>
            <h1 className="text-xl font-extrabold text-gray-900 mb-1 text-center tracking-tight">Favourite</h1>
            <h2 className="text-base font-medium text-gray-700 mb-1 text-center">Save your favourites</h2>
            <p className="text-gray-500 mb-5 text-center text-sm">Favourite some items and find them here</p>
            <button className="px-6 py-2 bg-[#1E90FF] text-white rounded-full text-base font-bold shadow hover:bg-[#1876cc] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" onClick={() => navigate('/products')}>Browse</button>
          </div>
        ) : (
          <div className="mt-12 w-full max-w-7xl px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative group">
                    <img
                      src={product.responseDto?.imageUrl || 'https://placehold.co/400x400/png'}
                      alt={product.title}
                      className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => handleProductClick(product)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x400/png';
                      }}
                    />
                    <button
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                      aria-label="Unfavourite"
                      onClick={() => handleUnfavouriteClick(product)}
                    >
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
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
                          LKR {product.price?.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            LKR {product.originalPrice.toFixed(2)}
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favourited;
