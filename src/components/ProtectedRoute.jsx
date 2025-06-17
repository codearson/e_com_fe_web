import React from 'react';
import { Navigate } from 'react-router-dom';
import { decodeJwt } from '../API/UserApi';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const getUserRole = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = decodeJwt(token);
        return decoded?.roles[0]?.authority;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    }
    return null;
  };

  const userRole = getUserRole();

  if (!userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
    // User is not authenticated or does not have the required role
    return <Navigate to="/" replace />;
  }

  return children;
}; 