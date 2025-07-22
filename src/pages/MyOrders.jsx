import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";

const mockOrders = [
  {
    id: "CTH-89765",
    status: "On Shipping",
    address: "Illinois, Sri Lanka",
    estimatedArrival: "28 May 2025",
    items: [
      {
        name: "Japan Green Outer",
        price: "Rs 1200.000",
        size: "M",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=256&h=256&q=80",
      },
      {
        name: "White off jacket",
        price: "Rs 2450.000",
        size: "L",
        image: "https://images.unsplash.com/photo-1513089176717-55db930c2e2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fFdoaXRlJTIwb2ZmJTIwamFja2V0fGVufDB8fDB8fHww",
      },
    ],
    total: "Rs 849.000",
    destination: "Jhon's House, Sri Lanka",
    statusBadge: "On Delivery",
  },
  {
    id: "CTH-45672",
    status: "On Shipping",
    address: "Illinois, Sri Lanka]",
    estimatedArrival: "29 May 2025",
    items: [
      {
        name: "Soft Hoodie",
        price: "Rs 2990.000",
        size: "L",
        image: "https://media.istockphoto.com/id/2154756656/photo/template-blank-flat-black-hoodie-top-view-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=2s6pHWh-8ilz-4VAldiX7WghksVMcO93CBbb_Kui9QQ=",
      },
    ],
    total: "Rs 300.000",
    destination: "Jhon's House, Sri Lanka",
    statusBadge: "On Delivery",
  },
];

const tabs = [
  { key: "onShipping", label: "On Shipping" },
  { key: "arrived", label: "Arrived" },
  { key: "canceled", label: "Canceled" },
];

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("onShipping");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userData = await getUserByEmail(email);
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 w-full max-w-7xl mx-auto py-8 px-4 gap-8">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 h-fit">
          <div className="mb-6">
            <div className="font-bold text-gray-800 text-xl">{user ? `${user.firstName} ${user.lastName}` : ""}</div>
          </div>
          <nav className="flex flex-col gap-2">
            <button
              className="text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium text-gray-700">Wishlist</button>
            <button className="text-left px-4 py-2 rounded-lg bg-gray-100 font-semibold text-blue-600">My Order</button>
            <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium text-gray-700">Saved Address</button>
            <button
              className="text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 font-semibold mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </aside>
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
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">{order.id}</span>
                    <span className="text-gray-400 text-sm">{order.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">Estimated arrival: {order.estimatedArrival}</span>
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">{order.statusBadge}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-gray-500 text-sm">Size: {item.size}</div>
                      </div>
                      <div className="font-bold text-gray-700">{item.price}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
                  <div className="text-gray-500 text-sm">To: {order.destination}</div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700">Total: {order.total}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders; 