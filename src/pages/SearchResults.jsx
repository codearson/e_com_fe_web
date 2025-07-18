import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '../API/productApi';
import { saveFavourite, getAllFavourites, updateFavourite } from '../API/favouriteApi';
import { getUserByEmail } from '../API/config';
import { decodeJwt } from '../API/UserApi';
import { Navbar } from '../components/Navbar';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [favourites, setFavourites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setError('No search query provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching search results for query:', query);
        const results = await searchProducts(query);
        console.log('Search results:', results);

        if (!results) {
          console.log('No results returned from API');
          setProducts([]);
        } else if (Array.isArray(results)) {
          console.log('Results is an array with length:', results.length);
          setProducts(results);
        } else if (typeof results === 'object') {
          console.log('Results is an object:', results);
          // If results is an object, try to find an array property
          const arrayData = Object.values(results).find(val => Array.isArray(val));
          if (arrayData) {
            console.log('Found array data in results:', arrayData);
            setProducts(arrayData);
          } else {
            console.log('No array data found in results');
            setProducts([]);
          }
        } else {
          console.log('Unexpected results format:', typeof results);
          setProducts([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error in search:', err);
        if (err.response?.status === 401) {
          setError('Please sign in to search products');
          setIsAuthenticated(false);
        } else {
          setError('Failed to fetch search results');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  useEffect(() => {
    const fetchUserAndFavourites = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userData = await getUserByEmail(email);
          setUser(userData);
          const favRes = await getAllFavourites();
          if (favRes.success && favRes.data.responseDto) {
            setFavourites(favRes.data.responseDto.filter(fav => fav.userDto?.id === userData.id && fav.isActive));
          }
        }
      }
    };
    fetchUserAndFavourites();
    // Listen for favouritesUpdated event
    const handleFavouritesUpdated = () => {
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

  const handleSignInClick = () => {
    // Store the current search query to redirect back after login
    localStorage.setItem('searchRedirect', window.location.pathname + window.location.search);
    // You might want to trigger your auth modal here instead of navigating
    navigate('/login');
  };

  const handleFavouriteClick = async (product) => {
    if (!user) return;
    const alreadyFav = favourites.find(fav => fav.productDto?.id === product.id && fav.isActive);
    if (!alreadyFav) {
      await saveFavourite({ id: product.id }, { id: user.id }, true);
      const favRes = await getAllFavourites();
      if (favRes.success && favRes.data.responseDto) {
        setFavourites(favRes.data.responseDto.filter(fav => fav.userDto?.id === user.id && fav.isActive));
      }
      window.dispatchEvent(new Event('favouritesUpdated'));
    }
  };

  const handleUnfavouriteClick = async (product) => {
    if (!user) return;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF]"></div>
            </div>
          ) : error ? (
            <div className="text-center min-h-[400px] flex items-center justify-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                {!isAuthenticated && (
                  <button
                    onClick={handleSignInClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1E90FF] hover:bg-[#1876cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E90FF]"
                  >
                    Sign In to Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Search Results for "{query}"
                </h1>
                <p className="mt-2 text-gray-600">
                  {products.length} {products.length === 1 ? 'result' : 'results'} found
                </p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">
                    No products found
                  </h2>
                  <p className="text-gray-600">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  {!isAuthenticated && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-500 mb-4">
                        Sign in to see more results
                      </p>
                      <button
                        onClick={handleSignInClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1E90FF] hover:bg-[#1876cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E90FF]"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="relative group">
                        <img
                          src={product.imageUrl || 'https://placehold.co/400x400/png'}
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
                          onClick={e => {
                            e.stopPropagation();
                            const isFav = !!favourites.find(fav => fav.productDto?.id === product.id && fav.isActive);
                            if (isFav) {
                              handleUnfavouriteClick(product);
                            } else {
                              handleFavouriteClick(product);
                            }
                          }}
                          aria-label={!!favourites.find(fav => fav.productDto?.id === product.id && fav.isActive) ? "Remove from favourites" : "Add to favourites"}
                        >
                          {!!favourites.find(fav => fav.productDto?.id === product.id && fav.isActive) ? (
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                          )}
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                            {product.title || product.name}
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
                              {product.price !== undefined ? `LKR ${Number(product.price).toFixed(2)}` : ''}
                            </span>
                            {product.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                LKR {Number(product.originalPrice).toFixed(2)}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 