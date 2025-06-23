import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const getAllSubCategories = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return [];
  const response = await axios.get(`${BASE_BACKEND_URL}/productSubCategory/getAllBySearch`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.responseDto || [];
}; 