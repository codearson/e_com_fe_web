import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveShippingAddress = async (addressData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.post(`${BASE_BACKEND_URL}/shippingAddress/save`, addressData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving shipping address:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to save shipping address." };
    }
};

export const updateShippingAddress = async (addressData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(`${BASE_BACKEND_URL}/shippingAddress/update`, addressData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating shipping address:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update shipping address." };
    }
};

export const updateShippingAddressStatus = async (shippingAddressId, status) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(
            `${BASE_BACKEND_URL}/shippingAddress/updateStatus?shippingAddressId=${shippingAddressId}&status=${status}`,
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
        console.error('Error updating shipping address status:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update shipping address status." };
    }
};

export const getAllShippingAddressesBySearch = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return [];
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/shippingAddress/getAllBySearch`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto || [];
    } catch (error) {
        console.error('Error searching shipping addresses:', error);
        return [];
    }
}; 