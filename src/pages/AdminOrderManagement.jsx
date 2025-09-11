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

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await getAllOrdersPage(page, 10);
                if (response.payload) {
                    setOrders(response.payload);
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

    if (loading) {
        return <AdminLayout><div>Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Order Management</h1>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Order ID</th>
                                <th className="py-2 px-4 border-b">Customer ID</th>
                                <th className="py-2 px-4 border-b">Customer</th>
                                <th className="py-2 px-4 border-b">Shipping Address</th>
                                <th className="py-2 px-4 border-b">Total</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="py-2 px-4 border-b">{order.id}</td>
                                    <td className="py-2 px-4 border-b">{order.userDto?.id}</td>
                                    <td className="py-2 px-4 border-b">{`${order.userDto?.firstName} ${order.userDto?.lastName}`}</td>
                                    <td className="py-2 px-4 border-b">{order.shippingAddressDto?.address}</td>
                                    <td className="py-2 px-4 border-b">
                                        {`$${(order.productDto?.price * order.quantity).toFixed(2)}`}
                                    </td>
                                    <td className="py-2 px-4 border-b">{order.statusDto?.type}</td>
                                    <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => handleView(order)} className="text-blue-500 hover:text-blue-700 mr-2">
                                            <FaEye />
                                        </button>
                                        <button onClick={() => handleDelete(order)} className="text-red-500 hover:text-red-700 mr-2">
                                            <FaTrash />
                                        </button>
                                        {order.statusDto?.type !== 'DELIVERED' && (
                                            <button onClick={() => handleDeliver(order)} className="text-green-500 hover:text-green-700">
                                                <FaTruck />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
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
                                <p><strong>Status:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedOrder.statusDto?.type === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedOrder.statusDto?.type}</span></p>
                                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="md:col-span-2 bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Product Information</h3>
                                <p><strong>Product:</strong> {selectedOrder.productDto?.title}</p>
                                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                                <p><strong>Price per item:</strong> ${selectedOrder.productDto?.price.toFixed(2)}</p>
                                <p><strong>Total:</strong> <span className="font-bold text-xl">{`$${(selectedOrder.productDto?.price * selectedOrder.quantity).toFixed(2)}`}</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
};

export default AdminOrderManagement;
