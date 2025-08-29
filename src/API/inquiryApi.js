import axios from "axios";
import { BASE_BACKEND_URL } from "./config";

export const createInquiry = async (inquiryData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { success: false, error: "No access token found" };
    }
    const response = await axios.post(
      `${BASE_BACKEND_URL}/inquiries/createInquiry`,
      inquiryData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return {
      success: false,
      error: error.response?.data?.errorDescription || "Failed to create inquiry",
    };
  }
};

export const getAllInquiries = async (page = 0, size = 10) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { success: false, error: "No access token found" };
    }
    const response = await axios.get(
      `${BASE_BACKEND_URL}/inquiries/getAllInquiries?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return {
      success: false,
      error: error.response?.data?.errorDescription || "Failed to fetch inquiries",
    };
  }
};

export const getInquiryById = async (id) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { success: false, error: "No access token found" };
    }
    const response = await axios.get(
      `${BASE_BACKEND_URL}/inquiries/getInquiryById/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching inquiry with id ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.errorDescription || "Failed to fetch inquiry",
    };
  }
};

export const getInquiriesByUserId = async (userId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { success: false, error: "No access token found" };
    }
    const response = await axios.get(
      `${BASE_BACKEND_URL}/inquiries/getInquiriesByUserId/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching inquiries for user ${userId}:`, error);
    return {
      success: false,
      error:
        error.response?.data?.errorDescription ||
        "Failed to fetch user inquiries",
    };
  }
};

export const updateInquiry = async (id, inquiryData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { success: false, error: "No access token found" };
    }
    const response = await axios.put(
      `${BASE_BACKEND_URL}/inquiries/updateInquiry/${id}`,
      inquiryData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating inquiry with id ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.errorDescription || "Failed to update inquiry",
    };
  }
};

export const deleteInquiry = async (id) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { success: false, error: "No access token found" };
    }
    const response = await axios.delete(
      `${BASE_BACKEND_URL}/inquiries/deleteInquiry/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting inquiry with id ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.errorDescription || "Failed to delete inquiry",
    };
  }
};
