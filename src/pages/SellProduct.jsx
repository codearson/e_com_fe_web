import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import React, { useState } from 'react';


const SellProduct = () => {
const [imagePreview, setImagePreview] = useState(null);
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="min-h-screen bg-white">
         <Navbar />
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#1E90FF] text-center">Sellable Product Details</h1>

      <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
        />

        {imagePreview && (
            <div className="relative mt-4">
            <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-white text-gray-600 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow hover:text-red-500"
                title="Remove Image"
            >
                ✕
            </button>
            <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-80 object-contain rounded-md border"
            />
            </div>
        )}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title" className="p-3 border border-gray-300 rounded-md" />
          <input type="text" placeholder="Brand" className="p-3 border border-gray-300 rounded-md" />
          <select className="p-3 border border-gray-300 rounded-md">
              <option disabled selected>Select Product Category</option>
              <option>Clothing</option>
              <option>Electronics</option>
              <option>Home</option>
              <option>Sports</option>
              <option>Beauty</option>
              <option>Books</option>
              <option>Other</option>
            </select>

            <select className="p-3 border border-gray-300 rounded-md">
              <option disabled selected>Select Sub Category</option>
              <option>T-Shirts</option>
              <option>Laptops</option>
              <option>Furniture</option>
              <option>Fitness Equipment</option>
              <option>Makeup</option>
              <option>Fiction</option>
              <option>Other</option>
            </select>
          <input type="number" placeholder="Price" className="p-3 border border-gray-300 rounded-md" />
          <input type="text" placeholder="Size" className="p-3 border border-gray-300 rounded-md" />
          <input type="number" placeholder="Quantity" className="p-3 border border-gray-300 rounded-md" />
          <select className="p-3 border border-gray-300 rounded-md">
            <option disabled selected>Condition</option>
            <option>New</option>
            <option>Used</option>
          </select>
        </div>

        <textarea
          placeholder="Description"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-[#1E90FF] text-white py-3 rounded-md text-lg font-medium hover:bg-[#1876cc] transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
       <Footer />
    </div>
  );
};

export default SellProduct;
