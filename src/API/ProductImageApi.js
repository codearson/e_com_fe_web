import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveProduct = async (productImageData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required." };
    }

    const response = await axios.post(
      `${BASE_BACKEND_URL}/productImage/save`,
      productImageData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving product:", error);
    return {
      errorDescription:
        error.response?.data?.errorDescription || "Failed to save product.",
    };
  }
};

export const updateProduct = async (productData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required." };
    }

    const response = await axios.put(
      `${BASE_BACKEND_URL}/productImage/update`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      errorDescription:
        error.response?.data?.errorDescription || "Failed to update product.",
    };
  }
};
