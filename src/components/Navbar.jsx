import React, { useState, useEffect, useRef } from "react";
import { AuthModal } from "./AuthModal";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user info if logged in
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (email) {
          const userData = await getUserByEmail(email);
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [authModalOpen]); // refetch after modal closes (login)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  const categories = [
    {
      name: "Women",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 14v7m0-7c-2.5 0-4-2-4-4a4 4 0 1 1 8 0c0 2-1.5 4-4 4z" />
        </svg>
      ),
    },
    {
      name: "Men",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 11v7m-4 0h8" />
        </svg>
      ),
    },
    {
      name: "Designer",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l4 4-4 4-4-4z" />
        </svg>
      ),
    },
    {
      name: "Kids",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M6 22v-2a4 4 0 0 1 8 0v2" />
        </svg>
      ),
    },
    {
      name: "Home",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 12l9-9 9 9" />
          <path d="M9 21V9h6v12" />
        </svg>
      ),
    },
    {
      name: "Electronics",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 3v4M8 3v4" />
        </svg>
      ),
    },
    {
      name: "Entertainment",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15l4-4-4-4" />
        </svg>
      ),
    },
    {
      name: "Sports",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      name: "Pet care",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2 text-[#1E90FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M5.5 8.5a2 2 0 1 1 3 0M15.5 8.5a2 2 0 1 1 3 0M5.5 15.5a2 2 0 1 0 3 0M15.5 15.5a2 2 0 1 0 3 0" />
        </svg>
      ),
    },
  ];

  // New data structure for desktop categories with subcategories (updated)
  const desktopCategoriesWithDropdown = [
    {
      name: "Women",
      sections: [
        {
          name: "See all",
          items: [], // Items can be added here if needed
        },
        {
          name: "Clothing",
          icon: (
            <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 14v7m0-7c-2.5 0-4-2-4-4a4 4 0 1 1 8 0c0 2-1.5 4-4 4z" />
            </svg>
          ),
          items: [
            "Jumpers & sweaters",
            "Dresses",
            "Tops & t-shirts",
            "Trousers & leggings",
            "Jumpsuits & playsuits",
            "Lingerie & nightwear",
            "Activewear",
            "Other clothing",
          ],
        },
        {
          name: "Shoes",
          icon: (
            <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 15V7m0 0l-4 4m4-4L21 11m-3 4v7m0 0l-4-4m4 4l4-4m-3-4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
          ),
          items: [
            "Boots", "Heels", "Flats", "Sandals", "Sneakers"
          ]
        },
         {
          name: "Bags",
          icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
          ),
          items: [
            "Handbags", "Shoulder bags", "Backpacks", "Clutches", "Wallets"
          ]
        },
        {
          name: "Accessories",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
           ),
          items: ["Jewelry", "Scarves", "Belts", "Hats", "Sunglasses"]
        },
         {
          name: "Beauty",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
               <path d="M12 15v2m-2 4h4.77a2 2 0 001.74-2.75L14.25 9 12 6.75 9.75 9 8.03 14.25A2 2 0 009.77 17H12z" />
                </svg>
           ),
          items: ["Makeup", "Skincare", "Fragrances", "Haircare"]
        }
        // ... Add other sections as needed for Women
      ],
    },
    {
      name: "Men",
       sections: [
        {
          name: "See all",
          items: [],
        },
         {
          name: "Clothing",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
               <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 11v7m-4 0h8" />
                </svg>
           ),
          items: ["Jumpers & sweaters", "Shirts", "Tops & t-shirts", "Trousers & leggings", "Jackets & coats", "Suits & blazers", "Jeans", "Shorts"]
        },
         {
          name: "Shoes",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 15V7m0 0l-4 4m4-4L21 11m-3 4v7m0 0l-4-4m4 4l4-4m-3-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
           ),
          items: ["Boots", "Sneakers", "Formal shoes", "Sandals"]
        },
         {
          name: "Accessories",
            icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          items: ["Ties", "Belts", "Hats", "Watches"]
        }
        // ... Add other sections as needed for Men
      ]
    },
    {
      name: "Designer",
      sections: [
         {
          name: "See all",
          items: [],
        },
        {
          name: "Women's designer",
          items: [],
        },
        {
          name: "Men's designer",
          items: [],
        },
        {
          name: "Kids' designer",
          items: [],
        },
        {
          name: "Bags & accessories",
          items: [],
        },
        {
          name: "Shoes",
          items: [],
        }
      ]
    },
    {
      name: "Kids",
      sections: [
        {
          name: "See all",
          items: [],
        },
        {
          name: "Girls clothing",
          icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 14v7m0-7c-2.5 0-4-2-4-4a4 4 0 1 1 8 0c0 2-1.5 4-4 4z" />
             </svg>
          ),
          items: [
            "Baby girls' clothing",
            "Outerwear",
            "Tops & t-shirts",
            "Skirts",
            "Bags & backpacks",
            "Swimwear",
            "Sleepwear & nightwear",
            "Clothing bundles",
            "Fancy dress & costumes",
            "Other girls' clothing",
          ],
        },
        {
          name: "Boys clothing",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 11v7m-4 0h8" />
             </svg>
          ),
          items: [], // Add items for Boys clothing
        },
         {
          name: "Toys",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 2l4 4-4 4-4-4z" />
              </svg>
           ),
          items: [], // Add items for Toys
        },
         {
          name: "Pushchairs, carriers & car seats",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13v.01M17 13v.01m-6 .01v.01m-6.4-4.01C4.6 5.5 4 6 4 6.5S4.6 8 5 8h.5L7 13H5.4M17 13l4-8h-6M17 13v.01" />
              </svg>
           ),
          items: [], // Add items for Pushchairs, carriers & car seats
        },
         {
          name: "Furniture & decor",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12l9-9 9 9" />
                <path d="M9 21V9h6v12" />
              </svg>
           ),
          items: [], // Add items for Furniture & decor
        },
         {
          name: "Bathing & changing",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h.01M12 16h.01" />
              </svg>
           ),
          items: [], // Add items for Bathing & changing
        },
        {
          name: "Childproofing & safety equipment",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M9 12H5.5a2.5 2.5 0 01-2.5-2.5V7a2.5 2.5 0 012.5-2.5H9m0 7h5m-5 0a4.5 4.5 0 01-4.5 4.5V19a2 2 0 002 2h10a2 2 0 002-2v-2.5a4.5 4.5 0 01-4.5-4.5H9z" />
              </svg>
           ),
          items: [], // Add items for Childproofing & safety equipment
        },
         {
          name: "Health & pregnancy",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 15v2m-2 4h4.77a2 2 0 001.74-2.75L14.25 9 12 6.75 9.75 9 8.03 14.25A2 2 0 009.77 17H12z" />
              </svg>
           ),
          items: [], // Add items for Health & pregnancy
        },
        {
          name: "Nursing & feeding",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
           ),
          items: [], // Add items for Nursing & feeding
        },
        {
          name: "Sleep & bedding",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 8.5a2 2 0 1 1 3 0M15.5 8.5a2 2 0 1 1 3 0M5.5 15.5a2 2 0 1 0 3 0M15.5 15.5a2 2 0 1 0 3 0" />
              </svg>
           ),
          items: [], // Add items for Sleep & bedding
        },
        {
          name: "School supplies",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for School supplies
        },
        {
          name: "Other kids' items",
          items: [], // Add items for Other kids' items
        }
      ]
    },
     {
      name: "Home",
       sections: [
        {
          name: "See all",
          items: [],
        },
        {
          name: "Small kitchen appliances",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
           ),
          items: ["Kettles", "Toasters", "Microwaves", "Hotplates", "Juicers", "Speciality appliances", "Small kitchen appliance accessories"]
        },
        {
          name: "Large appliances",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
           ),
          items: [], // Add items for Large appliances
        },
         {
          name: "Cookware & bakeware",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M19.5 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
             </svg>
           ),
          items: [], // Add items for Cookware & bakeware
        },
        {
          name: "Kitchen tools",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Kitchen tools
        },
         {
          name: "Tableware",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3z" />
                <path d="M5 15h14M6 18h12M7 21h10" />
              </svg>
           ),
          items: [], // Add items for Tableware
        },
        {
          name: "Household care",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 14v7m0-7c-2.5 0-4-2-4-4a4 4 0 1 1 8 0c0 2-1.5 4-4 4z" />
             </svg>
           ),
          items: [], // Add items for Household care
        },
         {
          name: "Textiles",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4V4z" />
                <path d="M12 4v16M4 12h16" />
             </svg>
           ),
          items: [], // Add items for Textiles
        },
         {
          name: "Home accessories",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3z" />
                <path d="M5 15h14M6 18h12M7 21h10" />
             </svg>
           ),
          items: [], // Add items for Home accessories
        },
         {
          name: "Celebrations & holidays",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Celebrations & holidays
        },
         {
          name: "Tools & DIY",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Tools & DIY
        },
         {
          name: "Outdoor & garden",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Outdoor & garden
        }
      ]
    },
     {
      name: "Electronics",
       sections: [
        {
          name: "See all",
          items: [],
        },
         {
          name: "Video games & consoles",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: ["Consoles", "Games", "Gaming headsets", "Simulators", "Accessories"]
        },
        {
          name: "Computers & accessories",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Computers & accessories
        },
         {
          name: "Mobile phones & communication",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Mobile phones & communication
        },
         {
          name: "Audio, headphones & hi-fi",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Audio, headphones & hi-fi
        },
         {
          name: "Tablets, e-readers & accessories",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Tablets, e-readers & accessories
        },
         {
          name: "TV & home cinema",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for TV & home cinema
        },
         {
          name: "Beauty & personal care electronics",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Beauty & personal care electronics
        },
        {
          name: "Wearables",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Wearables
        },
        {
          name: "Other devices & accessories",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Other devices & accessories
        }
      ]
    },
     {
      name: "Entertainment",
       sections: [
        {
          name: "See all",
          items: [],
        },
         {
          name: "Books",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Books
        },
         {
          name: "Movies & TV shows",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Movies & TV shows
        },
         {
          name: "Music",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Music
        },
         {
          name: "Video games",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Video games
        },
        {
          name: "Board games & puzzles",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Board games & puzzles
        },
         {
          name: "Collectibles",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Collectibles
        },
         {
          name: "Tickets",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Tickets
        }
      ]
    },
     {
      name: "Sports",
       sections: [
        {
          name: "See all",
          items: [],
        },
         {
          name: "Sportswear",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Sportswear
        },
         {
          name: "Footwear",
           icon: (
             <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Footwear
        },
         {
          name: "Accessories",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Accessories
        },
        {
          name: "Equipment",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Equipment
        },
         {
          name: "Team sports",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Team sports
        },
         {
          name: "Outdoor activities",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Outdoor activities
        },
         {
          name: "Fitness & gym",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Fitness & gym
        }
      ]
    },
     {
      name: "Pet care",
       sections: [
        {
          name: "See all",
          items: [],
        },
         {
          name: "Dog supplies",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Dog supplies
        },
         {
          name: "Cat supplies",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Cat supplies
        },
         {
          name: "Small animal supplies",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Small animal supplies
        },
         {
          name: "Bird supplies",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Bird supplies
        },
         {
          name: "Fish supplies",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Fish supplies
        },
         {
          name: "Pet accessories",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Pet accessories
        },
         {
          name: "Pet food",
           icon: (
              <svg className="w-5 h-5 inline mr-2 text-[#1E90FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           ),
          items: [], // Add items for Pet food
        }
      ]
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setUserDropdownOpen(false);
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="bg-white border-b border-gray-200 font-sans z-50">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-3">
        {/* Logo */}
        <div className="flex items-center">
          <span
            className="text-2xl lg:text-3xl font-semibold text-[#1E90FF] mr-4 select-none"
            style={{ fontFamily: "cursive", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            E-Com
          </span>
        </div>

        {/* Mobile Search (visible only on mobile) */}
        <div className="lg:hidden flex-1 mx-4">
          <div className="flex items-center bg-gray-100 rounded-md">
            <svg
              className="w-5 h-5 ml-3 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-black placeholder-black"
            />
          </div>
        </div>

        {/* Desktop Search (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 max-w-4xl mx-8">
          <div className="flex items-center flex-1 bg-gray-100 rounded-md">
            <svg
              className="w-5 h-5 ml-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for items"
              className="flex-1 bg-transparent px-4 py-1.5 text-sm focus:outline-none text-black placeholder-black min-w-[300px]"
            />
          </div>
        </div>

        {/* Right Side Buttons (hidden on mobile) */}
        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 px-4 py-1.5 border border-[#1E90FF] text-[#1E90FF] rounded-full font-medium bg-white hover:bg-[#e6f3ff] transition-all text-sm shadow-sm"
                style={{ fontWeight: 500 }}
                onClick={() => setUserDropdownOpen((v) => !v)}
              >
                {/* User avatar with initials */}
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#6dd5ed] text-white font-bold text-base">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
                <span className="ml-1">{user.firstName}</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 min-w-[13rem] w-auto max-w-xs bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div className="flex flex-col py-2">
                    <div className="flex items-center px-4 py-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold text-base mr-3">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </span>
                      <span className="font-medium text-gray-900">
                        {user.firstName}
                      </span>
                    </div>
                    {/* Profile link */}
                    <button
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/profile");
                        setUserDropdownOpen(false);
                      }}
                    >
                      Profile
                    </button>
                    {/* Favourites link */}
                    <button
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/favourites");
                        setUserDropdownOpen(false);
                      }}
                    >
                      Favourites
                    </button>
                    {/* Settings link */}
                    <button
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/profile/edit");
                        setUserDropdownOpen(false);
                      }}
                    >
                      Settings
                    </button>
                    <button
                      className="text-left px-4 py-2 text-sm text-[#1E90FF] hover:bg-gray-100 font-semibold cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-4 py-1.5 border border-[#1E90FF] text-[#1E90FF] rounded-md font-medium bg-white hover:bg-[#e6f3ff] transition-all text-sm"
              style={{ fontWeight: 500 }}
              onClick={() => setAuthModalOpen(true)}
            >
              Sign up | Log in
            </button>
          )}
          <button
            onClick={() => navigate("/sell")}
            className="px-4 py-1.5 bg-[#1E90FF] text-white rounded-md font-medium hover:bg-[#1876cc] transition-all text-sm"
            style={{ fontWeight: 500 }}
          >
            Sell now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-[#1E90FF]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Secondary Menu (hidden on mobile) */}
      <div
        className="border-t border-gray-300 hidden lg:flex flex-col px-12 text-black text-base font-normal bg-white z-40"
        onMouseLeave={() => setHoveredCategory(null)}
      >
        <div className="flex items-center space-x-8 py-2 overflow-x-auto">
          {desktopCategoriesWithDropdown.map((category) => (
            <button
              key={category.name}
              className="hover:text-[#1E90FF] transition-colors cursor-pointer whitespace-nowrap py-2"
              onMouseEnter={() => setHoveredCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
           {/* Add "About" and "Our Platform" separately as they don't have dropdowns */}
           <button
              className="hover:text-[#1E90FF] transition-colors cursor-pointer whitespace-nowrap py-2"
              onClick={() => navigate("/about-us")}
            >
              About
            </button>
            <button
              className="hover:text-[#1E90FF] transition-colors cursor-pointer whitespace-nowrap py-2"
              onClick={() => navigate("/our-platform")}
            >
              Our Platform
            </button>
        </div>
        {hoveredCategory && (
          <div className="flex bg-white border-t border-gray-200 p-4">
            {/* Left column: Sections with icons */}
            <div className="w-1/3 pr-4 border-r border-gray-200 flex flex-col">
              {desktopCategoriesWithDropdown
                .find(cat => cat.name === hoveredCategory)
                ?.sections.map((section) => (
                  <button
                    key={section.name}
                    className={`flex items-center text-left text-sm text-gray-700 hover:text-[#1E90FF] py-2 whitespace-nowrap ${
                      hoveredSection === section.name ? 'font-semibold text-[#1E90FF]' : ''
                    }`}
                    onMouseEnter={() => setHoveredSection(section.name)} // Track hovered section
                  >
                    {section.icon}
                    <span>{section.name}</span>
                    {section.items && section.items.length > 0 && (
                         <svg className="w-4 h-4 ml-auto text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                  </button>
                ))}
            </div>
            {/* Right column: Items of the hovered section */}
            {hoveredSection && (
              <div className="w-2/3 pl-4 grid grid-cols-2 gap-x-4 max-h-[300px] overflow-y-auto">
                 {desktopCategoriesWithDropdown
                    .find(cat => cat.name === hoveredCategory)
                     ?.sections.find(section => section.name === hoveredSection)
                     ?.items.map((item) => (
                        <a
                          key={item}
                          href="#" // Replace with actual link logic later
                          className="block text-sm text-gray-700 py-2 px-3 rounded-md border border-gray-200 transition-colors whitespace-nowrap hover:bg-[#1E90FF] hover:text-white"
                        >
                          {item}
                        </a>
                     ))
                 }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          ></div>
          <aside className="fixed top-0 left-0 w-full h-full bg-white z-50 shadow-lg flex flex-col transition-transform duration-300 transform translate-x-0">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <span
                className="text-2xl font-semibold text-[#1E90FF] select-none"
                style={{ fontFamily: "cursive" }}
              >
                E-Com
              </span>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6 text-[#1E90FF]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/sell");
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#1E90FF] text-white rounded-md font-medium hover:bg-[#1876cc] transition-colors"
              >
                Sell now
              </button>
              <button
                className="w-full py-2.5 border border-[#1E90FF] text-[#1E90FF] rounded-md font-medium hover:bg-[#e6f3ff] transition-colors"
                onClick={() => setAuthModalOpen(true)}
              >
                Sign up | Log in
              </button>
              <a
                href="#"
                className="block text-center text-[#1E90FF] text-sm mt-2 hover:underline"
              >
                Your Guide to E-Com
              </a>
            </div>

            <div className="px-4 py-3 text-sm font-medium text-gray-600">
              Categories
            </div>

            <div className="flex-1 overflow-y-auto mobile-sidebar">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className="w-full flex items-center px-4 py-3.5 text-black hover:text-[#1E90FF] hover:bg-[#e6f3ff] text-base cursor-pointer transition-colors"
                >
                  {cat.icon}
                  <span className="ml-2">{cat.name}</span>
                </button>
              ))}
            </div>
          </aside>
        </>
      )}

      {/* Render AuthModal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
};
