import React, { useEffect, useState, useRef } from "react";
import { getProductCategoryTree } from "../API/ProductCategoryApi";
import { getProductsByCategory } from "../API/productApi";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isDesktop;
}

// ProductCardPreview: styled to match main product cards
function ProductCardPreview({ product, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative group">
        <img
          src={product.responseDto?.imageUrl || 'https://placehold.co/400x400/png'}
          alt={product.title}
          className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/png'; }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.title}</h3>
        <h4 className="text-sm text-gray-600 mt-1">{product.brand?.brand}</h4>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-lg font-bold text-gray-900">LKR {product.price?.toFixed(2)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.conditions?.name === 'New with tags' ? 'bg-green-100 text-green-800' :
            product.conditions?.name === 'New without tags' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {product.conditions?.name || 'Used'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDropdownRecursive({ mobileMenuOpen: controlledMobileMenuOpen, setMobileMenuOpen: controlledSetMobileMenuOpen }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [activeRoot, setActiveRoot] = useState(null); // The currently selected Level 1 category
  const [hoveredPath, setHoveredPath] = useState([]); // Array of hovered categories (one per level)
  const [hoveredIndexes, setHoveredIndexes] = useState([]); // Array of hovered item indexes per level
  const [previewProducts, setPreviewProducts] = useState([]); // Products for preview
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const menuRef = useRef(null);
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const closeTimeout = useRef();
  const [mobileMenuOpenInternal, setMobileMenuOpenInternal] = useState(false);
  const mobileMenuOpen = controlledMobileMenuOpen !== undefined ? controlledMobileMenuOpen : mobileMenuOpenInternal;
  const setMobileMenuOpen = controlledSetMobileMenuOpen || setMobileMenuOpenInternal;
  const [mobileDrillPath, setMobileDrillPath] = useState([]); // Array of categories for drilldown

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getProductCategoryTree();
      if (data && Array.isArray(data.responseDto)) {
        setCategories(data.responseDto);
      } else {
        setError("Unexpected API response: categories not found in responseDto array.");
      }
    };
    fetchCategories();
  }, []);

  // Only close dropdown when mouse leaves the entire dropdown area
  const handleDropdownMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveRoot(null);
      setHoveredPath([]);
      setHoveredIndexes([]);
      setPreviewProducts([]);
      setPreviewError(null);
    }, 150);
  };
  const handleDropdownMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };

  // Fetch preview products when hovering arrow on a leaf
  useEffect(() => {
    const fetchPreview = async () => {
      if (!hoveredPath.length) {
        setPreviewProducts([]);
        setPreviewError(null);
        return;
      }
      const last = hoveredPath[hoveredPath.length - 1];
      if (last && (!last.children || last.children.length === 0)) {
        setPreviewLoading(true);
        setPreviewError(null);
        setPreviewProducts([]);
        const result = await getProductsByCategory(last.id);
        setPreviewLoading(false);
        if (Array.isArray(result)) {
          setPreviewProducts(result);
        } else {
          setPreviewError(result.error || "No products found.");
        }
      } else {
        setPreviewProducts([]);
        setPreviewError(null);
      }
    };
    fetchPreview();
  }, [hoveredPath]);

  if (error) {
    return <div className="text-red-500 p-2">{error}</div>;
  }

  // Build columns for each level in the hovered path, starting from Level 2 (children of activeRoot)
  function buildColumns() {
    const columns = [];
    if (!activeRoot) return columns;
    let current = activeRoot.children || [];
    for (let level = 0; ; level++) {
      if (!current || current.length === 0) break;
      const hoveredIdx = hoveredIndexes[level];
      columns.push({
        categories: current,
        hoveredIdx,
        level
      });
      if (hoveredIdx == null || !current[hoveredIdx] || !current[hoveredIdx].children || current[hoveredIdx].children.length === 0) {
        break;
      }
      current = current[hoveredIdx].children;
    }
    return columns;
  }

  const columns = buildColumns();
  const lastColumn = columns[columns.length - 1];
  const lastHoveredIdx = lastColumn ? lastColumn.hoveredIdx : null;
  const lastHoveredCat = lastColumn && lastHoveredIdx != null ? lastColumn.categories[lastHoveredIdx] : null;
  const showProductPreview = lastHoveredCat && (!lastHoveredCat.children || lastHoveredCat.children.length === 0);

  // Mobile drilldown helpers
  function getMobileCurrentCategories() {
    if (mobileDrillPath.length === 0) return categories;
    let current = categories;
    for (const cat of mobileDrillPath) {
      const found = current.find(c => c.id === cat.id);
      if (found && found.children && found.children.length > 0) {
        current = found.children;
      } else {
        return [];
      }
    }
    return current;
  }

  return (
    <nav className="relative z-40 w-full bg-white border-b border-gray-200">
      {/* Mobile hamburger icon */}
      <div className="flex items-center px-4 py-2 w-full max-w-7xl mx-auto lg:hidden">
        <button
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-7 w-7" />
        </button>
        <span className="ml-4 text-xl font-bold text-[#1E90FF]">E-Com</span>
      </div>
      {/* Desktop navbar */}
      <div className="hidden lg:flex items-center space-x-6 px-4 py-2 w-full max-w-7xl mx-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`px-4 py-2 font-medium whitespace-nowrap rounded hover:text-blue-600 transition-colors ${activeRoot && activeRoot.id === cat.id ? "bg-blue-50 text-blue-700" : "bg-white text-gray-800"}`}
            onClick={() => !isDesktop ? setActiveRoot(cat) : undefined}
            onMouseEnter={() => isDesktop ? setActiveRoot(cat) : undefined}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {/* Desktop dropdown */}
      {activeRoot && (
        <div
          ref={menuRef}
          className="hidden lg:flex absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-50 flex-row items-start px-8 py-6"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {columns.map((col, colIdx) => (
            <div
              key={col.level}
              className="min-w-[240px] overflow-visible border-r border-gray-200 bg-white shadow-md mr-2 rounded-lg py-2 relative"
            >
              <ul>
                {col.categories.map((cat, idx) => (
                  <li
                    key={cat.id}
                    className={`category-menu-item flex items-center justify-between py-3 px-5 rounded-lg transition-colors duration-150 group hover:bg-blue-100 cursor-pointer mb-1 ${col.hoveredIdx === idx ? 'bg-blue-100' : ''}`}
                    onMouseEnter={() => {
                      setHoveredPath([
                        ...hoveredPath.slice(0, col.level),
                        cat
                      ]);
                      setHoveredIndexes([
                        ...hoveredIndexes.slice(0, col.level),
                        idx
                      ]);
                    }}
                  >
                    <span
                      className="flex-1 cursor-pointer text-base"
                      onClick={() => {
                        navigate(`/category/${cat.id}`);
                        setActiveRoot(null);
                        setHoveredPath([]);
                        setHoveredIndexes([]);
                        setPreviewProducts([]);
                        setPreviewError(null);
                      }}
                    >
                      {cat.name}
                    </span>
                    {(cat.children && cat.children.length > 0) ? (
                      <span
                        className="ml-3 cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 5L12 10L7 15" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {/* Mobile full-screen category menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="relative w-full max-w-md bg-white h-full flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              {mobileDrillPath.length > 0 ? (
                <button
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setMobileDrillPath(mobileDrillPath.slice(0, -1))}
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
              ) : <span />}
              <span className="text-lg font-bold text-[#1E90FF]">Categories</span>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => { setMobileMenuOpen(false); setMobileDrillPath([]); }}
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul>
                {getMobileCurrentCategories().map(cat => (
                  <li key={cat.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-blue-100 cursor-pointer mb-1"
                    onClick={() => {
                      if (cat.children && cat.children.length > 0) {
                        setMobileDrillPath([...mobileDrillPath, cat]);
                      } else {
                        navigate(`/category/${cat.id}`);
                        setMobileMenuOpen(false);
                        setMobileDrillPath([]);
                      }
                    }}
                  >
                    <span
                      className="flex-1 text-base font-medium text-blue-700 active:opacity-70"
                    >
                      {cat.name}
                    </span>
                    {cat.children && cat.children.length > 0 && (
                      <span className="ml-2">
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 5L12 10L7 15" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => { setMobileMenuOpen(false); setMobileDrillPath([]); }} />
        </div>
      )}
    </nav>
  );
} 