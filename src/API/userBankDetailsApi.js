import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveUserBankDetails = async (bankDetailsData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.post(`${BASE_BACKEND_URL}/userBankDetails/save`, bankDetailsData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving user bank details:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to save bank details." };
    }
};

export const updateUserBankDetails = async (bankDetailsData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.post(`${BASE_BACKEND_URL}/userBankDetails/update`, bankDetailsData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user bank details:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update bank details." };
    }
};

export const updateUserBankDetailsStatus = async (userBankDetailsId, status) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { errorDescription: "Authentication required." };
        }

        const response = await axios.put(
            `${BASE_BACKEND_URL}/userBankDetails/updateStatus?userBankDetailsId=${userBankDetailsId}&status=${status}`,
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
        console.error('Error updating user bank details status:', error);
        return { errorDescription: error.response?.data?.errorDescription || "Failed to update bank details status." };
    }
};

export const getAllUserBankDetailsPage = async (pageNumber = 1, pageSize = 10, status = 1) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { payload: [], totalRecords: 0 };
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/userBankDetails/getAllPage?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto || { payload: [], totalRecords: 0 };
    } catch (error) {
        console.error('Error fetching user bank details page:', error);
        return { payload: [], totalRecords: 0 };
    }
};

export const searchUserBankDetails = async (accountHolderName) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { payload: [] };
        }

        const response = await axios.get(
            `${BASE_BACKEND_URL}/userBankDetails/getAllBySearch`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.responseDto || [];
    } catch (error) {
        console.error('Error searching user bank details:', error);
        return [];
    }
}; 