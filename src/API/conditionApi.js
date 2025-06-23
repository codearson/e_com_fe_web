import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const getAllConditions = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return [];
  const response = await axios.get(`${BASE_BACKEND_URL}/conditions/getAll?conditionType=`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};