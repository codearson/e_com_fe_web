import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FaUser, FaQuestionCircle, FaShoppingBag } from 'react-icons/fa';
import { LuArrowLeftFromLine } from "react-icons/lu";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeView = location.pathname.split('/').pop();

  return (
    <div className={`bg-white shadow-md border-r border-gray-200 transition-all duration-300 flex flex-col lg:flex-shrink-0 ${sidebarOpen ? 'w-60' : 'w-20'} h-full`}>
      <div className={`flex items-center p-4 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
        {sidebarOpen && <h3 className="text-gray-400 text-sm uppercase">Main</h3>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
          <LuArrowLeftFromLine className={`w-6 h-6 transition-transform duration-300 ${!sidebarOpen && 'rotate-180'}`} />
        </button>
      </div>
      <div className="p-3 flex-grow overflow-y-auto">
        <ul>
          <li className="mb-2">
            <a href="#" onClick={() => navigate('/admin/dashboard')} className={`flex items-center p-2 rounded-lg ${activeView === 'dashboard' ? 'text-purple-700 bg-purple-100' : 'text-gray-700 hover:bg-gray-100'}`}>
              <RxDashboard className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </a>
          </li>
        </ul>

        {/* User Management */}
        <div className="mb-6">
          {sidebarOpen && <h3 className="text-gray-400 text-sm uppercase mb-2">User</h3>}
          <ul>
            <li className="mb-2">
              <a href="/admin/users" className={`flex items-center p-2 rounded-lg ${activeView === 'users' ? 'text-purple-700 bg-purple-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FaUser className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">User Management</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="/admin/inquiry" onClick={(e) => { e.preventDefault(); navigate('/admin/inquiry'); }} className={`flex items-center p-2 rounded-lg ${activeView === 'inquiry' ? 'text-purple-700 bg-purple-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FaQuestionCircle className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">Inquiry</span>}
              </a>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          {sidebarOpen && <h3 className="text-gray-400 text-sm uppercase mb-2">Inventory</h3>}
          <ul>
            <li className="mb-2">
              <a href="/product-management" onClick={(e) => { e.preventDefault(); navigate('/product-management'); }} className={`flex items-center p-2 rounded-lg ${window.location.pathname === '/product-management' ? 'text-purple-700 bg-purple-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 9a1 1 0 011-1h.5a1 1 0 011 1V10a1 1 0 01-1 1H6a1 1 0 01-1-1V9zm4 0a1 1 0 011-1h.5a1 1 0 011 1V10a1 1 0 01-1 1H10a1 1 0 01-1-1V9zm4 0a1 1 0 011-1h.5a1 1 0 011 1V10a1 1 0 01-1 1H14a1 1 0 01-1-1V9z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Products</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 3a1 1 0 100 2h2a1 1 0 100-2h-2z"></path>
                  <path fillRule="evenodd" d="M4 14a2 2 0 002 2h8a2 2 0 002-2V7.167A.833.833 0 0015.167 6H4v8zM3 6h-.5A1.5 1.5 0 001 7.5v.083A.833.833 0 001.833 9H3V6z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Custom Categories</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Non Scan Products</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="/admin/low-stocks" onClick={(e) => { e.preventDefault(); navigate('/admin/low-stocks'); }} className={`flex items-center p-2 rounded-lg ${activeView === 'low-stocks' ? 'text-purple-700 bg-purple-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 3a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1H7z"></path>
                  <path fillRule="evenodd" d="M18 10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v4zm-1 0H3v2h14V10z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Low Stocks</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="/admin/order-management" onClick={(e) => { e.preventDefault(); navigate('/admin/order-management'); }} className={`flex items-center p-2 rounded-lg ${activeView === 'order-management' ? 'text-purple-700 bg-purple-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FaShoppingBag className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">Order Management</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Category</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Tax</span>}
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Payout Category</span>}
              </a>
            </li>
          </ul>
        </div>

        <div>
          {sidebarOpen && <h3 className="text-gray-400 text-sm uppercase mb-2">Discount</h3>}
          <ul>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                {sidebarOpen && <span className="ml-3">Discount</span>}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;