import React, { useEffect, useState } from 'react';
import { getAllOrdersPage, updateOrder, deleteOrder } from '../API/ordersApi';
import { FaEye, FaTrash, FaTruck } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';

const AdminOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for client-side filtering
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filter, setFilter] = useState({ type: 'customer', term: '' });

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await getAllOrdersPage(page, 10);
                if (response.payload) {
                    setOrders(response.payload);
                    setFilteredOrders(response.payload); // Initialize filtered orders
                    setTotalPages(Math.ceil(response.totalRecords / 10));
                } else {
                    setError('Failed to fetch orders.');
                }
            } catch (err) {
                setError('An error occurred while fetching orders.');
            }
            setLoading(false);
        };

        fetchOrders();
    }, [page]);

    // Effect for client-side filtering
    useEffect(() => {
        let result = orders;
        if (filter.term) {
            result = orders.filter(order => {
                if (filter.type === 'customer') {
                    const customerName = `${order.userDto?.firstName} ${order.userDto?.lastName}`;
                    return customerName.toLowerCase().includes(filter.term.toLowerCase());
                }
                if (filter.type === 'orderId') {
                    return String(order.id).toLowerCase().includes(filter.term.toLowerCase());
                }
                if (filter.type === 'date') {
                    // Note: This matches if the date string includes the filter term. 
                    // For exact date match, new Date().toLocaleDateString() is better but can be tricky with timezones.
                    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
                    return orderDate === filter.term;
                }
                return true;
            });
        }
        setFilteredOrders(result);
    }, [filter, orders]);

    const handleDeliver = async (order) => {
        try {
            const updatedOrder = { ...order, statusDto: { type: 'DELIVERED' } };
            const response = await updateOrder(updatedOrder);
            if (response.errorDescription) {
                setError(response.errorDescription);
            } else {
                setOrders(orders.map(o => o.id === order.id ? updatedOrder : o));
            }
        } catch (err) {
            setError('An error occurred while delivering the order. Please check your backend CORS configuration.');
        }
    };

    const handleDelete = async (order) => {
        try {
            const updatedOrder = { ...order, isActive: false };
            const response = await updateOrder(updatedOrder);
            if (response.errorDescription) {
                setError(response.errorDescription);
            } else {
                setOrders(orders.filter(o => o.id !== order.id));
            }
        } catch (err) {
            setError('An error occurred while deleting the order. Please check your backend CORS configuration.');
        }
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <AdminLayout><div>Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
                </div>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <select
                            value={filter.type}
                            onChange={e => setFilter({ type: e.target.value, term: '' })}
                            className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="customer">Customer</option>
                            <option value="orderId">Order ID</option>
                            <option value="date">Date</option>
                        </select>
                        <input
                            type={filter.type === 'date' ? 'date' : 'text'}
                            placeholder={`Filter by ${filter.type}...`}
                            value={filter.term}
                            onChange={e => setFilter({ ...filter, term: e.target.value })}
                            className="block w-full md:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">#{order.id}</span>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{`${order.userDto?.firstName} ${order.userDto?.lastName}`}</div>
                                            <div className="text-sm text-gray-500">ID: {order.userDto?.id}</div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{`${(order.productDto?.price * order.quantity).toFixed(2)}`}</span>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.statusDto?.type)}`}>
                                                {order.statusDto?.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button onClick={() => handleView(order)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                                                    <FaEye size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(order)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500 transition-colors duration-200">
                                                    <FaTrash size={18} />
                                                </button>
                                                {order.statusDto?.type !== 'DELIVERED' && (
                                                    <button onClick={() => handleDeliver(order)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-green-500 transition-colors duration-200">
                                                        <FaTruck size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
            <Modal open={isModalOpen} onClose={closeModal}>
                {selectedOrder && (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                                <p><strong>Name:</strong> {`${selectedOrder.userDto?.firstName} ${selectedOrder.userDto?.lastName}`}</p>
                                <p><strong>Customer ID:</strong> {selectedOrder.userDto?.id}</p>
                                <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddressDto?.address}</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Order Information</h3>
                                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                <p><strong>Status:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedOrder.statusDto?.type)}`}>{selectedOrder.statusDto?.type}</span></p>
                                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="md:col-span-2 bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Product Information</h3>
                                <p><strong>Product:</strong> {selectedOrder.productDto?.title}</p>
                                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                                <p><strong>Price per item:</strong> ${selectedOrder.productDto?.price.toFixed(2)}</p>
                                <p><strong>Total:</strong> <span className="font-bold text-xl">{`${(selectedOrder.productDto?.price * selectedOrder.quantity).toFixed(2)}`}</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
};

export default AdminOrderManagement;
