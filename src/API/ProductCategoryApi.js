import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveProductCategory = async (categoryData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.post(`${BASE_BACKEND_URL}/productCategory/save`, categoryData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving product category:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to save product category." };
    }
};

export const updateProductCategory = async (categoryData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(`${BASE_BACKEND_URL}/productCategory/update`, categoryData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product category:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update product category." };
    }
};

export const getAllProductCategoriesBySearch = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return [];
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/productCategory/getAllBySearch`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching product categories:', error);
        return [];
    }
};

export const updateProductCategoryStatus = async (productCategoryId, status) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(
            `${BASE_BACKEND_URL}/productCategory/updateStatus?productCategoryId=${productCategoryId}&status=${status}`,
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
        console.error('Error updating product category status:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update product category status." };
    }
}; 