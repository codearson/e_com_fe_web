import axios from 'axios';
import { BASE_BACKEND_URL } from './config';

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); // must be stored after login
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addToCart = async (userId, productId, quantity = 1) => {
  return await axios.post(`${BASE_BACKEND_URL}/cart/add`, null, {
    params: { userId, productId, quantity },
    headers: getAuthHeaders(),
  });
};

export const removeFromCart = async (userId, productId) => {
  return await axios.delete(`${BASE_BACKEND_URL}/cart/remove`, {
    params: { userId, productId },
    headers: getAuthHeaders(),
  });
};

export const getCart = async (userId) => {
  return await axios.get(`${BASE_BACKEND_URL}/cart/getCartByUserId`, {
    params: { userId },
    headers: getAuthHeaders(),
  });
};

export const getCartCount = async (userId) => {
  return await axios.get(`${BASE_BACKEND_URL}/cart/count`, {
    params: { userId },
    headers: getAuthHeaders(),
  });
};

export const getCartTotal = async (userId) => {
  return await axios.get(`${BASE_BACKEND_URL}/cart/total`, {
    params: { userId },
    headers: getAuthHeaders(),
  });
};
