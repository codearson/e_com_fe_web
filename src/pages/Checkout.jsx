import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getProductById } from "../API/productApi";
import { getAllShippingAddressesBySearch, saveShippingAddress, updateShippingAddress } from "../API/shippingAddressApi";
import { saveOrder } from "../API/ordersApi";
import { saveBrand, updateBrand, getAllBrands } from "../API/brandApi";
import { saveCondition, updateCondition, getAllConditions } from "../API/conditionApi";
import { Navbar } from "../components/Navbar";
import { decodeJwt } from "../API/UserApi";
import { getUserByEmail } from "../API/config";
import provinceDistrictData from "../utils/provinceDistrictData";
import { extractArray } from "../utils/extractArray";
import { useMessageContext } from '../utils/MessageContext.jsx';
import Modal from '../components/Modal';
import { FaRegCreditCard, FaRegUser, FaCheckCircle, FaExclamationCircle, FaRegQuestionCircle } from 'react-icons/fa';

const PaymentDetails = ({ userId, onSuccess, onError, onClose }) => {
  const { addMessage } = useMessageContext();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Get product info for message
  const product = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('checkoutProduct'));
    } catch {
      return null;
    }
  })[0];
  const orderTotal = product ? (product.price * (product.quantity || 1)).toFixed(2) : '';
  const productTitle = product ? (product.title.length > 20 ? product.title.slice(0, 20) + '…' : product.title) : '';

  const allFilled = cardNumber && expiry && cvc && cardholder;

  const handleTrue = () => {
    if (allFilled) {
      const msg = `Your order placed successfully`;
      setSuccessMsg(msg);
      setErrorMsg('');
      addMessage(userId, msg);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        navigate(`/orderconfirmation/${orderId}`);
      }, 1500);
    }
  };

  const handleFalse = () => {
    setErrorMsg('Payment failed. Please check your details.');
    setSuccessMsg('');
    if (onError) onError();
  };

  return (
    <div style={{ minWidth: 340, maxWidth: 400, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(30,144,255,0.08)', padding: 32, position: 'relative' }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 20, color: '#1E90FF', textAlign: 'center', letterSpacing: 0.5 }}>Payment Details</h2>
      <form autoComplete="off" onSubmit={e => e.preventDefault()}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>Card Number</label>
          <div style={{ position: 'relative' }}>
            <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Card Number" maxLength={19} style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1.5px solid #d1e6fa', borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }} />
            <FaRegCreditCard style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#1E90FF', fontSize: 20 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>Expiry</label>
            <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM / YY" maxLength={7} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #d1e6fa', borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }} />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>CVC</label>
            <input type="text" value={cvc} onChange={e => setCvc(e.target.value)} placeholder="CVC" maxLength={4} style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1.5px solid #d1e6fa', borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }} />
            <FaRegQuestionCircle style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#1E90FF', fontSize: 18 }} />
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>Cardholder Name</label>
          <div style={{ position: 'relative' }}>
            <input type="text" value={cardholder} onChange={e => setCardholder(e.target.value)} placeholder="Cardholder Name" style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1.5px solid #d1e6fa', borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }} />
            <FaRegUser style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#1E90FF', fontSize: 20 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <button type="button" onClick={handleTrue} disabled={!allFilled} style={{ flex: 1, background: allFilled ? '#1E90FF' : '#b3d8fd', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, boxShadow: allFilled ? '0 2px 8px rgba(30,144,255,0.08)' : 'none', transition: 'background 0.2s' }}>
            
            Pay Now</button>
          <button type="button" onClick={handleFalse} className="px-4 py-2 border border-[#1E90FF] text-[#1E90FF] rounded hover:bg-[#e6f2ff] transition-colors"
          >Cancel</button>
        </div>
      </form>
      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E90FF', background: '#e6f7ff', borderRadius: 8, padding: '12px 16px', fontWeight: 600, marginBottom: 8, marginTop: 8, fontSize: 16 }}>
          <FaCheckCircle style={{ color: '#43a047', fontSize: 22 }} />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f44336', background: '#ffebee', borderRadius: 8, padding: '12px 16px', fontWeight: 600, marginBottom: 8, marginTop: 8, fontSize: 16 }}>
          <FaExclamationCircle style={{ color: '#f44336', fontSize: 22 }} />
          {errorMsg}
        </div>
      )}
    </div>
  );
};

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({});
  const [addressLoading, setAddressLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [addressLimitError, setAddressLimitError] = useState("");
  // Add modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  // Add state for province/district dropdowns
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  // Add state for phone validation error
  const [phoneError, setPhoneError] = useState("");
  const [brands, setBrands] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // Fetch product if not in state
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
            setError(null);
          } else {
            setError("Product not found");
          }
        } catch (err) {
          setError("Failed to load product");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [id, location.state, product]);

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getAllBrands();
      setBrands(extractArray(res));
    };
    fetchBrands();
  }, []);

  // Fetch conditions on mount
  useEffect(() => {
    const fetchConditions = async () => {
      const res = await getAllConditions();
      setConditions(extractArray(res));
    };
    fetchConditions();
  }, []);

  // Helper to fetch and set primary address
  const fetchAndSetPrimaryAddress = async (preferredAddressId = null) => {
    setAddressLoading(true);
    const addrs = await getAllShippingAddressesBySearch();
    // Get user email from JWT
    const token = localStorage.getItem("accessToken");
    let currentUserId = null;
    if (token) {
      try {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userObj = await getUserByEmail(email);
          if (userObj && userObj.id) {
            currentUserId = userObj.id;
          }
        }
      } catch (e) { currentUserId = null; }
    }
    // Filter addresses for current user
    const userAddresses = addrs.filter(address => address.userDto?.id === currentUserId && address.isActive);
    setAddresses(userAddresses);
    let selected = null;
    // Use saved address from localStorage if available
    const savedAddressId = localStorage.getItem('checkoutSelectedAddressId');
    if (preferredAddressId) {
      selected = userAddresses.find(a => a.id === preferredAddressId);
    }
    if (!selected && savedAddressId) {
      selected = userAddresses.find(a => String(a.id) === savedAddressId);
    }
    if (!selected) {
      selected = userAddresses.find(a => a.isPrimary || a.is_primary);
    }
    if (!selected && userAddresses.length > 0) selected = userAddresses[0];
    if (selected) {
      setAddress(selected);
      setAddressForm(selected);
    } else {
      setAddress(null);
      setAddressForm({
        country: "United Kingdom",
        firstName: "",
        lastName: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        postcode: "",
        email: "",
        phone: "",
      });
    }
    setAddressLoading(false);
  };

  useEffect(() => {
    fetchAndSetPrimaryAddress();
    // Get userId for payment context
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          getUserByEmail(email).then(userObj => {
            if (userObj && userObj.id) setUserId(userObj.id);
          });
        }
      } catch (e) { setUserId(null); }
    }
  }, []);

  // When addressForm or its province changes, update districts
  useEffect(() => {
    if (addressForm.province) {
      const found = provinceDistrictData.find(p => p.province === addressForm.province);
      setFilteredDistricts(found ? found.districts : []);
    } else {
      setFilteredDistricts([]);
    }
  }, [addressForm, addressForm.province]);

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setAddressForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setAddressForm(prev => ({ ...prev, [name]: value }));
    }
    // Phone validation
    if (name === "mobileNumber") {
      if (!/^\d{10}$/.test(value)) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const normalize = str => (str || "").trim().toLowerCase();

  const handleAddressSave = async (e) => {
    e.preventDefault();
    // Phone validation before submit
    if (!/^\d{10}$/.test(addressForm.mobileNumber || "")) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    // Only block adding a new address if limit reached
    if (showEditAddress === 'new' && addresses.length >= 5) {
      setAddressLimitError("You can only save up to 5 addresses. Please edit or delete an existing address in your profile to add a new one.");
      return;
    }
    setAddressLoading(true);
    // Get user ID for payload
    let currentUserId = null;
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userObj = await getUserByEmail(email);
          if (userObj && userObj.id) {
            currentUserId = userObj.id;
          }
        }
      } catch (e) { currentUserId = null; }
    }
    // Reactivate deleted address if match (case-insensitive, trimmed)
    const match = addresses.find(addr =>
      !addr.isActive &&
      normalize(addr.address) === normalize(addressForm.address) &&
      normalize(addr.district) === normalize(addressForm.district) &&
      normalize(addr.province) === normalize(addressForm.province) &&
      normalize(addr.postalCode) === normalize(addressForm.postalCode) &&
      normalize(addr.name) === normalize(addressForm.name) &&
      normalize(addr.mobileNumber) === normalize(addressForm.mobileNumber)
    );
    if (match) {
      const payload = {
        ...match,
        ...addressForm,
        isActive: true, // Ensure active
        userDto: { id: currentUserId },
      };
      let res = await updateShippingAddress(payload);
      if (!res.errorDescription) {
        setOrderError(null);
        setShowEditAddress(false);
        setAddressLimitError("");
        setShowAddressModal(false);
        const savedId = res.id || res.addressId || addressForm.id;
        await fetchAndSetPrimaryAddress(savedId);
        await fetchAndSetPrimaryAddress(); // Always refresh the list
        window.dispatchEvent(new Event("refresh-shipping-addresses"));
        return;
      }
      setOrderError(res.errorDescription);
      setAddressLoading(false);
      return;
    }
    // Build payload with userDto
    const payload = {
      ...addressForm,
      userDto: { id: currentUserId },
      isActive: true, // Ensure active
    };
    let res;
    if (addressForm.id) {
      // Editing existing address
      res = await updateShippingAddress(payload);
    } else {
      // Adding new address
      res = await saveShippingAddress(payload);
    }
    if (!res.errorDescription) {
      setOrderError(null);
      setAddressLimitError("");
      setShowAddressModal(false);
      const savedId = res.id || res.addressId || addressForm.id;
      await fetchAndSetPrimaryAddress(savedId); // Always fetch and select the new address
      setShowEditAddress(false); // Close the form AFTER the fetch
      window.dispatchEvent(new Event("refresh-shipping-addresses"));
      setAddressLoading(false);
      return;
    } else {
      setOrderError(res.errorDescription);
      setAddressLoading(false);
    }
  };

  const handleOrder = (e) => {
    e.preventDefault();
    if (!address) return alert("Please select a shipping address.");
    setShowPayment(true); // Just show payment modal
  };

  // Example usage: Save or update brand/condition (call these as needed)
  const saveOrUpdateBrand = async (brandName) => {
    // Try to save a new brand
    const saveRes = await saveBrand({ brand: brandName });
    if (saveRes && saveRes.id) return saveRes;
    // If already exists or error, try update (you may need to fetch the brand id first in a real app)
    // const updateRes = await updateBrand({ id: existingId, brand: brandName });
    // return updateRes;
    return saveRes;
  };

  const saveOrUpdateCondition = async (conditionName) => {
    // Try to save a new condition
    const saveRes = await saveCondition({ name: conditionName });
    if (saveRes && saveRes.id) return saveRes;
    // If already exists or error, try update (you may need to fetch the condition id first in a real app)
    // const updateRes = await updateCondition({ id: existingId, name: conditionName });
    // return updateRes;
    return saveRes;
  };

  // Example: Call these functions for 'Sneaker' and 'Condition Unknown' as needed
  // saveOrUpdateBrand('Sneaker');
  // saveOrUpdateCondition('Condition Unknown');

  // Helper to get brand name
  const getBrandName = () => {
    // 1. If product.brand is an object with brandName or brand
    if (product.brand?.brandName) return product.brand.brandName;
    if (product.brand?.brand) return product.brand.brand;
    // 2. If product.brandName exists
    if (product.brandName) return product.brandName;
    // 3. If product.brand is a string
    if (typeof product.brand === 'string') return product.brand;
    // 4. If product.brandId or product.brandDto?.id exists, map from brands list
    const brandId = product.brandId || product.brandDTO?.id || product.brandDto?.id;
    if (brandId && brands.length > 0) {
      const found = brands.find(b => b.id === brandId);
      if (found) return found.brandName;
    }
    return "Unbranded";
  };

  // Helper to get condition name
  const getConditionName = () => {
    // 1. If product.conditions is an object with conditionType or name
    if (product.conditions?.conditionType) return product.conditions.conditionType;
    if (product.conditions?.name) return product.conditions.name;
    // 2. If product.conditionType exists
    if (product.conditionType) return product.conditionType;
    // 3. If product.condition is a string
    if (typeof product.condition === 'string') return product.condition;
    // 4. If product.conditionId or product.conditionsDto?.id exists, map from conditions list
    const conditionId = product.conditionId || product.conditionsDTO?.id || product.conditionsDto?.id;
    if (conditionId && conditions.length > 0) {
      const found = conditions.find(c => c.id === conditionId);
      if (found) return found.conditionType;
    }
    return "Condition Unknown";
  };

  if (loading || addressLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">{error || "Product not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Review & Address */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Summary + Delivery Info */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={product.responseDto?.imageUrl || product.imageUrl || "https://placehold.co/100x100/png"}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h2 className="font-semibold text-lg">{product.title}</h2>
                  <p className="text-gray-600">{getBrandName()}</p>
                  <p className="text-sm text-gray-500">{getConditionName()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <label htmlFor="quantity" className="text-gray-700">Qty:</label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="border rounded px-2 py-1"
                    >
                      {[1, 2, 3, 4, 5].map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Delivery Info */}
              <div className="mt-4 border-t pt-4">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Postage</span>
                  <span>Free delivery in 2-3 days</span>
                  <span>Estimated delivery: 16 – 17 Jul</span>
                </div>
              </div>
            </div>

            {/* Post to Address Block */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4">Post to</h3>
              {/* Show only the selected address card */}
              {!showEditAddress && address && (
                <div
                  className="mb-4 p-4 bg-gray-50 rounded border border-blue-500 bg-blue-50 cursor-pointer hover:shadow-md transition"
                  onClick={() => setShowAddressModal(true)}
                  title="Click to change address"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold flex items-center gap-2">{address.firstName || address.name} {address.lastName || ""}{(address.phone || address.mobileNumber) && <span className="text-gray-500 font-normal">| {address.phone || address.mobileNumber}</span>}</div>
                      <div>{address.street1 || address.address}{address.street2 ? ", " + address.street2 : ""}</div>
                      {address.district && <div>{address.district}</div>}
                      <div>{address.city}{address.city && (address.province || address.state) ? ", " : ""}{address.province || address.state}{(address.postcode || address.postalCode) ? ", " + (address.postcode || address.postalCode) : ""}</div>
                      {address.isPrimary && <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Primary</span>}
                    </div>
                    <button
                      className="px-3 py-1 bg-[#1E90FF] text-white rounded hover:bg-[#1876cc] text-xs ml-4 transition-colors"
                      onClick={e => {
                        e.stopPropagation();
                        setShowEditAddress(address.id);
                        setAddressForm(address);
                        // Always update districts for the selected province
                        const found = provinceDistrictData.find(
                          p => p.province === (address.province || address.state)
                        );
                        const districts = found ? found.districts : [];
                        setFilteredDistricts(districts);
                        // If the current district is not in the list, clear it
                        if (address.district && !districts.includes(address.district)) {
                          setAddressForm(prev => ({ ...prev, district: "" }));
                        }
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">Click to change address</div>
                </div>
              )}
              {/* No addresses */}
              {!showEditAddress && !address && (
                <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200 text-gray-500">
                  No delivery address found. Please add one below.
                </div>
              )}
              {/* Edit Address Form (inline for selected address) */}
              {showEditAddress && (
                <>
                  {/* Only show warning if adding a new address and limit reached */}
                  {showEditAddress === 'new' && addresses.length >= 5 && (
                    <div className="mb-2 text-red-600 font-semibold">You can only save up to 5 addresses. Please edit or delete an existing address in your profile to add a new one.</div>
                  )}
                  <form className="space-y-3" onSubmit={handleAddressSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input name="name" value={addressForm.name || ""} onChange={handleAddressInputChange} placeholder="Full name" className="border rounded px-3 py-2" required disabled={showEditAddress === 'new' && addresses.length >= 5} />
                      <input name="mobileNumber" value={addressForm.mobileNumber || ""} onChange={handleAddressInputChange} placeholder="Mobile Number" className="border rounded px-3 py-2" required disabled={showEditAddress === 'new' && addresses.length >= 5} />
                      {phoneError && <div className="text-red-600 text-xs mt-1">{phoneError}</div>}
                    </div>
                    <input name="address" value={addressForm.address || ""} onChange={handleAddressInputChange} placeholder="Street address" className="border rounded px-3 py-2 w-full" required disabled={showEditAddress === 'new' && addresses.length >= 5} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        name="province"
                        value={addressForm.province || ""}
                        onChange={handleAddressInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                        disabled={showEditAddress === 'new' && addresses.length >= 5}
                      >
                        <option value="" disabled>Select Province</option>
                        {provinceDistrictData.map((p) => (
                          <option key={p.province} value={p.province}>{p.province}</option>
                        ))}
                      </select>
                      <select
                        name="district"
                        value={addressForm.district || ""}
                        onChange={handleAddressInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                        disabled={showEditAddress === 'new' && (addresses.length >= 5 || !addressForm.province)}
                      >
                        <option value="" disabled>Select District</option>
                        {filteredDistricts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <input name="postalCode" value={addressForm.postalCode || ""} onChange={handleAddressInputChange} placeholder="ZIP / Postal code" className="border rounded px-3 py-2 w-full" required disabled={showEditAddress === 'new' && addresses.length >= 5} />
                    <div className="flex items-center gap-2">
                      <input
                        id="isPrimary"
                        name="isPrimary"
                        type="checkbox"
                        checked={!!addressForm.isPrimary}
                        onChange={handleAddressInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        disabled={showEditAddress === 'new' && addresses.length >= 5}
                      />
                      <label htmlFor="isPrimary" className="font-medium text-gray-900">
                        Set as Primary Address
                      </label>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 border border-[#1E90FF] text-[#1E90FF] rounded hover:bg-[#e6f2ff] transition-colors"
                        onClick={() => setShowEditAddress(false)}
                        disabled={showEditAddress === 'new' && addresses.length >= 5}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="bg-[#1E90FF] text-white px-6 py-2 rounded hover:bg-[#1876cc] transition-colors disabled:opacity-50" disabled={addressLoading || (showEditAddress === 'new' && addresses.length >= 5)}>
                        {addressLoading ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </form>
                </>
              )}
              {/* Add New Address Button */}
              {!showEditAddress && addresses.length < 5 && (
                <button
                  className="mt-4 px-4 py-2 bg-[#1E90FF] text-white rounded hover:bg-[#1876cc] transition-colors"
                  onClick={() => { setShowEditAddress('new'); setAddressForm({ country: 'United Kingdom' }); }}
                >
                  Add New Shipping Address
                </button>
              )}
            </div>

            {orderError && <div className="text-red-500 text-sm mt-2">{orderError}</div>}
            {orderSuccess && <div className="text-green-600 text-sm mt-2">Your order placed successfully! Redirecting...</div>}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="font-bold text-xl mb-4">Order Summary</h3>
              <div className="flex justify-between">
                <span>Item ({quantity})</span>
                <span>LKR {(product.price * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Postage</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                <span>Order total</span>
                <span>LKR {(product.price * quantity).toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-[#1E90FF] text-white py-3 rounded-lg font-bold hover:bg-[#1876cc] transition-colors mt-4 disabled:opacity-50"
                onClick={handleOrder}
                disabled={orderLoading || !address?.id}
              >
                {orderLoading ? 'Placing Order...' : 'Confirm and Pay'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">Your payment details are encrypted and secure</p>
            </div>
          </div>
        </div>
      </main>
      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
          onClick={() => setShowAddressModal(false)}L
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowAddressModal(false)}>&times;</button>
            <h4 className="font-bold text-lg mb-4">Select a delivery address</h4>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-3 rounded border flex flex-col gap-1 cursor-pointer ${address?.id === addr.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                  onClick={() => {
                    setAddress(addr);
                    setAddressForm(addr);
                    setShowAddressModal(false);
                    localStorage.setItem('checkoutSelectedAddressId', addr.id);
                  }}
                >
                  <div className="font-bold">{addr.firstName || addr.name} {addr.lastName || ""}</div>
                  <div>{addr.street1 || addr.address}{addr.street2 ? ", " + addr.street2 : ""}</div>
                  {addr.district && <div>{addr.district}</div>}
                  <div>{addr.city}{addr.city && (addr.province || addr.state) ? ", " : ""}{addr.province || addr.state}{(addr.postcode || addr.postalCode) ? ", " + (addr.postcode || addr.postalCode) : ""}</div>
                  {addr.isPrimary && <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Primary</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Remove PaymentDetails modal and show order confirmation after placing order */}
      {showPayment && (
        <Modal open={showPayment} onClose={() => setShowPayment(false)}>
          <PaymentDetails
            userId={userId}
            product={product}
            address={address}
            quantity={quantity}
            onSuccess={async () => {
              // Save order after payment is successful
              const estimateDeliveryDate = new Date();
              estimateDeliveryDate.setDate(estimateDeliveryDate.getDate() + 2);
              const order = {
                productDto: { id: product.id || product.productId },
                userDto: { id: userId },
                postagePartnerDto: { id: address.postagePartnerDto?.id || 2 },
                shippingAddressDto: { id: address.id },
                statusDto: { id: 2 },
                quantity,
                estimateDeliveryDate: estimateDeliveryDate.toISOString(),
                isActive: 1
              };
              try {
                const res = await saveOrder(order);
                if (res && res.responseDto && res.responseDto.id) {
                  setShowPayment(false);
                  navigate(`/orderconfirmation/${res.responseDto.id}`);
                } else {
                  alert("Order could not be placed. Please try again.");
                }
              } catch (error) {
                alert("Order could not be placed. Please try again.");
              }
            }}
            onError={() => setShowPayment(false)}
            onClose={() => setShowPayment(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Checkout; 