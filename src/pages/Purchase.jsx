import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getProductById } from '../API/productApi';
import { Navbar } from '../components/Navbar';

const Purchase = () => {
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.product);
    const [error, setError] = useState(null);
    const [deliveryOption, setDeliveryOption] = useState('pickup');

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
                    } else {
                        setError('Product not found');
                    }
                } catch (err) {
                    setError('Failed to load product');
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
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-red-500">{error || 'Product not found'}</p>
                </div>
            </div>
        );
    }

    const buyerProtectionFee = (product.price * 0.05) + 0.70;
    const shippingFee = deliveryOption === 'pickup' ? 0.00 : 1.49;
    const total = product.price + buyerProtectionFee + shippingFee;


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Product Summary */}
                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                            <img 
                                src={product.responseDto?.imageUrl || "https://placehold.co/100x100/png"} 
                                alt={product.title}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                            <div>
                                <h2 className="font-semibold text-lg">{product.title}</h2>
                                <p className="text-gray-600">{product.brand?.brand || 'Unbranded'}</p>
                                <p className="text-sm text-gray-500">{product.conditions?.name || 'Condition Unknown'}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-xl mb-4">Address</h3>
                            <button className="w-full flex justify-between items-center text-left p-4 border rounded-lg hover:bg-gray-50">
                                <span>Add your address</span>
                                <span className="text-2xl font-light">+</span>
                            </button>
                        </div>

                        {/* Delivery Option */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-xl mb-4">Delivery option</h3>
                            <div className="space-y-4">
                                <div 
                                    className={`p-4 border rounded-lg cursor-pointer ${deliveryOption === 'pickup' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
                                    onClick={() => setDeliveryOption('pickup')}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <span>📍</span>
                                            <span>Ship to pick-up point</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span>From LKR 0.00</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'pickup' ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                                {deliveryOption === 'pickup' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div 
                                    className={`p-4 border rounded-lg cursor-pointer ${deliveryOption === 'home' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
                                    onClick={() => setDeliveryOption('home')}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <span>🏠</span>
                                            <span>Ship to home</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span>From LKR 1.49</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'home' ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                               {deliveryOption === 'home' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details */}
                         <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-xl mb-4">Delivery details</h3>
                            <button className="w-full flex justify-between items-center text-left p-4 border rounded-lg hover:bg-gray-50">
                                <span>Choose a pick-up point</span>
                                <span className="text-2xl font-light">+</span>
                            </button>
                        </div>

                         {/* Payment */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-xl mb-4">Payment</h3>
                             <button className="w-full flex justify-between items-center text-left p-4 border rounded-lg hover:bg-gray-50">
                                <span>Credit card</span>
                                <span className="text-xl font-light">{'>'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                            <h3 className="font-bold text-xl mb-4">Price summary</h3>
                            <div className="flex justify-between">
                                <span>Order</span>
                                <span>LKR {product.price.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span>Buyer Protection fee</span>
                                <span>LKR {buyerProtectionFee.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>LKR {shippingFee.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                 <div className="flex justify-between font-bold text-lg">
                                    <span>Total to pay</span>
                                    <span>LKR {total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mt-4">
                                Pay
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-2">Your payment details are encrypted and secure</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Purchase; 