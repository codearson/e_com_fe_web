import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveProductCategory = async (categoryData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.post(`${BASE_BACKEND_URL}/product-category/save`, categoryData, {
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

        const response = await axios.put(`${BASE_BACKEND_URL}/product-category/update`, categoryData, {
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

export const getAllProductCategoriesBySearch = async (params = {}) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return [];
        }
        const response = await axios.get(
            `${BASE_BACKEND_URL}/product-category/getAllPageBySearch`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    pageNumber: params.pageNumber ?? 1,
                    pageSize: params.pageSize ?? 100,
                    ...(params.search ? { search: params.search } : {}),
                    ...(params.level ? { level: params.level } : {}),
                    ...(params.parentId ? { parentId: params.parentId } : {}),
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
            `${BASE_BACKEND_URL}/product-category/updateStatus?productCategoryId=${productCategoryId}&status=${status}`,
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

export const getProductCategoryTree = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        // If your API requires authentication, include the token; otherwise, you can remove headers
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(
            `${BASE_BACKEND_URL}/product-category/tree`,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching product category tree:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to fetch product category tree." };
    }
};

// Get categories by parentId and level (for cascading dropdowns)
export const getCategoriesByParentAndLevel = async ({ parentId = null, level = null, search = "" }) => {
    let url = `${BASE_BACKEND_URL}/product-category/getAllPageBySearch?pageNumber=1&pageSize=100`;
    if (parentId !== null) url += `&parentId=${parentId}`;
    if (level !== null) url += `&level=${level}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return axios.get(url);
}; 