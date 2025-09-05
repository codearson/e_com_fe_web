// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getCart } from "../API/cartApi";

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const userId = localStorage.getItem("userId");
//   const [cartCount, setCartCount] = useState(0);

//   const refreshCartCount = async () => {
//     if (!userId) return setCartCount(0);
//     try {
//       const res = await getCart(userId);
//       // Ensure we get the correct count from the response
//       const items = res?.data?.responseDto;
//       const count = Array.isArray(items) ? items.length : 0;
//       setCartCount(count);
//     } catch (err) {
//       console.error("Failed to refresh cart count:", err);
//       setCartCount(0);
//     }
//   };

//   useEffect(() => {
//     refreshCartCount();
//     // eslint-disable-next-line
//   }, [userId]);

//   // Refresh cart count periodically
//   useEffect(() => {
//     const interval = setInterval(() => {
//       refreshCartCount();
//     }, 3000); // Refresh every 3 seconds

//     return () => clearInterval(interval);
//   }, [userId]);

//   return (
//     <CartContext.Provider value={{ cartCount, refreshCartCount }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "../API/cartApi";
import { decodeJwt } from "../API/UserApi";
import { getUserByEmail } from "../API/config";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    if (!userId) return setCartCount(0);
    try {
      const res = await getCart(userId);
      // Ensure we get the correct count from the response
      const items = res?.data?.responseDto;
      const count = Array.isArray(items) ? items.length : 0;
      setCartCount(count);
    } catch (err) {
      console.error("Failed to refresh cart count:", err);
      setCartCount(0);
    }
  };

  // Get user ID from JWT token
  const getUserIdFromToken = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;

      const decoded = decodeJwt(token);
      const email = decoded?.sub;
      if (!email) return null;

      const userData = await getUserByEmail(email);
      return userData?.id;
    } catch (error) {
      console.error("Error getting user ID from token:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      const currentUserId = await getUserIdFromToken();
      setUserId(currentUserId);
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (userId) {
      refreshCartCount();
    }
  }, [userId]);

  // Refresh cart count periodically
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      refreshCartCount();
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
