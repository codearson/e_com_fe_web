import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveBank = async (bankData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.post(`${BASE_BACKEND_URL}/bank/save`, bankData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving bank:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to save bank." };
    }
};

export const updateBank = async (bankData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(`${BASE_BACKEND_URL}/bank/update`, bankData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating bank:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update bank." };
    }
};

export const updateBankStatus = async (bankId, status) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(
            `${BASE_BACKEND_URL}/bank/updateStatus?bankId=${bankId}&status=${status}`,
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
        console.error('Error updating bank status:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update bank status." };
    }
};

export const getAllBanksPage = async (pageNumber = 1, pageSize = 10, status = 1) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { payload: [], totalRecords: 0 };
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/bank/getAllPage?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto || { payload: [], totalRecords: 0 };
    } catch (error) {
        console.error('Error fetching banks page:', error);
        return { payload: [], totalRecords: 0 };
    }
};

export const getAllBanksBySearch = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return [];
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/bank/getAllBySearch`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto || [];
    } catch (error) {
        console.error('Error searching banks:', error);
        return [];
    }
}; 