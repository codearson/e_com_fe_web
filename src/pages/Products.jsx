import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getAllproductPage } from '../API/productApi';
import { HeartIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product, onProductClick }) => (
  <div
    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
  >
    <div className="relative group">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
        alt={product.title}
        className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
        onClick={() => onProductClick(product)}
      />
      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm">
        <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
      </button>
    </div>
    <div className="p-4">
      <div className="mb-3">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
          {product.brand?.brand}
        </h3>
        {product.size && (
          <p className="text-sm text-gray-600 mt-1">
            {product.size}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {product.conditions?.name || 'Condition not specified'}
        </p>
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
        <span className="text-xs text-gray-500">
          {product.quantity > 0 ? 'In stock' : 'Out of stock'}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          product.conditions?.name === 'New with tags' ? 'bg-green-100 text-green-800' :
          product.conditions?.name === 'New without tags' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {product.conditions?.name || 'Used'}
        </span>
      </div>
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllproductPage();
        console.log('Product data:', data);
        if (data.payload && data.payload.length > 0) {
          console.log('First product brand:', data.payload[0].brand);
        }
        setProducts(data.payload || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    navigate('/productView', { state: { product } });
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="bg-red-50 p-4 rounded-lg shadow-sm max-w-md w-full">
            <p className="text-red-600 text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 w-full bg-red-100 text-red-700 py-2 px-4 rounded-md hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* All Products Section */}
        <section>
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
              <p className="text-sm text-gray-500 mt-1">Browse our complete collection</p>
            </div>
            <p className="text-sm text-gray-500">Shipping fees will be added at checkout</p>
          </div>
          
          {products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
