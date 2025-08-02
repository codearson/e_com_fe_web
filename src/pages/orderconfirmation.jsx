import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../API/ordersApi';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BASE_BACKEND_URL } from '../API/config';
import { useMessageContext } from '../utils/MessageContext.jsx';
import { decodeJwt } from '../API/UserApi';

const primaryColor = '#1976d2'; // blue
const accentColor = '#ff9800';  // orange
const bgColor = '#f5f5f5';      // light gray
const cardColor = '#fff';
const mainText = '#222';
const secondaryText = '#666';

const labelStyle = {
  color: secondaryText,
  fontWeight: 500,
  fontSize: 14,
  marginBottom: 2,
};

const valueStyle = {
  color: mainText,
  fontWeight: 600,
  fontSize: 16,
  marginBottom: 8,
};

const sectionTitleStyle = {
  color: primaryColor,
  fontWeight: 700,
  fontSize: 18,
  margin: '18px 0 8px',
  letterSpacing: 0.5,
};

const cardStyle = {
  maxWidth: 500,
  margin: '2rem auto',
  padding: 32,
  background: cardColor,
  borderRadius: 16,
  boxShadow: '0 2px 16px #e0e0e0',
  fontFamily: 'Inter, Arial, sans-serif',
};

const buttonStyle = {
  marginTop: 24,
  padding: '12px 32px',
  background: primaryColor,
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addMessage } = useMessageContext();

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then(data => {
          setOrder(data);
          setLoading(false);
          
          // Add permanent order confirmation message
          const token = localStorage.getItem("accessToken");
          if (token) {
            const decoded = decodeJwt(token);
            const email = decoded?.sub;
            if (email) {
              const o = data.responseDto;
              const product = o.productDto || {};
              const orderTotal = (product.price * o.quantity).toFixed(2);
              const deliveryDate = o.estimateDeliveryDate ? new Date(o.estimateDeliveryDate).toLocaleDateString() : 'TBD';
              
              const confirmationMessage = `Order #${o.id} confirmed! You ordered ${o.quantity}x ${product.title} for LKR ${orderTotal}. Estimated delivery: ${deliveryDate}. Track your order in My Orders.`;
              addMessage(decoded.userId || email, confirmationMessage);
            }
          }
        })
        .catch(() => {
          setError('Failed to fetch order');
          setLoading(false);
        });
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId, addMessage]);

  if (loading) return <div style={{ background: bgColor, minHeight: '100vh', paddingTop: 80, textAlign: 'center' }}><Navbar /><div>Loading...</div><Footer /></div>;
  if (error) return <div style={{ background: bgColor, minHeight: '100vh', paddingTop: 80, textAlign: 'center' }}><Navbar /><div>{error}</div><Footer /></div>;
  if (!order || !order.responseDto) return <div style={{ background: bgColor, minHeight: '100vh', paddingTop: 80, textAlign: 'center' }}><Navbar /><div>No order found.</div><Footer /></div>;

  const o = order.responseDto;
  const product = o.productDto || {};
  const user = o.userDto || {};
  const shipping = o.shippingAddressDto || {};
  const postage = o.postagePartnerDto || {};

  return (
    <div style={{ background: bgColor, minHeight: '100vh', paddingTop: 0, paddingBottom: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, paddingTop: 40, paddingBottom: 40 }}>
        <div style={cardStyle}>
          <h1 style={{ color: primaryColor, fontWeight: 800, fontSize: 28, marginBottom: 24, letterSpacing: 1 }}>Order Confirmation</h1>
          <div style={{ marginBottom: 18 }}>
            <div style={labelStyle}>Order ID</div>
            <div style={valueStyle}>{o.id}</div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={labelStyle}>Created At</div>
            <div style={valueStyle}>{new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={labelStyle}>Estimated Delivery</div>
            <div style={valueStyle}>{o.estimateDeliveryDate ? new Date(o.estimateDeliveryDate).toLocaleDateString() : '-'}</div>
          </div>
          <div style={sectionTitleStyle}>Product</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <img
              src={`${BASE_BACKEND_URL}${product.imageUrl || '/default-image.jpg'}`}
              alt={product.title}
              style={{
                width: 70,
                height: 70,
                objectFit: 'cover',
                borderRadius: 12,
                marginRight: 18,
                border: `1.5px solid ${bgColor}`,
                background: bgColor,
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x400/png';
              }}
            />
            <div>
              <div style={{ ...valueStyle, fontSize: 18 }}>{product.title}</div>
              <div style={{ color: secondaryText, fontSize: 14 }}>{product.brandDto?.brandName}</div>
              <div style={{ color: secondaryText, fontSize: 14 }}>Condition: {product.conditionsDto?.conditionType}</div>
              <div style={{ color: secondaryText, fontSize: 14 }}>
                Price: <span style={{ color: accentColor, fontWeight: 700 }}>LKR{product.price}</span>
              </div>
              <div style={{ color: secondaryText, fontSize: 14 }}>Quantity: {o.quantity}</div>
            </div>
          </div>
          <div style={sectionTitleStyle}>Shipping Address</div>
          <div style={{ marginBottom: 18 }}>
            <div style={valueStyle}>{shipping.name}</div>
            <div style={{ color: secondaryText, fontSize: 15 }}>{shipping.address}</div>
            <div style={{ color: secondaryText, fontSize: 15 }}>{shipping.district} {shipping.province} {shipping.postalCode}</div>
            <div style={{ color: secondaryText, fontSize: 15 }}>Mobile: {shipping.mobileNumber}</div>
          </div>

          <div style={sectionTitleStyle}>Postage Partner</div>
          <div style={{ marginBottom: 8 }}>
            <div style={valueStyle}>{postage.partnerName}</div>
          </div>
          <button
            className="w-full mt-6 bg-[#1E90FF] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1876cc] transition-colors"
            onClick={() => navigate('/myorders')}
          >
            Back to My Orders
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
