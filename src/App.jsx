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
          <Route path="/productView" element={<ProductView />} />
          <Route path="/products" element={<Products />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/cookie-settings" element={<CookieSettings />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/selling" element={<Selling />} />
          <Route path="/buying" element={<Buying />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
