import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const getAllStatuses = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return [];
  const response = await axios.get(`${BASE_BACKEND_URL}/status/getAllBySearch?type=`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.responseDto || [];
};
