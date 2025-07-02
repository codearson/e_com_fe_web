import { BASE_BACKEND_URL } from "./config";
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

        const response = await axios.put(`${BASE_BACKEND_URL}/product/update`, productData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
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
            return [];
        }

        console.log(accessToken);

        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getAll`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        // Expected response format matching your Products page data structure
        return response.data.responseDto || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
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

        // Build query parameters
        const params = new URLSearchParams({
            pageNumber: '1',
            pageSize: '20',
            status: '1',
            name: searchTerm, // Search in product name
            description: searchTerm, // Search in description
            brand: searchTerm, // Search in brand
            category: searchTerm // Search in category
        });

        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/getAllPage?${params.toString()}`,
            { headers }
        );
        
        console.log('Search API response:', response.data);
        
        // Handle the response format from getAllPage endpoint
        let products = [];
        if (response.data.responseDto?.payload) {
            products = response.data.responseDto.payload;
        } else if (response.data.payload) {
            products = response.data.payload;
        } else if (Array.isArray(response.data)) {
            products = response.data;
        }

        // Filter products to match search term more closely
        const searchTermLower = searchTerm.toLowerCase();
        const filteredProducts = products.filter(product => {
            const nameMatch = product.name?.toLowerCase().includes(searchTermLower);
            const descMatch = product.description?.toLowerCase().includes(searchTermLower);
            const brandMatch = product.brand?.toLowerCase().includes(searchTermLower);
            const categoryMatch = product.category?.toLowerCase().includes(searchTermLower);
            
            // Prioritize exact matches in name or close matches
            return nameMatch || descMatch || brandMatch || categoryMatch;
        });

        // Sort results by relevance (exact matches first)
        filteredProducts.sort((a, b) => {
            const aNameMatch = a.name?.toLowerCase().includes(searchTermLower);
            const bNameMatch = b.name?.toLowerCase().includes(searchTermLower);
            
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
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

