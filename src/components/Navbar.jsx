import React, { useState, useEffect, useRef } from "react";
import { AuthModal } from "./AuthModal";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { useNavigate } from "react-router-dom";
import { CategoryDropdown } from "./CategoryDropdown";
import { getAllProductCategoriesBySearch } from "../API/ProductCategoryApi";
import { searchProducts } from "../API/productApi";
import { debounce } from "lodash";
import "../styles/Navbar.css";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [hoveredLevel2CategoryId, setHoveredLevel2CategoryId] = useState(null);
  const [hoveredLevel3CategoryId, setHoveredLevel3CategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await searchProducts(query);
          // Limit to 5 suggestions
          setSearchSuggestions(results.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchSuggestions([]);
        }
        setIsSearching(false);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300)
  ).current;

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/productView/${product.id}`, { state: { product } });
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Handle clicks outside search to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Track category state changes
  useEffect(() => {
    console.log('Categories state updated:', categories);
    console.log('Number of categories:', categories.length);
    if (categories.length > 0) {
      console.log('First category:', categories[0]);
      console.log('Level 1 categories count:', categories.filter(cat => cat.level === 1).length);
    }
  }, [categories]);

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
  }, [authModalOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllProductCategoriesBySearch();
        console.log('Fetched categories (raw):', result);
        if (result && !result.errorDescription) {
          const flatCategories = Array.isArray(result) ? result : result.responseDto;
          if (flatCategories && Array.isArray(flatCategories)) {
            console.log('Fetched categories (flat array):', flatCategories);
            setCategories(flatCategories);

            // Build nested structure
            const categoryMap = {};
            flatCategories.forEach(category => {
              categoryMap[category.id] = { ...category, children: [] };
              console.log('Added to categoryMap:', category.id, category.name);
            });

            const rootCategories = [];
            flatCategories.forEach(category => {
              const isActive = category.isActive === true || category.isActive === 1;
              if (category.parentId === null && category.level === 1 && isActive) {
                rootCategories.push(categoryMap[category.id]);
                console.log('Added as root category:', category.name);
              } else if (category.parentId !== null && categoryMap[category.parentId] && isActive) {
                 const parent = categoryMap[category.parentId];
                 const isParentActive = parent.isActive === true || parent.isActive === 1;
                 if(isParentActive) {
                   categoryMap[category.parentId].children.push(categoryMap[category.id]);
                   console.log('Added as child:', category.name, 'level:', category.level, 'under parent:', parent.name, 'level:', parent.level);
                 } else {
                   console.log('Skipped child (parent inactive):', category.name, 'under parent:', parent.name);
                 }
              } else {
                if (!isActive) console.log('Skipped category (inactive):', category.name);
                if (category.parentId !== null && !categoryMap[category.parentId]) console.log('Skipped child (parent not found):', category.name, 'parent ID:', category.parentId);
                if (category.parentId === null && category.level !== 1) console.log('Skipped category (incorrect level for root):', category.name, 'level:', category.level);
              }
            });
            setNestedCategories(rootCategories);
            console.log('Nested categories (built tree):', rootCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
        setHoveredCategoryId(null);
        setHoveredLevel2CategoryId(null);
        setHoveredLevel3CategoryId(null);
      }
    }
    if (userDropdownOpen || hoveredCategoryId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen, hoveredCategoryId]);

  const getLevel1Categories = () => {
    console.log('Getting Level 1 categories from nested structure:', nestedCategories);
    const level1Cats = nestedCategories.filter(cat => {
        const isActive = cat.isActive === true || cat.isActive === 1;
        return cat.level === 1 && isActive;
    });
    console.log('Filtered Level 1 categories for display:', level1Cats);
    return level1Cats;
  };

  const findCategoryById = (id, categories) => {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(id, category.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const hoveredLevel1Category = findCategoryById(hoveredCategoryId, nestedCategories);
  const level2Categories = hoveredLevel1Category ? hoveredLevel1Category.children : [];
  console.log('Level 2 categories for hovered Level 1 (' + hoveredLevel1Category?.name + '):', level2Categories);

  const hoveredLevel2Category = findCategoryById(hoveredLevel2CategoryId, level2Categories);
  const level3Categories = hoveredLevel2Category ? hoveredLevel2Category.children : [];
  console.log('Level 3 categories for hovered Level 2 (' + hoveredLevel2Category?.name + '):', level3Categories);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setUserDropdownOpen(false);
    navigate("/"); // Redirect to home page
  };

  // Update the mobile search input
  const mobileSearchInput = (
    <div className="lg:hidden flex-1 mx-4" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200">
            <svg
              className="w-5 h-5 text-gray-500 mr-2"
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
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-500"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
          />
          {isSearching && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          )}
        </div>
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchSuggestions.map((product) => (
              <div
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSuggestionClick(product)}
              >
                <img
                  src={product.thumbnail || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-8 h-8 object-cover rounded mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {product.brand}
                  </div>
                </div>
                <div className="ml-3 text-sm font-semibold text-[#1E90FF]">
                  ${product.price}
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
        </div>
  );

  // Update the desktop search input
  const desktopSearchInput = (
    <div className="hidden lg:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="flex items-center flex-1 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
            <svg
              className="w-5 h-5 text-gray-500 mr-3"
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
              placeholder="Search for items..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-500"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
          />
          {isSearching && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          )}
        </div>
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchSuggestions.map((product) => (
              <div
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSuggestionClick(product)}
              >
                <img
                  src={product.thumbnail || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-8 h-8 object-cover rounded mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {product.brand}
                  </div>
                </div>
                <div className="ml-3 text-sm font-semibold text-[#1E90FF]">
                  ${product.price}
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 font-sans z-50 relative">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <span
            className="text-2xl lg:text-3xl font-bold text-[#1E90FF] mr-6 select-none tracking-tight"
            style={{ fontFamily: "cursive", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            E-Com
          </span>
        </div>

        {/* Mobile Search */}
        {mobileSearchInput}

        {/* Desktop Search */}
        {desktopSearchInput}

        {/* Right Side Buttons (hidden on mobile) */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 px-4 py-2 border border-[#1E90FF] text-[#1E90FF] rounded-full font-medium bg-white hover:bg-[#e6f3ff] transition-all text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-opacity-50"
                style={{ fontWeight: 500 }}
                onClick={() => setUserDropdownOpen((v) => !v)}
              >
                {/* User avatar with initials */}
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#6dd5ed] text-white font-semibold text-base">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
                <span className="ml-1 text-gray-800">{user.firstName}</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${
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
                <div className="absolute right-0 mt-2 min-w-[14rem] w-auto max-w-xs bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div className="flex flex-col py-2">
                    <div className="flex items-center px-4 py-3 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white font-bold text-base mr-3">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    {/* Profile link */}
                    <button
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer w-full"
                      onClick={() => {
                        navigate("/profile");
                        setUserDropdownOpen(false);
                      }}
                    >
                      Profile
                    </button>
                    {/* Favourites link */}
                    <button
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer w-full"
                      onClick={() => {
                        navigate("/favourites");
                        setUserDropdownOpen(false);
                      }}
                    >
                      Favourites
                    </button>
                    {/* Settings link */}
                    <button
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer w-full"
                      onClick={() => {
                        navigate("/profile/edit");
                        setUserDropdownOpen(false);
                      }}
                    >
                      Settings
                    </button>
                    {/* Add Admin section for admin users */}
                    {user?.userRoleDto?.userRole === "ROLE_ADMIN" && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <div className="px-4 py-2">
                          <span className="text-xs font-semibold text-gray-500">ADMIN</span>
                        </div>
                        <button
                          className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer w-full"
                          onClick={() => {
                            navigate("/admin/users");
                            setUserDropdownOpen(false);
                          }}
                        >
                          User Management
                        </button>
                      </>
                    )}
                    <button
                      className="text-left px-4 py-2 text-sm text-[#1E90FF] hover:bg-gray-100 font-semibold cursor-pointer w-full transition-colors border-t border-gray-100 mt-1 pt-2"
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
              className="px-4 py-2 border border-[#1E90FF] text-[#1E90FF] rounded-md font-medium bg-white hover:bg-[#e6f3ff] transition-all text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-opacity-50"
              style={{ fontWeight: 500 }}
              onClick={() => setAuthModalOpen(true)}
            >
              Sign up | Log in
            </button>
          )}
          <button
            onClick={() => navigate("/sell")}
            className="px-4 py-2 bg-[#1E90FF] text-white rounded-md font-medium hover:bg-[#1876cc] transition-colors text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-opacity-50"
            style={{ fontWeight: 500 }}
          >
            Sell now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-200"
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
        className="border-t border-gray-200 hidden lg:flex flex-col px-12 text-black text-base font-normal bg-white z-40 relative"
        onMouseLeave={() => setHoveredCategoryId(null)}
      >
        <div className="flex items-center space-x-8 py-2 overflow-x-auto">
          {/* Render Level 1 Categories */}
          {getLevel1Categories().map((category) => (
            <div
              key={category.id}
              className="relative group h-full flex items-center"
              onMouseEnter={() => {
                console.log('Mouse entered category:', category.name, category.id);
                setHoveredCategoryId(category.id);
                // Set the first child as hovered level 2 by default if children exist
                if (category.children && category.children.length > 0) {
                     console.log('Setting hoveredLevel2CategoryId to first child:', category.children[0].name, category.children[0].id);
                    setHoveredLevel2CategoryId(category.children[0].id);
                } else {
                    console.log('Level 1 category has no children, setting hoveredLevel2CategoryId to null');
                    setHoveredLevel2CategoryId(null);
                }
              }}
            >
            <button
                className="hover:text-[#1E90FF] transition-colors cursor-pointer whitespace-nowrap py-2 font-medium focus:outline-none"
            >
              {category.name}
            </button>
            </div>
          ))}
           {/* Add "About" and "Our Platform" separately as they don't have dropdowns */}
           <button
              className="hover:text-[#1E90FF] transition-colors cursor-pointer whitespace-nowrap py-2 font-medium focus:outline-none"
              onClick={() => navigate("/about-us")}
            >
              About
            </button>
            <button
              className="hover:text-[#1E90FF] transition-colors cursor-pointer whitespace-nowrap py-2 font-medium focus:outline-none"
              onClick={() => navigate("/our-platform")}
            >
              Our Platform
            </button>
        </div>

        {/* Render Nested Categories when a Level 1 category is hovered */}
        {hoveredCategoryId !== null && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg p-6 z-50 flex border-t border-gray-200">
            {/* Left Column: Level 2 Categories */}
            <div className="w-1/4 border-r border-gray-200 pr-6">
              <div className="mb-3">
                <span className="block px-2 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#1E90FF] cursor-pointer transition-colors">See all</span>
              </div>
              {
                level2Categories.map(level2Category => (
                  <div 
                    key={level2Category.id} 
                    className={`mb-1 rounded-md ${hoveredLevel2CategoryId === level2Category.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} transition-colors`}
                    onMouseEnter={() => {
                      console.log('Mouse entered Level 2 category:', level2Category.name, level2Category.id);
                      setHoveredLevel2CategoryId(level2Category.id);
                    }}
                  >
                    <span 
                      className="block px-2 py-1.5 text-sm font-semibold cursor-pointer flex items-center"
                      onClick={() => {
                        if (!level2Category.children || level2Category.children.length === 0) {
                          console.log('Clicked Level 2 category:', level2Category.name);
                          // Add your navigation logic here
                        }
                      }}
                    >
                      {level2Category.name}
                      {level2Category.children.length > 0 && (
                         <svg className="w-4 h-4 ml-auto text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                    </span>
            </div>
                     ))
                 }
              </div>

            {/* Right Columns: Level 3 and Level 4 Categories (based on hovered Level 2) */}
            {hoveredLevel2Category && level3Categories.length > 0 && (
              <div className="w-3/4 pl-6">
                <div className="flex">
                  {/* Level 3 Categories Column */}
                  <div className="w-1/2 pr-4">
                    <div className="flex flex-col space-y-1">
                      {level3Categories.map(level3Category => (
                        <div key={level3Category.id}>
                          <div 
                            className={`mb-1 rounded-md ${hoveredLevel3CategoryId === level3Category.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} transition-colors`}
                              onMouseEnter={() => {
                                console.log('Mouse entered Level 3 category:', level3Category.name, level3Category.id);
                                setHoveredLevel3CategoryId(level3Category.id);
                              }}
                          >
                            <span 
                              className="block px-2 py-1.5 text-sm font-semibold cursor-pointer flex items-center"
                              onClick={() => {
                                if (!level3Category.children || level3Category.children.length === 0) {
                                  console.log('Clicked Level 3 category:', level3Category.name);
                                  // Add your navigation logic here
                                }
                              }}
                            >
                              {level3Category.name}
                              {level3Category.children.length > 0 && (
                                <svg className="w-4 h-4 ml-auto text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Level 4 Categories Column */}
                  <div className="w-1/2 pl-4 border-l border-gray-200">
                    {hoveredLevel3CategoryId && (
                      <div className="flex flex-col space-y-1">
                        {level3Categories.find(cat => cat.id === hoveredLevel3CategoryId)?.children.map(level4Category => (
                          <div key={level4Category.id}>
                            <div className="mb-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                              <span 
                                className="block px-2 py-1.5 text-sm font-semibold cursor-pointer flex items-center"
                                onClick={() => {
                                  console.log('Clicked Level 4 category:', level4Category.name);
                                  // Add your navigation logic here
                                }}
                              >
                                {level4Category.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          ></div>
          <aside className="fixed top-0 left-0 w-64 md:w-80 h-full bg-white z-50 shadow-lg flex flex-col transition-transform duration-300 transform translate-x-0 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <span
                className="text-2xl font-bold text-[#1E90FF] select-none tracking-tight"
                style={{ fontFamily: "cursive" }}
              >
                E-Com
              </span>
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                    d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3 border-b border-gray-200">
              <button
                onClick={() => {
                  navigate("/sell");
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#1E90FF] text-white rounded-md font-medium hover:bg-[#1876cc] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-opacity-50"
              >
                Sell now
              </button>
              <button
                className="w-full py-2.5 border border-[#1E90FF] text-[#1E90FF] rounded-md font-medium hover:bg-[#e6f3ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-opacity-50"
                onClick={() => setAuthModalOpen(true)}
              >
                Sign up | Log in
              </button>
            </div>

            <div className="px-4 py-3 text-sm font-semibold text-gray-600 border-b border-gray-200">
              Categories
            </div>

            <div className="flex-1 overflow-y-auto mobile-sidebar">
              {getLevel1Categories().map((category) => (
                <button
                  key={category.id}
                  className="w-full flex items-center px-4 py-3 text-gray-800 hover:text-[#1E90FF] hover:bg-[#e6f3ff] text-base cursor-pointer transition-colors font-medium focus:outline-none"
                >
                  {category.name}
                </button>
              ))}
              <button
                className="w-full flex items-center px-4 py-3 text-gray-800 hover:text-[#1E90FF] hover:bg-[#e6f3ff] text-base cursor-pointer transition-colors font-medium focus:outline-none"
                onClick={() => {
                  navigate("/about-us");
                  setMenuOpen(false);
                }}
              >
                About
              </button>
              <button
                className="w-full flex items-center px-4 py-3 text-gray-800 hover:text-[#1E90FF] hover:bg-[#e6f3ff] text-base cursor-pointer transition-colors font-medium focus:outline-none"
                onClick={() => {
                  navigate("/our-platform");
                  setMenuOpen(false);
                }}
              >
                Our Platform
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Render AuthModal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </nav>
  );
};
