import axios from "axios";
import { BASE_BACKEND_URL } from "./config";

// Save product to favourites (FavouriteDto)
export const saveFavourite = async (productDto, userDto, isActive = true) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { success: false, error: "No access token" };
  try {
    const response = await axios.post(
      `${BASE_BACKEND_URL}/favourite/save`,
      { productDto, userDto, isActive },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get all favourites (optionally filter by user in frontend)
export const getAllFavourites = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { success: false, error: "No access token" };
  try {
    const response = await axios.get(
      `${BASE_BACKEND_URL}/favourite/getAll`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get all favourite products for the current user
export const getFavourites = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { success: false, error: "No access token" };
  try {
    const response = await axios.get(
      `${BASE_BACKEND_URL}/favourite/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateFavourite = async (favouriteDto) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { success: false, error: "No access token" };
  try {
    const response = await axios.put(
      `${BASE_BACKEND_URL}/favourite/update`,
      favouriteDto,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}; 