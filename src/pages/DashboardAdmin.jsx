import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { fetchUsers } from '../API/UserApi';
import { getAllProducts } from '../API/productApi';
import { getAllOrdersPage } from '../API/ordersApi';

export const DashboardAdmin = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [showAllLowStock, setShowAllLowStock] = useState(false);

  useEffect(() => {
    const getData = async () => {
        const usersData = await fetchUsers();
        setTotalUsers(usersData.totalRecords);

        const productsData = await getAllProducts();
        setProducts(productsData);
        setTotalProducts(productsData.length);
        const lowStock = productsData.filter(product => product.quentity < 3 && (product.isActive === true || product.isActive === 1));
        setLowStockProducts(lowStock);

        const ordersData = await getAllOrdersPage();
        if (ordersData.payload && Array.isArray(ordersData.payload)) {
          const sortedOrders = ordersData.payload.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
          setNumberOfOrders(ordersData.totalRecords);
          const totalRevenue = sortedOrders.reduce((acc, order) => acc + order.productDto.price * order.quantity, 0);
          setTotalRevenue(totalRevenue);
          setRecentOrders(sortedOrders.slice(0, 5));

          const salesByProduct = sortedOrders.reduce((acc, order) => {
            const productId = order.productDto.id;
            acc[productId] = (acc[productId] || 0) + order.quantity;
            return acc;
          }, {});

          const sortedProducts = Object.keys(salesByProduct)
            .map(productId => {
              const product = productsData.find(p => p.id === parseInt(productId));
              return {
                ...product,
                sales: salesByProduct[productId],
              };
            })
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10);

          setTopProducts(sortedProducts);

          // Calculate Average Order Value
          if (ordersData.totalRecords > 0) {
            setAverageOrderValue((totalRevenue / ordersData.totalRecords).toFixed(2));
          } else {
            setAverageOrderValue(0);
          }

          // Calculate Total Products Sold
          const totalSold = sortedOrders.reduce((acc, order) => acc + order.quantity, 0);
          setTotalProductsSold(totalSold);
        }
    };

    getData();
    const interval = setInterval(() => {
      getData();
    }, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="flex-grow p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-purple-600 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Total Customers</h2>
            <p className="text-3xl mt-2">{totalUsers}</p>
          </div>
          <div className="bg-cyan-500 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Total Sales</h2>
            <p className="text-3xl mt-2">{numberOfOrders}</p>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <p className="text-3xl mt-2">${totalRevenue}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Number of Orders</h2>
            <p className="text-3xl mt-2">{numberOfOrders}</p>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-3xl mt-2">{totalProducts}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Site Vistors</h2>
            <p className="text-3xl mt-2">{totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Average Order Value</h2>
            <p className="text-3xl mt-2">${averageOrderValue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start">
            <h2 className="text-lg font-semibold">Total Products Sold</h2>
            <p className="text-3xl mt-2">{totalProductsSold}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Best-Selling Products</h2>
            <div className="flex-grow bg-gray-100 p-4 rounded-md">
              <ul>
                {topProducts.map(product => (
                  <li key={product.id} className="flex justify-between items-center mb-2">
                    <span>{product.title}</span>
                    <span>{product.sales} sales</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="bg-red-600 text-white p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Stock Alerts</h2>
            <div className="flex-grow flex flex-col">
              <div className="bg-white text-gray-800 p-3 rounded-lg mb-2 flex justify-between items-center">
                <span>Low Stock Products</span>
                <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{lowStockProducts.length}</span>
              </div>
                              {(showAllLowStock ? lowStockProducts : lowStockProducts.slice(0, 4)).map(product => (
                <div key={product.id} className="bg-white text-gray-800 p-3 rounded-lg mb-2 flex justify-between items-center">
                  <span>{product.title}</span>
                  <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{product.quentity} Units</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => setShowAllLowStock(!showAllLowStock)}
            >
              {showAllLowStock ? 'Show Less' : 'View All'}
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Customer ID</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.userDto.id}</td>
                  <td className="py-2">${order.productDto.price * order.quantity}</td>
                  <td className="py-2">{order.statusDto.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}; 