import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProductById } from '../API/productApi';

const ProductView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

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
            setError('Product not found');
          }
        } catch (err) {
          console.error('Error fetching product:', err);
          setError('Failed to load product');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, location.state, product]);
  
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
              {error || 'Product not found'}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Create an array of images (use actual image or fallback)
  const productImages = product.responseDto?.imageUrl 
    ? [product.responseDto.imageUrl] 
    : ["https://placehold.co/400x400/png"];
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            Home / {product.productCategory?.name || 'Products'} / {product.title}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-3">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.title} 
                  className="w-full h-[400px] object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x400/png';
                  }}
                />
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`border-2 rounded-md overflow-hidden ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} ${index + 1}`} 
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x400/png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>    

            {/* Product Details */} 
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-gray-600">Brand: {product.brand?.brand || 'Unbranded'}</span>
                  </div>
                  <span className="text-gray-500">|</span>
                  <div className="flex items-center">
                    <span className={product.quentity > 0 ? 'text-green-500' : 'text-red-500'}>
                      {product.quentity > 0 ? `${product.quentity} items in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900">LKR {product.price?.toFixed(2)}</div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description || 'No description available'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Size Information */}
                {product.size && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Size</h3>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-700">{product.size}</p>
                    </div>
                  </div>
                )}

                {/* Color Information */}
                {product.color && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Color</h3>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-700">{product.color}</p>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                {product.createdAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Listed On</h3>
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
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Condition</h3>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-700">{product.conditions.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors ${
                    product.quentity > 0 
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={product.quentity <= 0}
                >
                  Add to Cart
                </button>
                <button 
                  className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors ${
                    product.quentity > 0 
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={product.quentity <= 0}
                  onClick={() => navigate(`/buyNow/${id}`, { state: { product } })}
                >
                  Buy Now
                </button>
              </div>

              {/* Category Info */}
              {product.productCategory && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Category</h3>
                      <p className="text-gray-500">{product.productCategory.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductView;











