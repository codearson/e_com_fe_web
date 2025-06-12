import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '../API/productApi';
import { Navbar } from '../components/Navbar';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

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

  const handleProductClick = (product) => {
    navigate(`/productView/${product.id}`, { state: { product } });
  };

  const handleSignInClick = () => {
    // Store the current search query to redirect back after login
    localStorage.setItem('searchRedirect', window.location.pathname + window.location.search);
    // You might want to trigger your auth modal here instead of navigating
    navigate('/login');
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
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={product.thumbnail || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="h-48 w-full object-cover object-center group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#1E90FF]">
                            ${product.price}
                          </span>
                          {product.stock > 0 ? (
                            <span className="text-sm text-green-600">In Stock</span>
                          ) : (
                            <span className="text-sm text-red-600">Out of Stock</span>
                          )}
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