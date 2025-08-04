import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProduct } from '../API/productApi';
import { getAllBrands } from '../API/brandApi';
import { getCategoriesByParentAndLevel } from '../API/ProductCategoryApi';
import { getAllConditions } from '../API/conditionApi';
import { getAllStatuses } from '../API/statusApi';
import { extractArray } from '../utils/extractArray';
import { uploadProductImages } from '../API/ProductImageApi';
import { decodeJwt } from '../API/UserApi';
import { getUserByEmail } from '../API/config';

const SellProduct = () => {
  const navigate = useNavigate();
  // Dropdown data
  const [brands, setBrands] = useState([]);
  const [categoryLevels, setCategoryLevels] = useState([{ options: [], selected: "", level: 1, parentId: null }]);
  const [conditions, setConditions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [conditionId, setConditionId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  // Fetch root categories on mount
  useEffect(() => {
    (async () => {
      setLoadingDropdowns(true);
      try {
        const results = await Promise.allSettled([
          getAllBrands(),
          getCategoriesByParentAndLevel({ parentId: null, level: 1 }),
          getAllConditions(),
          getAllStatuses()
        ]);
        const [brandsResult, categoriesResult, conditionsResult, statusesResult] = results;
        if (brandsResult.status === 'fulfilled') {
          const arr = extractArray(brandsResult.value);
          setBrands(arr);
        }
        if (categoriesResult.status === 'fulfilled') {
          const cats = categoriesResult.value.data.responseDto?.payload || [];
          setCategoryLevels([{ options: cats, selected: "", level: 1, parentId: null }]);
        }
        if (conditionsResult.status === 'fulfilled') {
          setConditions(extractArray(conditionsResult.value));
        }
        if (statusesResult.status === 'fulfilled') {
          setStatuses(extractArray(statusesResult.value));
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Could not load critical dropdown data.' });
      }
      setLoadingDropdowns(false);
    })();
  }, []);

  // Handle cascading category selection
  const handleCategoryChange = async (levelIdx, selectedId) => {
    const newLevels = categoryLevels.slice(0, levelIdx + 1);
    newLevels[levelIdx].selected = selectedId;
    // Fetch children for the next level
    const nextLevel = newLevels[levelIdx].level + 1;
    const childrenRes = await getCategoriesByParentAndLevel({ parentId: selectedId, level: nextLevel });
    const children = childrenRes.data.responseDto?.payload || [];
    if (children.length > 0) {
      newLevels.push({ options: children, selected: "", level: nextLevel, parentId: selectedId });
    }
    setCategoryLevels(newLevels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Determine the most specific category ID to send
    const finalCategoryId = categoryLevels.map(l => l.selected).filter(Boolean).pop();
    const productCategory = finalCategoryId ? { id: Number(finalCategoryId) } : null;
    const brand = brands.find(b => b.id === Number(brandId));
    const condition = conditions.find(c => c.id === Number(conditionId));

    // Get logged-in user id
    let userId = null;
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = decodeJwt(token);
      const email = decoded?.sub;
      if (email) {
        const userData = await getUserByEmail(email);
        userId = userData?.id;
      }
    } catch (err) {
      console.error('Failed to get logged-in user id:', err);
    }

    const productData = {
      title,
      description,
      size,
      color,
      price: parseFloat(price),
      quentity: parseInt(quantity),
      productCategoryDto: productCategory,
      brandDto: brand ? { id: brand.id } : null,
      conditionsDto: condition ? { id: condition.id } : null,
      statusDto: statusId ? { id: Number(statusId) } : null,
      isActive: true,
      userDto: userId ? { id: userId } : undefined
    };
    console.log("Submitting productData:", productData);

    try {
      // 1. Save product first
      const response = await saveProduct(productData);
      console.log('Save product response:', response);
      if (response && !response.errorDescription && response.responseDto && response.responseDto.id) {
        const productId = response.responseDto.id;
        let imageUrl = null;
        // 2. If image files selected, upload them
        if (imageFiles.length > 0) {
          try {
            const uploadRes = await uploadProductImages(imageFiles, productId);
            console.log('Upload response:', uploadRes);
            
            // Handle different response structures
            let uploadedImages = [];
            if (uploadRes?.data?.responseDto) {
              uploadedImages = uploadRes.data.responseDto;
            } else if (uploadRes?.responseDto) {
              uploadedImages = uploadRes.responseDto;
            } else if (Array.isArray(uploadRes)) {
              uploadedImages = uploadRes;
            }
            
            if (uploadedImages.length > 0) {
              imageUrl = uploadedImages[0].url;
              console.log('Image URL set:', imageUrl);
            }
          } catch (uploadError) {
            console.error('Error uploading images:', uploadError);
            // Don't fail the entire product creation if image upload fails
          }
        }
        // 3. If imageUrl is set, update product with image_url
        if (imageUrl) {
          await saveProduct({ ...productData, id: productId, imageUrl });
        }
        setMessage({ type: 'success', text: 'Product saved successfully! Redirecting to products page...' });
        // Reset form
        setTitle(""); setBrandId(""); setPrice(""); setSize(""); setQuantity(""); setDescription(""); setColor("");
        setCategoryLevels([{ options: [], selected: "", level: 1, parentId: null }]);
        setImageFiles([]);
        
        // Redirect to products page after successful creation
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response?.errorDescription || 'Failed to save product.' });
      }
    } catch (err) {
      let errorText = 'An error occurred while saving the product.';
      if (err && err.response && err.response.data) {
        errorText = err.response.data.errorDescription || err.response.data.message || JSON.stringify(err.response.data);
      } else if (err && err.message) {
        errorText = err.message;
      }
      setMessage({ type: 'error', text: errorText });
      console.error("Product save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
         <Navbar />
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#1E90FF] text-center">Sellable Product Details</h1>
        <form className="space-y-6 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="file"
              className="p-3 border border-gray-300 rounded-md"
              multiple
              onChange={e => setImageFiles(Array.from(e.target.files))}
              required
            />
            <input type="text" placeholder="Title" className="p-3 border border-gray-300 rounded-md" value={title} onChange={e => setTitle(e.target.value)} required />
            <select className="p-3 border border-gray-300 rounded-md" value={brandId} onChange={e => setBrandId(e.target.value)} required>
              <option value="" disabled>Select Brand</option>
              {brands.length === 0 && !loadingDropdowns && <option disabled>No brands found</option>}
              {brands.map(b => <option key={b.id} value={b.id}>{b.brandName}</option>)}
            </select>
            {/* Category Dropdowns */}
            {categoryLevels.map((catLevel, idx) => (
              <select
                key={idx}
                className="p-3 border border-gray-300 rounded-md"
                value={catLevel.selected}
                onChange={e => handleCategoryChange(idx, e.target.value)}
                required={idx === 0}
              >
                <option value="" disabled>{idx === 0 ? 'Select Category' : 'Select Sub-Category'}</option>
                {catLevel.options.length === 0 && !loadingDropdowns && <option disabled>No categories found</option>}
                {catLevel.options.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            ))}
            <select className="p-3 border border-gray-300 rounded-md" value={conditionId} onChange={e => setConditionId(e.target.value)} required>
              <option value="" disabled>Select Condition</option>
              {conditions.length === 0 && !loadingDropdowns && <option disabled>No conditions found</option>}
              {conditions.map(c => <option key={c.id} value={c.id}>{c.conditionType}</option>)}
            </select>
            <select
              className="p-3 border border-gray-300 rounded-md"
              value={statusId}
              onChange={e => setStatusId(e.target.value)}
              required
            >
              <option value="" disabled>Select Status</option>
              {statuses.length === 0 && !loadingDropdowns && <option disabled>No statuses found</option>}
              {statuses.map(s => <option key={s.id} value={s.id}>{s.type}</option>)}
            </select>
            <input type="number" placeholder="Price" className="p-3 border border-gray-300 rounded-md" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="1" />
            <input type="text" placeholder="Size" className="p-3 border border-gray-300 rounded-md" value={size} onChange={e => setSize(e.target.value)} />
            <input type="number" placeholder="Quantity" className="p-3 border border-gray-300 rounded-md" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" />
            <input type="text" placeholder="Color" className="p-3 border border-gray-300 rounded-md" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <textarea
          placeholder="Description"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
        />
          {message && (
            <div className={`text-center p-2 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>
          )}
        <button
          type="submit"
          className="w-full bg-[#1E90FF] text-white py-3 rounded-md text-lg font-medium hover:bg-[#1876cc] transition-colors"
            disabled={loading}
        >
            {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
       <Footer />
    </div>
  );
};

export default SellProduct;
