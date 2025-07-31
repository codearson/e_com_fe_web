import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAllBrands } from '../API/brandApi';
import { getCategoriesByParentAndLevel } from '../API/ProductCategoryApi';
import { getAllConditions } from '../API/conditionApi';
import { getAllStatuses } from '../API/statusApi';
import { extractArray } from '../utils/extractArray';
import { uploadProductImages, updateProductImage, updateProductImageStatus, deactivateProductImage, deleteProductImage, setImageInactive, updateImageStatus, deactivateProductImageById, getActiveProductImages, saveImageOrderToDB, setPrimaryImageStatus, getPrimaryImageFromStorage, removeImageFromStorage, clearRemovedImagesFromStorage } from '../API/ProductImageApi';
import { getUserByEmail } from '../API/config';
import { decodeJwt } from '../API/UserApi';
import { updateProduct } from '../API/productApi';
import { getProductById } from '../API/productApi';
import { BASE_BACKEND_URL } from '../API/config';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [categoryLevels, setCategoryLevels] = useState([{ options: [], selected: "", level: 1, parentId: null }]);
  const [conditions, setConditions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [maxImages] = useState(5);
  const [draggedImage, setDraggedImage] = useState(null);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  // Form state
  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [conditionId, setConditionId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");

  // Helper to build category dropdown levels for a given categoryId
  const buildCategoryLevels = async (categoryId) => {
    let levels = [];
    let currentId = categoryId;
    let parentId = null;
    let level = 1;
    // Walk up the tree to root
    while (currentId) {
      // Find the parent of the current category
      let res = await getCategoriesByParentAndLevel({ parentId, level });
      let options = res.data.responseDto?.payload || [];
      let selectedCat = options.find(c => String(c.id) === String(currentId));
      levels.unshift({ options, selected: String(currentId), level, parentId });
      if (!selectedCat || !selectedCat.parentId) break;
      parentId = selectedCat.parentId;
      currentId = selectedCat.parentId;
      level--;
      if (level < 1) break;
    }
    // Fill in children levels if any
    let lastSelected = levels[levels.length - 1]?.selected;
    let lastLevel = levels[levels.length - 1]?.level;
    let keepGoing = true;
    while (keepGoing) {
      let res = await getCategoriesByParentAndLevel({ parentId: lastSelected, level: lastLevel + 1 });
      let options = res.data.responseDto?.payload || [];
      if (options.length > 0) {
        levels.push({ options, selected: "", level: lastLevel + 1, parentId: lastSelected });
        lastLevel++;
        lastSelected = "";
      } else {
        keepGoing = false;
      }
    }
    return levels;
  };

  // Fetch dropdowns and product details
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
          setBrands(extractArray(brandsResult.value));
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
        setMessage({ type: 'error', text: 'Could not load dropdown data.' });
      }
      setLoadingDropdowns(false);
    })();
  }, []);

  // Fetch product details
  useEffect(() => {
    (async () => {
      let product = location.state?.product;
      if (!product) {
        const res = await getProductById(id);
        product = res?.data?.responseDto;
      }
      if (product) {
        setTitle(product.title || "");
        setBrandId(product.brandDto?.id ? String(product.brandDto.id) : "");
        setPrice(product.price || "");
        setSize(product.size || "");
        setQuantity(product.quentity || product.quantity || "");
        setDescription(product.description || "");
        setColor(product.color || "");
        setConditionId(product.conditionsDto?.id ? String(product.conditionsDto.id) : "");
        setStatusId(product.statusDto?.id ? String(product.statusDto.id) : "");
        setProductCategoryId(product.productCategoryDto?.id ? String(product.productCategoryDto.id) : "");
        // Pre-fill category dropdowns
        if (product.productCategoryDto?.id) {
          try {
            const levels = await buildCategoryLevels(product.productCategoryDto.id);
            setCategoryLevels(levels);
          } catch (err) {
            setMessage({ type: 'error', text: 'Could not pre-fill category dropdowns.' });
          }
        }
        // Fetch images
        if (product.id) {
          try {
            console.log('Fetching active images for product ID:', product.id);
            // Use the new function to get only active images
            const activeImages = await getActiveProductImages(product.id);
            setExistingImages(activeImages);
            
            // Set the primary image from localStorage or default to first image
            const storedPrimaryId = getPrimaryImageFromStorage(product.id);
            if (storedPrimaryId && activeImages.find(img => img.id === storedPrimaryId)) {
              setPrimaryImageId(storedPrimaryId);
            } else if (activeImages.length > 0) {
              setPrimaryImageId(activeImages[0].id);
            }
          } catch (error) {
            console.error('Error fetching images:', error);
            setExistingImages([]);
          }
        }
      }
    })();
  }, [id, location.state]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up any remaining object URLs when component unmounts
      imagePreview.forEach(preview => {
        if (preview.url && preview.isNew) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreview]);

  // Handle cascading category selection
  const handleCategoryChange = async (levelIdx, selectedId) => {
    const newLevels = categoryLevels.slice(0, levelIdx + 1);
    newLevels[levelIdx].selected = selectedId;
    const nextLevel = newLevels[levelIdx].level + 1;
    const childrenRes = await getCategoriesByParentAndLevel({ parentId: selectedId, level: nextLevel });
    const children = childrenRes.data.responseDto?.payload || [];
    if (children.length > 0) {
      newLevels.push({ options: children, selected: "", level: nextLevel, parentId: selectedId });
    }
    setCategoryLevels(newLevels);
    setProductCategoryId(selectedId);
  };

  // Helper to refresh images after upload/delete
  const refreshImages = async () => {
    try {
      console.log('Refreshing active images for product ID:', id);
      // Use the new function to get only active images
      const activeImages = await getActiveProductImages(id);
      setExistingImages(activeImages);
    } catch (error) {
      console.error('Error refreshing images:', error);
      setExistingImages([]);
    }
  };

  // Function to clear removed images from localStorage
  const clearRemovedImages = () => {
    if (window.confirm('Are you sure you want to restore all removed images? This will show all images again.')) {
      clearRemovedImagesFromStorage(id);
      console.log('Cleared removed images from localStorage');
      setMessage({ type: 'success', text: 'Removed images restored. Refreshing...' });
      // Refresh images to show all images again
      setTimeout(() => {
        refreshImages();
      }, 1000);
    }
  };

  // Handle image file selection with preview
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentActiveImages = existingImages.length;
    const currentPreviewImages = imagePreview.length;
    const totalCurrentImages = currentActiveImages + currentPreviewImages;
    const availableSlots = maxImages - totalCurrentImages;
    
    if (availableSlots <= 0) {
      setMessage({
        type: 'error',
        text: `Maximum ${maxImages} images allowed. Please remove some existing images first.`
      });
      e.target.value = ''; // Clear the file input
      return;
    }
    
    // Limit files to available slots
    const limitedFiles = files.slice(0, availableSlots);
    
    if (files.length > availableSlots) {
      setMessage({
        type: 'error',
        text: `Only ${availableSlots} more images can be added. Selected first ${availableSlots} images.`
      });
    }
    
    setImageFiles(limitedFiles);
    
    // Create preview URLs for selected files
    const previews = limitedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));
    setImagePreview(previews);
  };

  // Remove preview image
  const handleRemovePreviewImage = (index) => {
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImagePreview(newPreviews);
    setImageFiles(newFiles);
    
    // Clean up object URL to prevent memory leaks
    if (imagePreview[index]) {
      URL.revokeObjectURL(imagePreview[index].url);
    }
  };



  // Remove existing image and refresh list (sets is_active = 0, keeps in database)
  const handleRemoveImage = async (img) => {
    setLoading(true);
    setMessage(null);
    try {
      // First, update the database to set is_active = 0
      try {
        await updateProductImageStatus(img.id, false);
        console.log('Image deactivated in database:', img.id);
        
        // If database update is successful, clear any localStorage removed images
        // so that the database state takes precedence
        clearRemovedImagesFromStorage(id);
        console.log('Cleared localStorage removed images after successful database update');
        
      } catch (dbError) {
        console.error('Failed to update database, but continuing with localStorage removal:', dbError);
        // If database update fails, use localStorage as fallback
        await removeImageFromStorage(id, img.id);
      }
      
      // Remove from UI state
      setExistingImages(prevImages => prevImages.filter(image => image.id !== img.id));
      setMessage({ type: 'success', text: 'Image removed successfully!' });
      
      // Refresh images from server (will now filter out removed images)
      await refreshImages();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove image: ' + err.message });
    }
    setLoading(false);
  };

  // Handle drag and drop for image reordering
  const handleDragStart = (e, image) => {
    setDraggedImage(image);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetImage) => {
    e.preventDefault();
    if (!draggedImage || draggedImage.id === targetImage.id) return;

    const draggedIndex = existingImages.findIndex(img => img.id === draggedImage.id);
    const targetIndex = existingImages.findIndex(img => img.id === targetImage.id);

    const newImages = [...existingImages];
    const [removed] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, removed);

    setExistingImages(newImages);
    setDraggedImage(null);

    // Save the new order to the backend
    try {
      await saveImageOrderToDB(id, newImages.map(img => img.id));
      console.log('Image order saved successfully.');
    } catch (err) {
      console.error('Failed to save image order:', err);
      setMessage({ type: 'error', text: 'Failed to save image order.' });
    }
  };

  const handleDragEnd = () => {
    setDraggedImage(null);
  };

  // Set primary image (first image will be shown in profile/product cards)
  const setPrimaryImage = async (imageId) => {
    setPrimaryImageId(imageId);
    // Move the selected image to the first position
    const newImages = [...existingImages];
    const imageIndex = newImages.findIndex(img => img.id === imageId);
    if (imageIndex > 0) {
      const [removed] = newImages.splice(imageIndex, 1);
      newImages.unshift(removed);
      setExistingImages(newImages);

      // Save the new order to the backend
      try {
        await saveImageOrderToDB(id, newImages.map(img => img.id));
        console.log('Primary image order saved successfully.');
      } catch (err) {
        console.error('Failed to save primary image order:', err);
        setMessage({ type: 'error', text: 'Failed to save primary image order.' });
      }
    }
  };

  // Submit handler for updating product and images
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

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
    } catch (err) {}

    const brand = brands.find(b => b.id === Number(brandId));
    const condition = conditions.find(c => c.id === Number(conditionId));
    // Always use the last selected category
    const finalCategoryId = categoryLevels.map(l => l.selected).filter(Boolean).pop();
    const productCategory = finalCategoryId ? { id: Number(finalCategoryId) } : null;

    const productData = {
      id: Number(id),
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

    try {
      // 1. Update product details
      const updateRes = await updateProduct(productData);
      if (!updateRes || updateRes.errorDescription) {
        throw new Error(updateRes?.errorDescription || 'Failed to update product.');
      }

      // 2. Upload new images if any and manage 5-image limit
      if (imageFiles.length > 0) {
        const currentActiveImages = existingImages.length;
        const newImagesCount = imageFiles.length;
        const totalAfterUpload = currentActiveImages + newImagesCount;
        
        // If total exceeds 5, deactivate oldest images first
        if (totalAfterUpload > maxImages) {
          const imagesToDeactivate = totalAfterUpload - maxImages;
          console.log(`Total images after upload: ${totalAfterUpload}, need to deactivate: ${imagesToDeactivate}`);
          
          // Sort existing images by ID (assuming lower ID = older) and deactivate the oldest ones
          const sortedImages = [...existingImages].sort((a, b) => a.id - b.id);
          const imagesToDeactivateList = sortedImages.slice(0, imagesToDeactivate);
          
          for (const img of imagesToDeactivateList) {
            try {
              console.log('Auto-deactivating image ID:', img.id);
              
              // Use the new reliable function to deactivate the image
              await deactivateProductImageById(img.id);
              console.log('Auto-deactivated image:', img.id);
            } catch (err) {
              console.error('Failed to auto-deactivate image:', img.id, err);
            }
          }
        }
        
        // Upload new images
        const uploadRes = await uploadProductImages(imageFiles, id);
        if (uploadRes && uploadRes.errorDescription) {
          throw new Error(uploadRes.errorDescription);
        }
        const uploadedImages = uploadRes.responseDto || [];
        if (uploadedImages.length > 0) {
          const imageUrl = uploadedImages[0].url;
          await updateProduct({ ...productData, id, imageUrl });
        }
      }

      // 3. Always refresh images after update/upload
      await refreshImages();
      
      // 4. Clean up preview images
      imagePreview.forEach(preview => {
        if (preview.url && preview.isNew) {
          URL.revokeObjectURL(preview.url);
        }
      });
      setImagePreview([]);
      setImageFiles([]);
      
      // 5. Save the primary image information (first image in the array)
      if (existingImages.length > 0) {
        const primaryImage = existingImages[0];
        console.log('Setting primary image:', primaryImage);
        
        // Save the primary image to the database
        try {
          await setPrimaryImageStatus(id, primaryImage.id);
          console.log('Primary image saved to database successfully.');
        } catch (err) {
          console.error('Failed to save primary image to database:', err);
        }
      }
      
     
      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update product.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-[#1E90FF] text-center">Edit Product</h1>
        <form className="space-y-6 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Product Images Section */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  Current Product Images ({existingImages.length}/{maxImages})
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {existingImages.length > 0 ? (
                  existingImages.map(img => (
                      <div
                        key={img.id}
                        className="relative group"
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, img)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, img)}
                        onDragEnd={handleDragEnd}
                      >
                        <img
                          src={`${BASE_BACKEND_URL}${img.url}`}
                          alt="Product"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          onError={(e) => {
                            console.error('Image failed to load:', `${BASE_BACKEND_URL}${img.url}`);
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                          onClick={() => handleRemoveImage(img)}
                          title="Remove image (deactivates in database)"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1 shadow hover:bg-green-600 transition-colors"
                          onClick={() => setPrimaryImage(img.id)}
                          title="Set as primary image (shows in profile)"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1 rounded">
                          ID: {img.id}
                        </div>
                        {img.id === primaryImageId && (
                          <div className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                            Primary
                          </div>
                        )}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Drag to reorder
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-gray-500 italic">No existing images found</div>
                )}
              </div>
            </div>

            {/* New Images Preview Section */}
            {imagePreview.length > 0 && (
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">New Images to Upload</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                        onClick={() => handleRemovePreviewImage(index)}
                        title="Remove preview"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Images ({existingImages.length + imagePreview.length}/{maxImages} used)
              </label>
              <input
                type="file"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                multiple
                accept="image/*"
                onChange={handleImageFileChange}
                disabled={existingImages.length + imagePreview.length >= maxImages}
              />
              <p className="text-sm text-gray-500 mt-1">
                {existingImages.length + imagePreview.length >= maxImages
                  ? `Maximum ${maxImages} images reached. Remove some images to add new ones.`
                  : `Select multiple images to add to your product (max ${maxImages} total). When uploading new images that exceed the limit, oldest images will be automatically deactivated.`
                }
              </p>
            </div>
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
            <div className={`text-center p-2 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 
              message.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>{message.text}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#1E90FF] text-white py-3 rounded-md text-lg font-medium hover:bg-[#1876cc] transition-colors"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditProduct; 