import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveOrder = async (orderData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }
        const response = await axios.post(
            `${BASE_BACKEND_URL}/orders/save`,
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error saving order:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to save order." };
    }
};

export const updateOrder = async (orderData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }
        const response = await axios.put(
            `${BASE_BACKEND_URL}/orders/update`,
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update order." };
    }
}; 