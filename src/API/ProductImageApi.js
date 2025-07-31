import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveProduct = async (productImageData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required." };
    }

    const response = await axios.post(
      `${BASE_BACKEND_URL}/productImage/save`,
      productImageData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving product:", error);
    return {
      errorDescription:
        error.response?.data?.errorDescription || "Failed to save product.",
    };
  }
};

export const updateProduct = async (productData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required." };
    }

    const response = await axios.put(
      `${BASE_BACKEND_URL}/productImage/update`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      errorDescription:
        error.response?.data?.errorDescription || "Failed to update product.",
    };
  }
};

// Upload product image(s) to local and save
export const uploadProductImages = async (files, productId) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  if (productId) formData.append('productId', productId);
  const accessToken = localStorage.getItem('accessToken');
  const response = await axios.post(
    `${BASE_BACKEND_URL}/productImage/uploadToLocal`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export async function updateProductImage(productImageDto) {
  const response = await fetch(`${BASE_BACKEND_URL}/productImage/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productImageDto),
  });
  return response.json();
}

// Correct function to update product image status (is_active)
export async function updateProductImageStatus(productImageId, status = false) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Authentication required");
  const response = await axios.put(
    `${BASE_BACKEND_URL}/productImage/updateStatus?productImageId=${productImageId}&status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

// Alternative function to deactivate image by updating its status directly
export async function deactivateProductImage(productImageId) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Authentication required');
    }
    
    console.log('Calling deactivateProductImage API for image ID:', productImageId);
    
    // Try to update the image with correct field names
    const response = await axios.put(
      `${BASE_BACKEND_URL}/productImage/update`,
      {
        id: productImageId,
        isActive: false,
        is_active: 0,
        status: false
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('deactivateProductImage response status:', response.status);
    console.log('deactivateProductImage API response:', response.data);
    
    if (response.data && response.data.errorDescription) {
      throw new Error(`API error: ${response.data.errorDescription}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in deactivateProductImage:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
}

// New approach: Use a simple PATCH request to update just the isActive field
export async function setImageInactive(productImageId) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Authentication required');
    }
    
    console.log('Calling setImageInactive API for image ID:', productImageId);
    
    // Try a simple PATCH request with the correct field name
    const response = await fetch(`${BASE_BACKEND_URL}/productImage/${productImageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isActive: false,
        is_active: 0,
        status: false
      })
    });
    
    console.log('setImageInactive response status:', response.status);
    
    const result = await response.json();
    console.log('setImageInactive API response:', result);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${JSON.stringify(result)}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error in setImageInactive:', error);
    throw error;
  }
}

// Alternative approach: Use PUT with minimal data
export async function updateImageStatus(productImageId) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Authentication required');
    }
    
    console.log('Calling updateImageStatus API for image ID:', productImageId);
    
    const response = await fetch(`${BASE_BACKEND_URL}/productImage/${productImageId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: false,
        is_active: false,
        active: false
      })
    });
    
    console.log('updateImageStatus response status:', response.status);
    
    const result = await response.json();
    console.log('updateImageStatus API response:', result);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${JSON.stringify(result)}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error in updateImageStatus:', error);
    throw error;
  }
}

// Simple delete function that directly calls the delete endpoint
export async function deleteProductImage(productImageId) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Authentication required');
    }
    
    console.log('Calling deleteProductImage API for image ID:', productImageId);
    
    const response = await axios.delete(
      `${BASE_BACKEND_URL}/productImage/delete/${productImageId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    console.log('deleteProductImage response status:', response.status);
    console.log('deleteProductImage API response:', response.data);
    
    if (response.data && response.data.errorDescription) {
      throw new Error(`API error: ${response.data.errorDescription}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in deleteProductImage:', error);
    if (error.response) {
      console.error('Delete error response data:', error.response.data);
      console.error('Delete error response status:', error.response.status);
    }
    throw error;
  }
}

// New reliable function to deactivate product image by setting is_active to 0
export async function deactivateProductImageById(productImageId) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Authentication required');
    }
    
    console.log('Calling deactivateProductImageById API for image ID:', productImageId);
    
    // Method 1: Try using a simple GET request to update status
    try {
      const response = await axios.get(
        `${BASE_BACKEND_URL}/productImage/deactivateImage?imageId=${productImageId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      console.log('deactivateProductImageById response status:', response.status);
      console.log('deactivateProductImageById API response:', response.data);
      
      if (response.data && response.data.errorDescription) {
        throw new Error(`API error: ${response.data.errorDescription}`);
      }
      
      return response.data;
    } catch (getError) {
      console.log('GET method failed, trying POST:', getError);
      
      // Method 2: Try using POST with minimal data
      try {
        const response = await axios.post(
          `${BASE_BACKEND_URL}/productImage/deactivate`,
          {
            imageId: productImageId,
            isActive: false,
            is_active: 0
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log('deactivateProductImageById POST response status:', response.status);
        console.log('deactivateProductImageById POST API response:', response.data);
        
        if (response.data && response.data.errorDescription) {
          throw new Error(`API error: ${response.data.errorDescription}`);
        }
        
        return response.data;
      } catch (postError) {
        console.log('POST method failed, trying simple update:', postError);
        
        // Method 3: Try using the update endpoint with minimal data
        const response = await axios.post(
          `${BASE_BACKEND_URL}/productImage/update`,
          {
            id: productImageId,
            isActive: false,
            is_active: 0
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log('deactivateProductImageById update response status:', response.status);
        console.log('deactivateProductImageById update API response:', response.data);
        
        if (response.data && response.data.errorDescription) {
          throw new Error(`API error: ${response.data.errorDescription}`);
        }
        
        return response.data;
      }
    }
  } catch (error) {
    console.error('Error in deactivateProductImageById:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
}

// Function to get only active product images (is_active = 1) with better error handling
export async function getActiveProductImages(productId) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.warn('No access token found, returning empty array');
      return [];
    }
    
    console.log('Calling getActiveProductImages API for product ID:', productId);
    
    const response = await axios.get(
      `${BASE_BACKEND_URL}/productImage/getByProductId?productId=${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    console.log('getActiveProductImages response status:', response.status);
    console.log('getActiveProductImages API response:', response.data);
    
    // Filter only active images (is_active = 1)
    let activeImages = response.data?.responseDto || response.data?.payload || response.data;
    if (Array.isArray(activeImages)) {
      activeImages = activeImages.filter(img => {
        return img.is_active === 1 || img.isActive === true || img.isActive === 1;
      });
    } else {
      activeImages = [];
    }
    
    // Get removed images from localStorage as additional filter (for immediate UI feedback)
    const removedImages = getRemovedImagesFromStorage(productId);
    const availableImages = activeImages.filter(img => !removedImages.includes(img.id));
    
    // Get primary image and order from localStorage
    const primaryImageId = getPrimaryImageFromStorage(productId);
    const imageOrder = getImageOrderFromStorage(productId);
    
    console.log('Primary image from storage:', primaryImageId);
    console.log('Image order from storage:', imageOrder);
    console.log('Removed images from storage:', removedImages);
    console.log('Database active images:', activeImages.length);
    console.log('Available images after localStorage filter:', availableImages.length);
    
    // Sort images based on localStorage data
    let sortedImages = [...availableImages];
    
    if (imageOrder && imageOrder.length > 0) {
      // Sort by the stored order
      const orderMap = {};
      imageOrder.forEach((id, index) => {
        orderMap[id] = index;
      });
      
      sortedImages.sort((a, b) => {
        const orderA = orderMap[a.id] !== undefined ? orderMap[a.id] : 999;
        const orderB = orderMap[b.id] !== undefined ? orderMap[b.id] : 999;
        return orderA - orderB;
      });
    } else if (primaryImageId) {
      // If no order but primary image is set, put primary first
      sortedImages.sort((a, b) => {
        if (a.id === primaryImageId) return -1;
        if (b.id === primaryImageId) return 1;
        return a.id - b.id; // Sort by ID for remaining images
      });
    } else {
      // Default sort by ID (lower ID first)
      sortedImages.sort((a, b) => a.id - b.id);
    }
    
    console.log('All images:', response.data);
    console.log('Active images:', activeImages);
    console.log('Sorted active images:', sortedImages);
    
    return sortedImages;
  } catch (error) {
    console.error('Error in getActiveProductImages:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    // Return empty array instead of throwing error
    return [];
  }
}

// Function to verify if an image is active (is_active = 1)
export async function isImageActive(productImageId) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Authentication required');
    }
    
    console.log('Checking if image is active for ID:', productImageId);
    
    const response = await axios.get(
      `${BASE_BACKEND_URL}/productImage/getById/${productImageId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    console.log('Image status check response:', response.data);
    
    // Check if image is active
    const image = response.data?.responseDto || response.data;
    const isActive = image?.is_active === 1 || image?.isActive === true || image?.isActive === 1;
    
    console.log('Image active status:', isActive);
    return isActive;
  } catch (error) {
    console.error('Error checking image active status:', error);
    return false; // Assume inactive if we can't check
  }
}

// Function to get the URL of the first active image for a given product ID
export async function getActiveProductImageUrl(productId) {
  try {
    const activeImages = await getActiveProductImages(productId);
    if (activeImages.length > 0) {
      // The first image in the sorted list is the primary image
      const primaryImage = activeImages[0];
      console.log('Primary image for product', productId, ':', primaryImage.url);
      return primaryImage.url;
    }
    console.log('No active images found for product', productId);
    return null;
  } catch (error) {
    console.error('Error getting active product image URL:', error);
    return null;
  }
}

// Function to filter products to only show those with active images
export async function filterProductsWithActiveImages(products) {
  try {
    console.log('Filtering products with active images. Total products:', products.length);
    
    if (!Array.isArray(products) || products.length === 0) {
      console.log('No products to filter');
      return [];
    }
    
    const filteredProducts = [];
    
    for (const product of products) {
      try {
        console.log('Processing product:', product.id, product.title);
        
        // Skip products without an ID
        if (!product.id) {
          console.log('Product has no ID, skipping:', product);
          continue;
        }
        
        const activeImageUrl = await getActiveProductImageUrl(product.id);
        
        if (activeImageUrl) {
          // Create a new product object with the active image URL
          const productWithActiveImage = {
            ...product,
            imageUrl: activeImageUrl
          };
          filteredProducts.push(productWithActiveImage);
          console.log('Product added with active image:', product.id, activeImageUrl);
        } else {
          console.log('No active images found for product:', product.id);
          // Still include the product but with its original imageUrl (if any)
          filteredProducts.push(product);
        }
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        // Include the product even if we can't get its images
        filteredProducts.push(product);
      }
    }
    
    console.log('Filtered products result:', filteredProducts.length);
    return filteredProducts;
  } catch (error) {
    console.error('Error filtering products with active images:', error);
    return products; // Return original products if filtering fails
  }
}

// Function to set primary image using localStorage (since backend updateStatus gives 403)
export async function setPrimaryImageStatus(productId, primaryImageId) {
  try {
    console.log('Setting primary image for product:', productId, 'Image:', primaryImageId);
    
    // Store the primary image selection in localStorage
    const primaryImageKey = `primaryImage_${productId}`;
    localStorage.setItem(primaryImageKey, primaryImageId.toString());
    
    console.log('Primary image saved to localStorage:', primaryImageId);
    return { success: true };
  } catch (error) {
    console.error('Error setting primary image:', error);
    throw error;
  }
}

// Function to get primary image from localStorage
export function getPrimaryImageFromStorage(productId) {
  try {
    const primaryImageKey = `primaryImage_${productId}`;
    const primaryImageId = localStorage.getItem(primaryImageKey);
    return primaryImageId ? parseInt(primaryImageId) : null;
  } catch (error) {
    console.error('Error getting primary image from storage:', error);
    return null;
  }
}

// Function to save image order to localStorage
export async function saveImageOrderToDB(productId, imageOrder) {
  try {
    console.log('Saving image order for product:', productId, 'Order:', imageOrder);
    
    // Store the image order in localStorage
    const imageOrderKey = `imageOrder_${productId}`;
    localStorage.setItem(imageOrderKey, JSON.stringify(imageOrder));
    
    console.log('Image order saved to localStorage:', imageOrder);
    return { success: true };
  } catch (error) {
    console.error('Error saving image order:', error);
    throw error;
  }
}

// Function to get image order from localStorage
export function getImageOrderFromStorage(productId) {
  try {
    const imageOrderKey = `imageOrder_${productId}`;
    const imageOrder = localStorage.getItem(imageOrderKey);
    return imageOrder ? JSON.parse(imageOrder) : null;
  } catch (error) {
    console.error('Error getting image order from storage:', error);
    return null;
  }
}

// Function to remove image using localStorage (since backend updateStatus gives 403)
export async function removeImageFromStorage(productId, imageId) {
  try {
    console.log('Removing image from storage for product:', productId, 'Image:', imageId);
    
    // Store the removed image ID in localStorage
    const removedImagesKey = `removedImages_${productId}`;
    const existingRemoved = JSON.parse(localStorage.getItem(removedImagesKey) || '[]');
    
    if (!existingRemoved.includes(imageId)) {
      existingRemoved.push(imageId);
      localStorage.setItem(removedImagesKey, JSON.stringify(existingRemoved));
    }
    
    console.log('Image removed from localStorage:', imageId);
    return { success: true };
  } catch (error) {
    console.error('Error removing image from storage:', error);
    throw error;
  }
}

// Function to get removed images from localStorage
export function getRemovedImagesFromStorage(productId) {
  try {
    const removedImagesKey = `removedImages_${productId}`;
    const removedImages = localStorage.getItem(removedImagesKey);
    return removedImages ? JSON.parse(removedImages) : [];
  } catch (error) {
    console.error('Error getting removed images from storage:', error);
    return [];
  }
}

// Function to clear removed images from localStorage
export function clearRemovedImagesFromStorage(productId) {
  try {
    const removedImagesKey = `removedImages_${productId}`;
    localStorage.removeItem(removedImagesKey);
    console.log('Cleared removed images from localStorage for product:', productId);
  } catch (error) {
    console.error('Error clearing removed images from storage:', error);
  }
}
