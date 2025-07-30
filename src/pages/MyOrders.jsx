import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { getOrdersByUserId } from "../API/ordersApi";
import { BASE_BACKEND_URL } from "../API/config";



const tabs = [
  { key: "onShipping", label: "On Shipping" },
  { key: "arrived", label: "Arrived" },
  { key: "canceled", label: "Canceled" },
];

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("onShipping");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userData = await getUserByEmail(email);
          setUser(userData);
          
          // Fetch orders for the user
          if (userData && userData.id) {
            try {
              const ordersResponse = await getOrdersByUserId(userData.id);
              if (ordersResponse.responseDto && Array.isArray(ordersResponse.responseDto)) {
                setOrders(ordersResponse.responseDto);
              } else {
                setOrders([]);
              }
            } catch (error) {
              console.error('Error fetching orders:', error);
              setOrders([]);
            }
          }
        }
      } else {
        setUser(null);
        setOrders([]);
      }
      setLoading(false);
    };
    fetchUserAndOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 w-full max-w-7xl mx-auto py-8 px-4">
        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`pb-2 px-2 font-medium text-lg focus:outline-none transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Orders List */}
          <div className="flex flex-col gap-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No orders found.</div>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700">Order #{order.id}</span>
                      <span className="text-gray-400 text-sm">
                        {order.shippingAddressDto?.address || 'Address not available'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm">
                        Estimated arrival: {order.estimateDeliveryDate ? new Date(order.estimateDeliveryDate).toLocaleDateString() : 'TBD'}
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                        {order.statusDto?.statusName || 'Processing'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0">
                      <img 
                        src={`${BASE_BACKEND_URL}${order.productDto?.imageUrl || '/default-image.jpg'}`}
                        alt={order.productDto?.title || 'Product'}
                        className="w-20 h-20 rounded-xl object-cover border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x400/png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{order.productDto?.title || 'Product Name'}</div>
                        <div className="text-gray-500 text-sm">Brand: {order.productDto?.brandDto?.brandName || 'N/A'}</div>
                        <div className="text-gray-500 text-sm">Condition: {order.productDto?.conditionsDto?.conditionType || 'N/A'}</div>
                      </div>
                      <div className="font-bold text-gray-700">LKR {order.productDto?.price || '0'}</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
                    <div className="text-gray-500 text-sm">
                      To: {order.shippingAddressDto?.name || 'N/A'}, {order.shippingAddressDto?.address || 'N/A'}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-700">Quantity: {order.quantity || 1}</span>
                      <span className="font-semibold text-gray-700">
                        Total: LKR {(order.productDto?.price || 0) * (order.quantity || 1)}
                      </span>
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        onClick={() => navigate(`/orderconfirmation/${order.id}`)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders; 