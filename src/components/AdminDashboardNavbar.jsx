import React, { useState, useEffect, useRef } from "react";
import { AuthModal } from "./AuthModal";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export const AdminDashboardNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage = location.pathname === '/admin/dashboard';

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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setUserDropdownOpen(false);
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 font-sans z-50 relative">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
        {/* Logo and mobile sidebar toggle*/}
        <div className="flex items-center flex-shrink-0">
          <span
            className="text-2xl lg:text-3xl font-bold text-[#1E90FF] mr-6 select-none tracking-tight"
            style={{ fontFamily: "cursive", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            E-Com
          </span>
        </div>

        {/* Right Side Buttons (hidden on mobile) */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            className="px-4 py-2 border border-[#1E90FF] text-[#1E90FF] rounded-md font-medium bg-white hover:bg-[#e6f3ff] transition-all text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-opacity-50"
            style={{ fontWeight: 500 }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
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

                    <button
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer w-full"
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setUserDropdownOpen(false);
                      }}
                    >
                      Dashboard
                    </button>
                    
                    {/* Admin Dropdown for Admin Users */}
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
