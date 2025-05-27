import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import SellProduct from "./pages/SellProduct"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/sell" element={<SellProduct />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
