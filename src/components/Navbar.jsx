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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setUserDropdownOpen(false);
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="bg-white border-b border-gray-200 font-sans sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-3">
        {/* Logo */}
        <div className="flex items-center">
          <span
            className="text-2xl lg:text-3xl font-semibold text-[#1E90FF] mr-4 select-none"
            style={{ fontFamily: "cursive" }}
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
      <div className="border-t border-gray-300 hidden lg:flex items-center space-x-8 px-12 py-2 text-black text-base font-normal overflow-x-auto">
        {[
          "Women",
          "Men",
          "Designer",
          "Kids",
          "Home",
          "Electronics",
          "Entertainment",
          "Sports",
          "Pet care",
          "About",
          "Our Platform",
        ].map((item) => (
          <button
            key={item}
            className="hover:text-[#1E90FF] transition-colors cursor-pointer whitespace-nowrap"
            onClick={() => {
              if (item === "About") navigate("/about-us");
              // You can add more routes here for other items if needed
            }}
          >
            {item}
          </button>
        ))}
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
