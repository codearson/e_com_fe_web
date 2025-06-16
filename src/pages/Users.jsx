import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeJwt } from '../API/UserApi';

export const Users = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // If no token, redirect to home
        navigate('/');
        return;
      }

      const decodedToken = decodeJwt(token);
      const userRole = decodedToken?.roles[0]?.authority;

      if (userRole === "ROLE_ADMIN") {
        // If admin, redirect to admin users page
        navigate('/admin/users');
      } else {
        // If not admin, redirect to home
        navigate('/');
      }
    };

    checkUserRole();
  }, [navigate]);

  // Return null since this is just a redirect component
  return null;
}; 