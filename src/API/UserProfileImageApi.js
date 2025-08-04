import axios from 'axios';
import { BASE_BACKEND_URL } from "./config";

// Update profile status
export const updateProfileStatus = async (profileId, isActive) => {
  try {
    const response = await axios.put(`${BASE_BACKEND_URL}/profile/updateStatus`, null, {
      params: {
        profileId: profileId,
        isActive: isActive
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile status:', error);
    throw error;
  }
};

// Find profile by user ID
export const findByUserId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_BACKEND_URL}/profile/findByUserId`, {
      params: {
        userId: userId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error finding profile by user ID:', error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await axios.post(`${BASE_BACKEND_URL}/profile/uploadImage`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Get profile image by ID (if needed)
export const getProfileImageById = async (profileId) => {
  try {
    const response = await axios.get(`${BASE_BACKEND_URL}/profile/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting profile image by ID:', error);
    throw error;
  }
}; 