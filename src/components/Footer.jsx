import React from "react";

export const Footer = () => (
  <footer className="bg-white border-t mt-16 text-gray-600 text-sm">
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Top: Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">E - Com</h3>
          <ul className="space-y-2">
            <li>
              <a href="/about-us" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Jobs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Sustainability
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Advertising
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Accessibility
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Discover</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                How it works
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Item Verification
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Mobile apps
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Infoboard
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Help</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Help Centre
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Selling
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Buying
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Trust and Safety
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Social & App Icons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t pt-6">
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
          {/* Facebook */}
          <a href="#" className="hover:opacity-70">
            <svg className="w-7 h-7" fill="#bdbdbd" viewBox="0 0 24 24">
              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="hover:opacity-70">
            <svg className="w-7 h-7" fill="#bdbdbd" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.233h.041c.401-.761 1.381-1.562 2.841-1.562 3.039 0 3.6 2.001 3.6 4.601v4.728z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="hover:opacity-70">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="#bdbdbd"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <rect
                x="2.5"
                y="2.5"
                width="19"
                height="19"
                rx="5"
                stroke="#bdbdbd"
                strokeWidth="1.5"
                fill="none"
              />
              <circle
                cx="12"
                cy="12"
                r="5"
                stroke="#bdbdbd"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="17" cy="7" r="1.2" fill="#bdbdbd" />
            </svg>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {/* App Store Badges (SVGs from assets) */}
          <a href="#" className="block">
            <img
              src="/src/assets/apple.svg"
              alt="Download on the App Store"
              className="h-10 w-auto"
            />
          </a>
          <a href="#" className="block">
            <img
              src="/src/assets/google.svg"
              alt="Get it on Google Play"
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>
      {/* Bottom: Policy Links */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 border-t pt-4 mt-6 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4 mb-2 md:mb-0">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Cookie Policy
          </a>
          <a href="#" className="hover:underline">
            Cookie Settings
          </a>
          <a href="#" className="hover:underline">
            Terms & Conditions
          </a>
          <a href="/our-platform" className="hover:underline">
            Our Platform
          </a>
        </div>
      </div>
    </div>
  </footer>
);
