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

export const saveCondition = async (conditionData) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { error: "No access token" };
  const response = await axios.post(`${BASE_BACKEND_URL}/conditions/save`, conditionData, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};

export const updateCondition = async (conditionData) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return { error: "No access token" };
  const response = await axios.put(`${BASE_BACKEND_URL}/conditions/update`, conditionData, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};