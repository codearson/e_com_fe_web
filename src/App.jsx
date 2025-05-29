import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import SellProduct from "./pages/SellProduct";
import { Favourited } from "./pages/Favourited";
import { Profile } from "./pages/Profile";
import { ProfileEdit } from "./pages/ProfileEdit";
import OurPlatform from "./pages/OurPlatform";
import AboutUs from "./pages/AboutUs";
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
