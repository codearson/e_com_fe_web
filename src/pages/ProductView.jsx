import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams } from 'react-router-dom';

const ProductView = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = {
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    description: "High-quality cotton t-shirt with a comfortable fit. Perfect for everyday wear. Made from 100% organic cotton with sustainable manufacturing practices.",
    rating: 4.5,
    ratingCount: 128,
    stock: 50,
    seller: "Fashion Store",
    sellerRating: 4.8,
    category: "Clothing",
    size: "Small / 8",
    color: "Navy Blue",
    uploadDate: "January 15, 2024",
    condition: "Brand New with Tags",
    material: "100% Premium Cotton, 180 GSM",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cnVubmluZyUyMHNob2VzfGVufDB8fDB8fHww"
    ]
  };

  const relatedProducts = [
    {
      id: 1,
      name: "Classic Denim Jacket",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "Casual Sneakers",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Summer Dress",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      name: "Leather Backpack",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            Home / {product.category} / {product.name}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-3">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-md overflow-hidden ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>    

            {/* Product Details */} 
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 ${
                          index < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">({product.ratingCount} reviews)</span>
                  </div>
                  <span className="text-gray-500">|</span>
                  <div className="flex items-center">
                    <span className="text-green-500">{product.stock} items</span>
                    <span className="ml-1 text-gray-500">in stock</span>
                  </div>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900">${product.price}</div>

              <p className="text-gray-600">{product.description}</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Size Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Size</h3>
                  <div className="bg-gray-100 p-2 rounded-md">
                    <p className="text-gray-700">{product.size}</p>
                  </div>
                </div>

                {/* Color Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Color</h3>
                  <div className="bg-gray-100 p-2 rounded-md">
                    <p className="text-gray-700">{product.color}</p>
                  </div>
                </div>

                {/* Upload Date */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Listed On</h3>
                  <div className="bg-gray-100 p-2 rounded-md">
                    <p className="text-gray-700">{product.uploadDate}</p>
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Condition</h3>
                  <div className="bg-gray-100 p-2 rounded-md">
                    <p className="text-gray-700">{product.condition}</p>
                  </div>
                </div>
              </div>

              {/* Material */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Material</h3>
                <div className="bg-gray-100 p-2 rounded-md">
                  <p className="text-gray-700">{product.material}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Add to Cart
                </button>
                <button className="flex-1 bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Seller Info */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Seller</h3>
                    <p className="text-gray-500">{product.seller}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-gray-600">{product.sellerRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-lg font-semibold text-gray-900">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductView;











