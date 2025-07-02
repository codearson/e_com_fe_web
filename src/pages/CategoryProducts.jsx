import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../API/productApi";
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeartIcon } from '@heroicons/react/24/outline';

// ProductCard component for displaying individual product information.
const ProductCard = ({ product, onProductClick }) => (
  <div
    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
  >
    <div className="relative group">
      <img
        src={product.responseDto?.imageUrl || 'https://placehold.co/400x400/png'}
        alt={product.title}
        className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
        onClick={() => onProductClick(product)}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/400x400/png';
        }}
      />
      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm">
        <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
      </button>
    </div>
    <div className="p-4">
      <div className="mb-3">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <h4 className="text-sm text-gray-600 mt-1">
          {product.brand?.brand}
        </h4>
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

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setProducts([]);
      try {
        const result = await getProductsByCategory(categoryId);
        if (Array.isArray(result)) {
          setProducts(result);
        } else {
          setError(result.error || "No products found.");
        }
      } catch (err) {
        setError("Failed to fetch products.");
      }
      setLoading(false);
    }
    fetchData();
  }, [categoryId]);

  const handleProductClick = (product) => {
    navigate(`/productView/${product.id}`, { state: { product } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Heading and subheading for category page */}
        <section>
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Category Products</h2>
              <p className="text-sm text-gray-500 mt-1">Browse products in this category</p>
            </div>
            <p className="text-sm text-gray-500">Shipping fees will be added at checkout</p>
          </div>
          {loading && <div className="text-center text-gray-500">Loading products...</div>}
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {!loading && !error && products.length === 0 && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">No products found for this category.</p>
            </div>
          )}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
