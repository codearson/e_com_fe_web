import React, { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../API/cartApi";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BASE_BACKEND_URL } from "../API/config";
import { useCart } from "../utils/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCart(userId);
      const items = Array.isArray(res?.data?.responseDto)
        ? res.data.responseDto
        : [];
      setCartItems(items);
      setSelectedItems(items.map(item => item.product.id));
      refreshCartCount();
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (e, productId) => {
    e.stopPropagation();
    if (!userId) {
      alert("Please log in to remove items from cart.");
      return;
    }

    setRemovingItem(productId);
    try {
      const res = await removeFromCart(userId, productId);
      if (res?.data?.status) {
        await fetchCart();
      } else {
        alert(res?.data?.errorDescription || "Failed to remove from cart.");
      }
    } catch (err) {
      console.error("Remove from cart failed:", err);
      alert("Failed to remove from cart. Please try again.");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleNavigate = (productId) => {
    navigate(`/productView/${productId}`);
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const total = cartItems
    .filter(item => selectedItems.includes(item.product.id))
    .reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {!userId ? (
            <p className="text-gray-500">Please log in to view your cart.</p>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No items in cart.</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              <ul>
                {cartItems.map((item) => {
                  const product = item.product || {};
                  return (
                    <li
                      key={product.id}
                      className="flex items-center mb-6 border-b pb-4"
                    >
                      <input
                        type="checkbox"
                        className="mr-4"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                      />
                      <img
                        src={
                          product.imageUrl
                            ? `${BASE_BACKEND_URL}${product.imageUrl}`
                            : "https://placehold.co/100x100/png"
                        }
                        alt={product.title}
                        width={100}
                        height={100}
                        className="rounded mr-4 object-cover cursor-pointer"
                        onClick={() => handleNavigate(product.id)}
                      />
                      <div className="flex-1 cursor-pointer" onClick={() => handleNavigate(product.id)}>
                        <div className="font-semibold text-lg">{product.title}</div>
                        <div className="text-gray-600">{product.brandDto?.brandName}</div>
                        <div className="text-lg font-bold text-green-600">
                          LKR {product.price?.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <button
                        onClick={(e) => handleRemove(e, product.id)}
                        disabled={removingItem === product.id}
                        className={`p-3 rounded-full text-white transition-colors ${
                          removingItem === product.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        title="Remove from cart"
                      >
                        {removingItem === product.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 text-right">
                <div className="text-l font-bold">Total: LKR {total.toFixed(2)}</div>
                <button
                  onClick={() => {
                    const firstSelectedId = selectedItems[0];
                    const selectedProduct = cartItems.find(item => item.product.id === firstSelectedId)?.product;
                    if (selectedProduct) {
                      navigate(`/checkout/${firstSelectedId}`, { state: { product: selectedProduct } });
                    }
                  }}
                  className={`bg-green-500 text-white px-3 py-3 rounded-lg hover:bg-green-600 transition-colors mt-4 ${
                    selectedItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={selectedItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;