import { BASE_BACKEND_URL, getUserByEmail } from "./config";
import axios from "axios";
import { decodeJwt } from "./UserApi";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); // must be stored after login
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const saveShippingPreferences = async (shippingPreferencesData) => {
  try {
    const response = await axios.post(
      `${BASE_BACKEND_URL}/shippingPreferences/save`,
      shippingPreferencesData,
      {
        headers: {
          ...getAuthHeaders(), // Use getAuthHeaders for consistency
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving shipping preferences:", error);
    return {
      errorDescription:
        error.response?.data?.errorDescription ||
        "Failed to save shipping preferences.",
    };
  }
};

export const fetchAllShippingPreferences = async (status) => {
  try {
    const params = {};
    if (typeof status === "boolean") params.status = status;

    const response = await axios.get(
      `${BASE_BACKEND_URL}/shippingPreferences/getAll`,
      {
        headers: getAuthHeaders(),
        params,
      }
    );
    // Always return an array for easier frontend handling
    const data = response.data;
    if (Array.isArray(data?.responseDto)) return data.responseDto;
    if (Array.isArray(data)) return data;
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Fetch shipping preferences by userId
export const getShippingPreferencesByUserId = async (userId) => {
  try {
    let actualUserId = userId;
    if (!actualUserId) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userData = await getUserByEmail(email);
          actualUserId = userData?.id;
        }
      }
    }

    if (!actualUserId) {
      console.error("User ID not available for fetching shipping preferences.");
      return [];
    }

    const response = await axios.get(
      `${BASE_BACKEND_URL}/shippingPreferences/findByUserId`,
      {
        params: { userId: actualUserId }, // Add includeInactive parameter
        headers: getAuthHeaders(),
      }
    );
    return response.data.responseDto || [];
  } catch (error) {
    console.error("Error fetching shipping preferences:", error);
    return [];
  }
};

export const updateShippingPreference = async (shippingPreferencesData) => {
  try {
    const response = await axios.put(
      `${BASE_BACKEND_URL}/shippingPreferences/update`,
      shippingPreferencesData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating shipping preferences:", error);
    return {
      errorDescription:
        error.response?.data?.errorDescription ||
        "Failed to update shipping preferences.",
    };
  }
};

export const deleteShippingPreference = async (preferenceId) => {
  try {
    const response = await axios.delete(
      `${BASE_BACKEND_URL}/shippingPreferences/delete/${preferenceId}`,
      {
        headers: {
          ...getAuthHeaders(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting shipping preferences:", error);
    return {
      errorDescription:
        error.response?.data?.errorDescription ||
        "Failed to delete shipping preferences.",
    };
  }
};
