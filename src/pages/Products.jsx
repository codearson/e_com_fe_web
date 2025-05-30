import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Sample product data for testing
const sampleProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 999.99,
    description: "Latest iPhone model with advanced camera system and A15 Bionic chip",
    image: "https://images.unsplash.com/photo-1656392851225-ec9a304ef9d0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGklMjBwaG9uZSUyMDEzJTIwcHJvfGVufDB8fDB8fHww",
    condition: "New"
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    price: 799.99,
    description: "5G Android smartphone with 120Hz display and pro-grade camera",
    image: "https://images.unsplash.com/photo-1611282104572-e0b0e9a707f7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FsYXh5JTIwczIxJTIwdWx0cmF8ZW58MHx8MHx8fDA%3D",
    condition: "New"
  },
  {
    id: 3,
    name: "MacBook Pro 2023",
    price: 1299.99,
    description: "Powerful laptop with M2 chip and stunning Retina display",
    image: "https://plus.unsplash.com/premium_photo-1681160405609-389cd83998d0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1hYyUyMGJvb2slMjBwcm98ZW58MHx8MHx8fDA%3D",
    condition: "Refurbished"
  },
  {
    id: 4,
    name: "iPad Air",
    price: 599.99,
    description: "Versatile tablet perfect for work and entertainment",
    image: "https://images.unsplash.com/photo-1682426526490-667d4912b8de?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SSUyMHBhZCUyMGFpcnxlbnwwfHwwfHx8MA%3D%3D",
    condition: "New"
  }
];

const Products = () => {
  const [products, setProducts] = useState(sampleProducts); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();


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
        <h1 className="text-2xl text-start text-gray-700 mb-8">
          All Products
        </h1>
        {products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
              >
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-blue-600">
                      ${product.price?.toFixed(2)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.condition === 'New' ? 'bg-green-100 text-green-800' :
                      product.condition === 'Refurbished' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.condition}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
