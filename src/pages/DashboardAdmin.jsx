import React from 'react';
import { AdminDashboardNavbar } from '../components/AdminDashboardNavbar';
import { RxDashboard } from 'react-icons/rx';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

export const DashboardAdmin = () => {
  return (
    <div className="dashboard-admin-container flex flex-col min-h-screen">
      <AdminDashboardNavbar />
      <div className="flex flex-1">
        <div className="w-64 bg-white shadow-md p-4 border-r border-gray-200">
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm uppercase mb-2">Main</h3>
            <ul>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-purple-700 bg-purple-100 rounded-lg">
                  <RxDashboard className="w-5 h-5 mr-3" />
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaShoppingCart className="w-5 h-5 mr-3" />
                  POS
                </a>
              </li>
            </ul>
          </div>

          {/* User Management */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm uppercase mb-2">User</h3>
            <ul>
              <li className="mb-2">
                <a href="/admin/users" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaUser className="w-5 h-5 mr-3" />
                  User Management
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-gray-400 text-sm uppercase mb-2">Inventory</h3>
            <ul>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 9a1 1 0 011-1h.5a1 1 0 011 1V10a1 1 0 01-1 1H6a1 1 0 01-1-1V9zm4 0a1 1 0 011-1h.5a1 1 0 011 1V10a1 1 0 01-1 1H10a1 1 0 01-1-1V9zm4 0a1 1 0 011-1h.5a1 1 0 011 1V10a1 1 0 01-1 1H14a1 1 0 01-1-1V9z" clipRule="evenodd"></path>
                  </svg>
                  Products
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 3a1 1 0 100 2h2a1 1 0 100-2h-2z"></path>
                    <path fillRule="evenodd" d="M4 14a2 2 0 002 2h8a2 2 0 002-2V7.167A.833.833 0 0015.167 6H4v8zM3 6h-.5A1.5 1.5 0 001 7.5v.083A.833.833 0 001.833 9H3V6z" clipRule="evenodd"></path>
                  </svg>
                  Custom Categories
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                  Non Scan Products
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 3a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1H7z"></path>
                    <path fillRule="evenodd" d="M18 10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v4zm-1 0H3v2h14V10z" clipRule="evenodd"></path>
                  </svg>
                  Low Stocks
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  Category
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  Tax
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  Payout Category
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm uppercase mb-2">Discount</h3>
            <ul>
              <li className="mb-2">
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.293 8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  Discount
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-grow p-4 md:p-8">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-purple-600 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Total Transactions</h2>
              <p className="text-3xl mt-2">4</p>
            </div>
            <div className="bg-cyan-500 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Total Sales</h2>
              <p className="text-3xl mt-2">30,400.00</p>
            </div>
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Banking</h2>
              <p className="text-3xl mt-2">0.00</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Payouts</h2>
              <p className="text-3xl mt-2">0.00</p>
            </div>
            <div className="bg-purple-700 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Difference</h2>
              <p className="text-3xl mt-2">30,200.00</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Total Transactions</h2>
              <p className="text-3xl mt-2">2</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Total Sales</h2>
              <p className="text-3xl mt-2">3,530.00</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Banking</h2>
              <p className="text-3xl mt-2">400.00</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Payouts</h2>
              <p className="text-3xl mt-2">500.00</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
              <h2 className="text-lg font-semibold">Difference</h2>
              <p className="text-3xl mt-2">2,630.00</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Top 10 Products</h2>
              <div className="flex-grow bg-gray-100 flex items-center justify-center rounded-md">
                <p>Chart for Top 10 Products</p>
              </div>
            </div>

            {/* Stock Alerts */}
            <div className="bg-red-600 text-white p-4 rounded-lg shadow-md flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Stock Alerts</h2>
              <div className="flex-grow flex flex-col">
                <div className="bg-white text-gray-800 p-3 rounded-lg mb-2 flex justify-between items-center">
                  <span>Low Stock Products</span>
                  <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">3</span>
                </div>
                <div className="bg-white text-gray-800 p-3 rounded-lg mb-2 flex justify-between items-center">
                  <span>Cloths</span>
                  <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">10 Units</span>
                </div>
                <div className="bg-white text-gray-800 p-3 rounded-lg flex justify-between items-center">
                  <span>Watches</span>
                  <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">6 Units</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 