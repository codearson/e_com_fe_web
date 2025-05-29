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

export const getProductById = async (productId) => {
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
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return [];
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/product/search?term=${encodeURIComponent(searchTerm)}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto || [];
    } catch (error) {
        console.error('Error searching products:', error);
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

