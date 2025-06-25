import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import SellProduct from "./pages/SellProduct"
import { Favourited } from "./pages/Favourited"
import { Profile } from "./pages/Profile"
import { ProfileEdit } from "./pages/ProfileEdit"
import OurPlatform from "./pages/OurPlatform"
import AboutUs from "./pages/AboutUs"
import ProductView from "./pages/ProductView"
import Products from "./pages/Products"
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
import { ProtectedRoute } from "./components/ProtectedRoute";
import BuyNow from "./pages/BuyNow";
import Purchase from "./pages/Purchase";

function App() {
  return (
    <>
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
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/selling" element={<Selling />} />
          <Route path="/buying" element={<Buying />} />
          <Route path="/search" element={<SearchResults />} />
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
          <Route path="/buyNow/:id" element={<BuyNow />} />
          <Route path="/purchase/:id" element={<Purchase />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
