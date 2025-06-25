// src/pages/BuyNow.jsx

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getProductById } from "../API/productApi";
import { Navbar } from "../components/Navbar";

const BuyNow = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (location.state?.product) {
        setProduct(location.state.product);
        setLoading(false);
        return;
      }
      if (!product && id) {
        try {
          setLoading(true);
          const productData = await getProductById(id);
          if (productData) {
            setProduct(productData);
            setError(null);
          } else {
            setError("Product not found");
          }
        } catch (err) {
          setError("Failed to load product");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id, location.state, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">{error || "Product not found"}</div>
        </div>
      </div>
    );
  }

  const productImages = product.responseDto?.imageUrl
    ? [product.responseDto.imageUrl]
    : ["https://placehold.co/400x400/png"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left: Image Gallery */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center bg-gray-100 p-8">
          <div className="w-full max-w-md">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg border-2 border-gray-200">
              <img
                src={productImages[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x400/png";
                }}
              />
            </div>
            {productImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-md overflow-hidden ${
                      selectedImage === idx ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product thumbnail ${idx + 1}`}
                      className="w-20 h-20 object-cover"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400/png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/3 flex items-center justify-center p-8 overflow-y-auto border-l border-gray-200">
          <div className="w-full max-w-md border border-gray-200 rounded-lg p-8 shadow-lg bg-white">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="text-gray-600 mb-4">
              {product.conditions?.name || "Condition unknown"} ·{" "}
              <span className="text-blue-600 font-semibold">{product.brand?.brand || "Unbranded"}</span>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">
                LKR {product.price?.toFixed(2)}
              </span>
              <div className="flex items-center text-green-600 font-semibold mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Includes Buyer Protection
              </div>
            </div>

            <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full w-fit text-sm font-medium mb-6">
              Up to -100% postage
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Brand</span>
                <span className="font-semibold text-blue-600">{product.brand?.brand || "Unbranded"}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Condition</span>
                <span className="font-semibold text-gray-800">{product.conditions?.name || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Colour</span>
                <span className="font-semibold text-gray-800">{product.color || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Uploaded</span>
                <span className="font-semibold text-gray-800">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>

            <div className="py-4 text-gray-700">
              <p>{product.description || "No description available"}</p>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Postage</span>
                <span className="font-semibold text-gray-800">from LKR 0.00</span>
              </div>
            </div>

            <div className="bg-teal-50 text-teal-800 p-4 rounded-lg mb-6 flex items-start gap-3">
              <div className="bg-teal-200 p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
                  <path d="M12 17v-1m0 0v-1m0 0v-1m0 0v-1m0 0V9m0 0V8m0 0V7" strokeWidth={1.5} />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={1.5} />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Get discounts of up to 100% off</p>
                <p className="text-sm">for pick-up point and home delivery. See further details at checkout.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition"
                onClick={() => navigate(`/purchase/${product.id}`, { state: { product } })}
              >
                Buy now
              </button>
              <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-bold transition">
                Make an offer
              </button>
              <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg font-semibold transition">
                Ask seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;