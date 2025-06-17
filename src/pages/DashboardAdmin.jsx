import React from 'react';
import { AdminDashboardNavbar } from '../components/AdminDashboardNavbar';

export const DashboardAdmin = () => {
  return (
    <div className="dashboard-admin-container flex flex-col min-h-screen">
      <AdminDashboardNavbar />
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
  );
}; 