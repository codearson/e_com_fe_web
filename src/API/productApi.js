import { BASE_BACKEND_URL } from "./config";
import { getUserByEmail } from "./config";
import axios from "axios";

export const saveProduct = async (productData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.post(`${BASE_BACKEND_URL}/product/save`, productData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving product:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to save product." };
    }
};

export const updateProduct = async (productData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }
        const response = await axios.post(
            `${BASE_BACKEND_URL}/product/update`,
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
        console.error('Error updating product:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update product." };
    }
};

export const getAllProducts = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.warn('No access token found, returning empty array');
            return [];
        }

        console.log('Fetching all products...');

        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getAll`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        
        console.log('getAllProducts response:', response.data);
        
        // Handle different response structures
        let products = [];
        if (response.data?.responseDto) {
            products = response.data.responseDto;
        } else if (response.data?.payload) {
            products = response.data.payload;
        } else if (Array.isArray(response.data)) {
            products = response.data;
        } else if (response.data?.data) {
            products = response.data.data;
        }
        
        console.log('Extracted products:', products);
        console.log('Number of products found:', products.length);
        
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
        }
        return [];
    }
};

export const deleteProduct = async (productId) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.delete(`${BASE_BACKEND_URL}/product/delete/${productId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to delete product." };
    }
};

export const getAllproductPage = async (pageNumber = 1, pageSize = 10, status = 1) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { payload: [], totalRecords: 0 };
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getAllPage?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        
        console.log('API Response:', response.data);
        console.log('Products:', response.data.responseDto?.payload);
        if (response.data.responseDto?.payload?.length > 0) {
            console.log('Sample Product:', response.data.responseDto.payload[0]);
            console.log('Sample Brand:', response.data.responseDto.payload[0].brand);
        }
        return response.data.responseDto || { payload: [], totalRecords: 0 };
    } catch (error) {
        console.error('Error fetching product page:', error);
        return { payload: [], totalRecords: 0 };
    }
};

export const getProductById = async (productId) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error('No access token found');
            return null;
        }

        console.log('Fetching product with ID:', productId);
        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getById/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        
        console.log('Product API response:', response.data);
        
        if (!response.data) {
            console.error('No data in response');
            return null;
        }

        if (!response.data.responseDto) {
            console.error('No responseDto in response data');
            return null;
        }

        return response.data.responseDto;
    } catch (error) {
        console.error('Error fetching product:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
        }
        return null;
    }
};

export const updateProductStatus = async (productId, status) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(
            `${BASE_BACKEND_URL}/product/updateStatus?productId=${productId}&status=${status}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating product status:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update product status." };
    }
};

export const searchProducts = async (searchTerm) => {
    try {
        console.log('Searching for:', searchTerm);
        const accessToken = localStorage.getItem("accessToken");
        
        const headers = {
            "Content-Type": "application/json",
        };
        
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        // Build query parameters - try with minimal parameters first
        const params = new URLSearchParams({
            pageNumber: '1',
            pageSize: '50', // Increased page size to get more products
            status: '1' // Re-enable status filter
            // Temporarily remove search parameters to see if the issue is with the search params
        });

        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getAll`,
            { headers }
        );
        
        // Handle the response format from getAll endpoint
        let products = [];
        if (response.data.responseDto) {
            products = response.data.responseDto;
        } else if (Array.isArray(response.data)) {
            products = response.data;
        }

        // Filter products to match search term more closely
        const searchTermLower = searchTerm.toLowerCase();
        
        const filteredProducts = products.filter(product => {
            const titleMatch = product.title?.toLowerCase().includes(searchTermLower);
            const descMatch = product.description?.toLowerCase().includes(searchTermLower);
            const brandMatch = product.brandDto?.brandName?.toLowerCase().includes(searchTermLower);
            const categoryMatch = product.productCategoryDto?.name?.toLowerCase().includes(searchTermLower);
            
            // Prioritize exact matches in title or close matches
            return titleMatch || descMatch || brandMatch || categoryMatch;
        });

        // Sort results by relevance (exact matches first)
        filteredProducts.sort((a, b) => {
            const aTitleMatch = a.title?.toLowerCase().includes(searchTermLower);
            const bTitleMatch = b.title?.toLowerCase().includes(searchTermLower);
            
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;
            return 0;
        });
        
        return filteredProducts;
    } catch (error) {
        console.error('Error searching products:', error);
        console.error('Error response:', error.response?.data);
        
        if (error.response?.status === 401 && localStorage.getItem("accessToken")) {
            localStorage.removeItem("accessToken");
        }
        
        return [];
    }
};

export const getProductByCategory = async (category) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return null;
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getById/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

export const getProductsByCategory = async (categoryId) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/by-category/${categoryId}`,
            { headers }
        );
        if (response.data && Array.isArray(response.data.responseDto)) {
            return response.data.responseDto;
        } else {
            return { error: response.data?.errorDescription || "No products found." };
        }
    } catch (err) {
        return { error: "Failed to fetch products." };
    }
};

export const getProductsByUserId = async (userId) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return [];
        }
        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/byUser/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto || [];
    } catch (error) {
        console.error('Error fetching products by userId:', error);
        return [];
    }
};

export const getSellerByProductId = async (productId) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return null;
        }

        // Get all products to find the one with matching product ID
        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getAll`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        let products = [];
        if (response.data?.responseDto) {
            products = response.data.responseDto;
        } else if (Array.isArray(response.data)) {
            products = response.data;
        }

        // Find the specific product
        const targetProduct = products.find(p => p.id === parseInt(productId));
        
        if (!targetProduct) {
            return null;
        }
        
        if (!targetProduct.userDto?.id) {
            return null;
        }

        // Get user information using getUserByEmail
        const seller = await getUserByEmail(targetProduct.userDto.email || targetProduct.userDto.username);
        return seller;

    } catch (error) {
        console.error('Error fetching seller by product ID:', error);
        return null;
    }
};

