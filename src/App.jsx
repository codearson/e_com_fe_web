import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import SellProduct from "./pages/SellProduct";
import { Favourited } from "./pages/Favourited";
import { Profile } from "./pages/Profile";
import { ProfileEdit } from "./pages/ProfileEdit";
import OurPlatform from "./pages/OurPlatform";
import AboutUs from "./pages/AboutUs";
import ProductView from "./pages/ProductView";
import Products from "./pages/Products";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import CookieSettings from "./pages/CookieSettings";
import TermsAndConditions from "./pages/TermsAndConditions";
import Selling from "./pages/Selling";
import Buying from "./pages/Buying";
import SearchResults from "./pages/SearchResults";
import { AdminUsers } from "./pages/AdminUsers";
import { Users } from "./pages/Users";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import { LowStocks } from "./pages/LowStocks";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CategoryProducts from "./pages/CategoryProducts";
import Checkout from "./pages/Checkout";
import { MessageProvider } from "./utils/MessageContext.jsx";
import OrderConfirmation from "./pages/orderconfirmation.jsx";
import MyOrders from "./pages/MyOrders";
import EditProduct from "./pages/EditProduct";
import SellerProfile from "./pages/SellerProfile";
import Cart from "./pages/Cart";
import { CartProvider } from "./utils/CartContext.jsx";
import ProductManagement from "./pages/ProductManagement.jsx";
import React, { createContext, useContext } from 'react';
import { Toaster, toast } from 'sonner';
import SellerDashboard from "./pages/SellerDashboard.jsx";


const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastProviderComponent = ({ children }) => {
  const showToast = ({ title, description, type = 'foreground' }) => {
    if (type === 'foreground') {
      toast.success(title, { description });
    } else if (type === 'error') {
      toast.error(title, { description });
    } else {
      toast(title, { description });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster richColors position="bottom-right" />
    </ToastContext.Provider>
  );
};

function App() {
  return (
    <MessageProvider>
      <CartProvider>
        <ToastProviderComponent>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="favourites" element={<Favourited />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<ProfileEdit />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/sell" element={<SellProduct />} />
              <Route path="/our-platform" element={<OurPlatform />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/productView/:id" element={<ProductView />} />
              <Route path="/products" element={<Products />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="/product-management" element={<ProductManagement />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/selling" element={<Selling />} />
              <Route path="/buying" element={<Buying />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/seller/:sellerId" element={<SellerProfile />} />
              <Route path="/cart" element={<Cart />} />
              <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
              <Route
                path="/myorders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/users" element={<Users />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/low-stocks"
                element={
                  <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                    <LowStocks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/category/:categoryId"
                element={<CategoryProducts />}
              />
              <Route
                path="/orderconfirmation/:orderId"
                element={<OrderConfirmation />}
              />
            </Routes>
          </BrowserRouter>
        </ToastProviderComponent>
      </CartProvider>
    </MessageProvider>
  );
}

export default App;


