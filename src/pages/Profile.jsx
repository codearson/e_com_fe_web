import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";

const profile = {
  username: "prusoth26",
  reviews: 0,
  location: "United Kingdom",
  lastSeen: "12 seconds ago",
  followers: 0,
  following: 0,
  verified: ["Google", "Email"],
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

export const Profile = () => {
  const [tab, setTab] = useState("listings");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:space-x-8 bg-white rounded-2xl shadow p-4 md:p-10 mb-8">
          <div className="flex-shrink-0 flex justify-center md:block mb-4 md:mb-0">
            <img src={profile.avatar} alt="Profile" className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 shadow" />
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                <span className="text-2xl md:text-3xl font-bold mr-0 sm:mr-3">{profile.username}</span>
                <span className="text-gray-500 text-base">No reviews yet</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600 text-base mb-2 gap-1 sm:gap-0">
                <div className="flex items-center justify-center mb-1 sm:mb-0">
                  <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
                  {profile.location}
                </div>
                <div className="flex items-center justify-center mb-1 sm:mb-0">
                  <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17v1a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-1"/><path d="M12 12v4"/><path d="M12 4v4"/></svg>
                  Last seen {profile.lastSeen}
                </div>
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/><path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>{profile.followers} followers, </span>
                  <span className="ml-1">{profile.following} following</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-600 text-base mb-2 gap-x-3 gap-y-1">
                <span className="mr-2">Verified info:</span>
                {profile.verified.map((v) => (
                  <span key={v} className="flex items-center mr-2">
                    <svg className="w-5 h-5 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex md:justify-end w-full md:w-auto mt-4 md:mt-0">
              <button
                className="w-full md:w-auto px-6 py-2 bg-[#1E90FF] text-white rounded-lg font-medium hover:bg-[#1876cc] transition flex items-center justify-center"
                onClick={() => navigate("/profile/edit")}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                Edit profile
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex border-b mb-6">
            <button onClick={() => setTab("listings")}
              className={`px-6 py-2 font-medium text-lg focus:outline-none ${tab === "listings" ? "border-b-2 border-[#1E90FF] text-[#1E90FF]" : "text-gray-600"}`}>Listings</button>
            <button onClick={() => setTab("reviews")}
              className={`px-6 py-2 font-medium text-lg focus:outline-none ${tab === "reviews" ? "border-b-2 border-[#1E90FF] text-[#1E90FF]" : "text-gray-600"}`}>Reviews</button>
          </div>
          {/* Listings Tab */}
          {tab === "listings" && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg width="80" height="80" fill="none" stroke="#6C63FF" strokeWidth="2" viewBox="0 0 64 64" className="mb-6">
                <circle cx="32" cy="32" r="30" stroke="#6C63FF" strokeWidth="2" fill="#f3f4f6"/>
                <path d="M24 44V28l8-8 8 8v16" stroke="#6C63FF" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="32" cy="36" r="2" fill="#6C63FF"/>
                <rect x="28" y="44" width="8" height="4" rx="2" fill="#6C63FF"/>
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-center">Upload items to start selling</h2>
              <p className="text-lg text-gray-500 mb-6 text-center">Declutter your life. Sell what you don't wear anymore!</p>
              <button className="px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors">List now</button>
            </div>
          )}
          {/* Reviews Tab */}
          {tab === "reviews" && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg width="80" height="80" fill="none" stroke="#6C63FF" strokeWidth="2" viewBox="0 0 64 64" className="mb-6">
                <circle cx="32" cy="32" r="30" stroke="#6C63FF" strokeWidth="2" fill="#f3f4f6"/>
                <path d="M20 40h24M20 32h24M20 24h24" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-center">No reviews yet</h2>
              <p className="text-lg text-gray-500 mb-6 text-center">Once you get reviews, they'll show up here.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 