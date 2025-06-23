import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import React, { useState, useEffect } from 'react';
import { saveProduct } from '../API/productApi';
import { getAllBrands } from '../API/brandApi';
import { getAllProductCategoriesBySearch } from '../API/ProductCategoryApi';
import { getAllConditions } from '../API/conditionApi';
import { getAllStatuses } from '../API/statusApi';
import { extractArray } from '../utils/extractArray';

const SellProduct = () => {
  // Dropdown data
  const [brands, setBrands] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [topLevelCategories, setTopLevelCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("");
  const [topLevelCategoryId, setTopLevelCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [thirdLevelCategoryId, setThirdLevelCategoryId] = useState("");
  const [conditionId, setConditionId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Initial data fetch for all dropdowns
  useEffect(() => {
    (async () => {
      setLoadingDropdowns(true);
      try {
        const results = await Promise.allSettled([
          getAllBrands(),
          getAllProductCategoriesBySearch(),
          getAllConditions(),
          getAllStatuses()
        ]);

        const [brandsResult, categoriesResult, conditionsResult, statusesResult] = results;

        if (brandsResult.status === 'fulfilled') {
          const arr = extractArray(brandsResult.value);
          setBrands(arr);
          console.log("Brands loaded:", arr);
        } else {
          console.error("Error fetching brands:", brandsResult.reason);
        }

        if (categoriesResult.status === 'fulfilled') {
          const allCats = extractArray(categoriesResult.value);
          setAllCategories(allCats);
          setTopLevelCategories(allCats.filter(c => c.level === 1));
        } else {
          console.error("Error fetching categories:", categoriesResult.reason);
        }

        if (conditionsResult.status === 'fulfilled') {
          setConditions(extractArray(conditionsResult.value));
        } else {
          console.error("Error fetching conditions:", conditionsResult.reason);
        }

        if (statusesResult.status === 'fulfilled') {
          setStatuses(extractArray(statusesResult.value));
        } else {
          console.error("Error fetching statuses:", statusesResult.reason);
        }

      } catch (err) {
        console.error("A critical error occurred during dropdown data fetch:", err);
        setMessage({ type: 'error', text: 'Could not load critical dropdown data.' });
      }
      setLoadingDropdowns(false);
    })();
  }, []);

  // Handle dependent sub-category dropdown
  useEffect(() => {
    if (topLevelCategoryId) {
      setSubCategories(allCategories.filter(c => c.parentId === Number(topLevelCategoryId)));
      setSubCategoryId("");
      setThirdLevelCategoryId("");
      setThirdLevelCategories([]);
    } else {
      setSubCategories([]);
    }
  }, [topLevelCategoryId, allCategories]);

  // Handle dependent third-level category dropdown
  useEffect(() => {
    if (subCategoryId) {
      setThirdLevelCategories(allCategories.filter(c => c.parentId === Number(subCategoryId)));
      setThirdLevelCategoryId("");
    } else {
      setThirdLevelCategories([]);
    }
  }, [subCategoryId, allCategories]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Determine the most specific category ID to send
    const finalCategoryId = thirdLevelCategoryId || subCategoryId || topLevelCategoryId;
    const productCategory = allCategories.find(c => c.id === Number(finalCategoryId));
    const brand = brands.find(b => b.id === Number(brandId));
    const condition = conditions.find(c => c.id === Number(conditionId));

    const productData = {
      title,
      description,
      size,
      color,
      price: parseFloat(price),
      quentity: parseInt(quantity),
      productCategoryDto: productCategory ? { id: productCategory.id } : null,
      brandDto: brand ? { id: brand.id } : null,
      conditionsDto: condition ? { id: condition.id } : null,
      statusDto: statusId ? { id: Number(statusId) } : null,
      isActive: true
    };
    console.log("Submitting productData:", productData);

    try {
      const response = await saveProduct(productData);
      if (response && !response.errorDescription) {
        setMessage({ type: 'success', text: 'Product saved successfully!' });
        // Reset form
        setTitle(""); setBrandId(""); setTopLevelCategoryId(""); setSubCategoryId(""); setThirdLevelCategoryId("");
        setConditionId(""); setPrice(""); setStatusId(""); setSize(""); setQuantity(""); setDescription(""); setColor("");
      } else {
        setMessage({ type: 'error', text: response.errorDescription || 'Failed to save product.' });
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
            <input type="file" className="p-3 border border-gray-300 rounded-md" disabled/>
            <input type="text" placeholder="Title" className="p-3 border border-gray-300 rounded-md" value={title} onChange={e => setTitle(e.target.value)} required />
            <select className="p-3 border border-gray-300 rounded-md" value={brandId} onChange={e => setBrandId(e.target.value)} required>
              <option value="" disabled>Select Brand</option>
              {brands.length === 0 && !loadingDropdowns && <option disabled>No brands found</option>}
              {brands.map(b => <option key={b.id} value={b.id}>{b.brandName}</option>)}
            </select>
            {/* Category Dropdowns */}
            <select className="p-3 border border-gray-300 rounded-md" value={topLevelCategoryId} onChange={e => setTopLevelCategoryId(e.target.value)} required>
              <option value="" disabled>Select Category</option>
              {topLevelCategories.length === 0 && !loadingDropdowns && <option disabled>No categories found</option>}
              {topLevelCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            {subCategories.length > 0 && (
              <select className="p-3 border border-gray-300 rounded-md" value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)}>
                <option value="" disabled>Select Sub-Category</option>
                {subCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}

            {thirdLevelCategories.length > 0 && (
              <select className="p-3 border border-gray-300 rounded-md" value={thirdLevelCategoryId} onChange={e => setThirdLevelCategoryId(e.target.value)}>
                <option value="" disabled>Select Sub-Category</option>
                {thirdLevelCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}

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
            <input type="number" placeholder="Price" className="p-3 border border-gray-300 rounded-md" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" />
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
