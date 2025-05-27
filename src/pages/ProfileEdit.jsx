import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const tabs = [
  { key: "profile", label: "Profile details" },
  { key: "account", label: "Account settings" },
  { key: "privacy", label: "Privacy settings" },
  { key: "security", label: "Security" },
];

function ConfirmChange({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Confirm change</h2>
      <p className="text-lg text-gray-600 mb-2 text-center">You need to confirm<br /><span className="font-semibold">mrprusothaman@gmail.com</span> is your email address before you can update it.</p>
      <button className="px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors mb-4">Send confirmation email</button>
      <button className="text-[#1E90FF] underline mb-8">I don't have access to this email</button>
      <button onClick={onBack} className="mt-4 text-[#1E90FF] font-medium">&larr; Back</button>
    </div>
  );
}

function ChangePassword({ onBack }) {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Change password</h2>
      <div className="bg-gray-100 rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-2">To create a secure password:</h3>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>When setting up a password, go for something that is not too obvious. It can be a combination of numbers, special characters, capital and lower case letters. The length of the password should be at least 7 characters.</li>
          <li>Don't use your name or date of birth when setting up a password.</li>
          <li>Memorize your password. Do not keep any record of it, do not tell other people about it. Try to change it regularly.</li>
          <li>Make sure no one can see you entering the password.</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 max-w-xl">
        <input type="password" placeholder="New password" className="border rounded px-4 py-2" />
        <input type="password" placeholder="Re-enter your new password" className="border rounded px-4 py-2" />
        <button className="px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors">Change password</button>
      </div>
      <button onClick={onBack} className="mt-8 text-[#1E90FF] font-medium">&larr; Back</button>
    </div>
  );
}

function VerifyPhone({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify your phone number</h2>
      <p className="text-lg text-gray-600 mb-4 text-center">We'll send a confirmation message or give you a call to verify that this is your number.</p>
      <form className="w-full max-w-xs flex flex-col items-center gap-4 mb-4">
        <label className="block text-base font-medium mb-1 w-full text-left">Phone number</label>
        <input type="text" value="+44" className="border rounded px-4 py-2 w-full text-center" readOnly />
        <button className="w-full px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors">Send</button>
      </form>
      <div className="text-gray-500 text-center">Having trouble? <a href="#" className="underline text-[#1E90FF]">Get help</a></div>
      <button onClick={onBack} className="mt-8 text-[#1E90FF] font-medium">&larr; Back</button>
    </div>
  );
}

export const ProfileEdit = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [securityPage, setSecurityPage] = useState(null);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 self-start">Settings</h2>
              <nav className="flex flex-col gap-2 w-full">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSecurityPage && setSecurityPage(null); }}
                    className={`w-full px-5 py-2 text-base font-semibold transition rounded-full text-left
                      ${activeTab === tab.key
                        ? 'bg-[#1E90FF] text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-[#eaf1fb] hover:text-[#1E90FF]'}
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
          {/* Main Content */}
          <section className="flex-1 bg-white rounded-2xl shadow p-4 md:p-8 min-h-[400px]">
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Profile details</h3>
                <div className="mb-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-base font-medium mb-2">Your photo</span>
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mb-2" />
                    <button className="border border-[#1E90FF] text-[#1E90FF] rounded px-4 py-1 font-medium hover:bg-[#e6f3ff] transition">Choose photo</button>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div>
                      <span className="block font-medium mb-1">Username</span>
                      <div className="flex gap-2 items-center">
                        <input type="text" className="border rounded px-3 py-2 w-full max-w-xs" value="prusoth26" readOnly />
                        <button className="border border-[#1E90FF] text-[#1E90FF] rounded px-4 py-1 font-medium hover:bg-[#e6f3ff] transition">Change username</button>
                      </div>
                    </div>
                    <div>
                      <span className="block font-medium mb-1">About you</span>
                      <textarea className="border rounded px-3 py-2 w-full min-h-[60px]" placeholder="Tell us more about yourself and your style" />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-700">My location</h4>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <span className="block font-medium mb-1">Country</span>
                      <select className="border rounded px-3 py-2 w-full max-w-xs">
                        <option>United Kingdom</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <span className="block font-medium mb-1">Town/City</span>
                      <select className="border rounded px-3 py-2 w-full max-w-xs">
                        <option>Select a city</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Show city in profile</span>
                    <input type="checkbox" className="accent-[#1E90FF] w-5 h-5" defaultChecked />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-700">Language</h4>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <span className="block font-medium mb-1">Language</span>
                  <select className="border rounded px-3 py-2 w-full max-w-xs">
                    <option>English, UK (English)</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-[#1E90FF] text-white rounded-lg font-medium hover:bg-[#1876cc] transition">Update profile</button>
                </div>
              </div>
            )}
            {activeTab === "account" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Account settings</h3>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                  <div>
                    <span className="block font-medium mb-1">Email</span>
                    <div className="flex gap-2 items-center">
                      <input type="email" className="border rounded px-3 py-2 w-full max-w-xs" value="mrprusothaman@gmail.com" readOnly />
                      <button className="border border-[#1E90FF] text-[#1E90FF] rounded px-4 py-1 font-medium hover:bg-[#e6f3ff] transition">Change</button>
                    </div>
                  </div>
                  <div>
                    <span className="block font-medium mb-1">Phone number</span>
                    <div className="flex gap-2 items-center">
                      <input type="tel" className="border rounded px-3 py-2 w-full max-w-xs" placeholder="Enter phone number" />
                      <button className="border border-[#1E90FF] text-[#1E90FF] rounded px-4 py-1 font-medium hover:bg-[#e6f3ff] transition">Verify</button>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <span className="block font-medium mb-1">Full name</span>
                      <input type="text" className="border rounded px-3 py-2 w-full max-w-xs" value="Prusothaman Mr" readOnly />
                    </div>
                    <div className="flex-1">
                      <span className="block font-medium mb-1">Gender</span>
                      <select className="border rounded px-3 py-2 w-full max-w-xs">
                        <option>Select gender</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <span className="block font-medium mb-1">Birthday</span>
                      <div className="flex gap-2">
                        <input type="text" className="border rounded px-2 py-2 w-16" placeholder="Day" />
                        <input type="text" className="border rounded px-2 py-2 w-24" placeholder="Month" />
                        <input type="text" className="border rounded px-2 py-2 w-24" placeholder="Year" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-[#1E90FF] text-white rounded-lg font-medium hover:bg-[#1876cc] transition">Save</button>
                </div>
              </div>
            )}
            {activeTab === "privacy" && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Privacy settings</h3>
                <div className="bg-white/80 backdrop-blur rounded-xl shadow p-2 md:p-4 flex flex-col gap-3 md:gap-4">
                  <style>{`
                    .toggle-switch {
                      position: relative;
                      display: inline-block;
                      width: 40px;
                      height: 22px;
                    }
                    .toggle-switch input { display: none; }
                    .slider {
                      position: absolute;
                      cursor: pointer;
                      top: 0; left: 0; right: 0; bottom: 0;
                      background: #e5e7eb;
                      transition: .4s;
                      border-radius: 9999px;
                    }
                    .slider:before {
                      position: absolute;
                      content: "";
                      height: 18px;
                      width: 18px;
                      left: 2px;
                      bottom: 2px;
                      background: white;
                      transition: .4s;
                      border-radius: 50%;
                      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                    }
                    input:checked + .slider {
                      background: #1E90FF;
                    }
                    input:checked + .slider:before {
                      transform: translateX(18px);
                    }
                  `}</style>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <div>
                      <span className="block font-semibold text-gray-900">Feature my items in marketing campaigns for a chance to sell faster</span>
                      <span className="block text-gray-500 text-sm">This allows to showcase my items on social media and other websites. The increased visibility could lead to quicker sales.</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="font-semibold text-gray-900">Notify owners when I favourite their items</span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="font-semibold text-gray-900">Allow third-party tracking</span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm min-h-[64px]">
                    <span className="font-semibold text-gray-900 flex-1">Allow E-Com to personalise my feed and search results by evaluating my preferences, settings, previous purchases and usage of E-Com website and app</span>
                    <label className="toggle-switch self-center">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="font-semibold text-gray-900">Allow E-Com to display my recently viewed items on my Homepage.</span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="block font-semibold text-gray-900">Download account data</span>
                    <span className="block text-gray-500 text-sm">Request a copy of your E-Com account data.</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "security" && !securityPage && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Keep your account secure</h3>
                <div className="bg-white/80 backdrop-blur rounded-xl shadow p-2 md:p-4 flex flex-col gap-3 md:gap-4">
                  <button
                    onClick={() => setSecurityPage("confirm")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm hover:shadow-md border border-transparent hover:border-[#1E90FF] transition group focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E90FF]/10 text-[#1E90FF] text-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12v1a4 4 0 0 1-8 0v-1"/><path d="M12 16v2"/><circle cx="12" cy="8" r="4"/></svg>
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-base font-semibold text-[#1E90FF] group-hover:underline">Confirm change</span>
                      <span className="block text-gray-500 text-sm">Keep your email up to date.</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setSecurityPage("password")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm hover:shadow-md border border-transparent hover:border-[#1E90FF] transition group focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E90FF]/10 text-[#1E90FF] text-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-base font-semibold text-[#1E90FF] group-hover:underline">Password</span>
                      <span className="block text-gray-500 text-sm">Protect your account with a stronger password.</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setSecurityPage("verify")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm hover:shadow-md border border-transparent hover:border-[#1E90FF] transition group focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E90FF]/10 text-[#1E90FF] text-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19v-6"/><circle cx="12" cy="7" r="4"/><path d="M5 21h14"/></svg>
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-base font-semibold text-[#1E90FF] group-hover:underline">2-step verification</span>
                      <span className="block text-gray-500 text-sm">Confirm new logins with a 4-digit code.</span>
                    </span>
                  </button>
                </div>
              </div>
            )}
            {activeTab === "security" && securityPage === "confirm" && (
              <ConfirmChange onBack={() => setSecurityPage(null)} />
            )}
            {activeTab === "security" && securityPage === "password" && (
              <ChangePassword onBack={() => setSecurityPage(null)} />
            )}
            {activeTab === "security" && securityPage === "verify" && (
              <VerifyPhone onBack={() => setSecurityPage(null)} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileEdit; 