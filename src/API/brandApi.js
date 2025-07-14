import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const getAllBrands = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return [];
  const response = await axios.get(`${BASE_BACKEND_URL}/brand/getAllBySearch?brandName=`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};

export const saveBrand = async (brandData) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { error: "No access token" };
  const response = await axios.post(`${BASE_BACKEND_URL}/brand/save`, brandData, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};

export const updateBrand = async (brandData) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { error: "No access token" };
  const response = await axios.put(`${BASE_BACKEND_URL}/brand/update`, brandData, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};