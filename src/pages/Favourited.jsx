import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import React from "react";

const exampleFavourites = [
  {
    id: 1,
    title: "croc style shoes",
    subtitle: "4.5 · New without tags",
    price: "£2.50",
    priceIncl: "£3.33 incl.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    likes: 9
  },
  {
    id: 2,
    title: "Classic White Sneakers",
    subtitle: "4.8 · New",
    price: "£45.00",
    priceIncl: "£48.00 incl.",
    image: "https://images.unsplash.com/photo-1517260911205-8a3b66e07b64?auto=format&fit=crop&w=400&q=80",
    likes: 15
  },
  {
    id: 3,
    title: "Leather Handbag",
    subtitle: "4.7 · Like new",
    price: "£89.99",
    priceIncl: "£92.99 incl.",
    image: "https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=crop&w=400&q=80",
    likes: 22
  },
  {
    id: 4,
    title: "Smart Watch",
    subtitle: "4.9 · New",
    price: "£129.99",
    priceIncl: "£134.99 incl.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    likes: 30
  },
  {
    id: 5,
    title: "Wireless Headphones",
    subtitle: "4.6 · Good",
    price: "£59.99",
    priceIncl: "£62.99 incl.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    likes: 18
  },
  {
    id: 6,
    title: "Denim Jeans",
    subtitle: "4.4 · Like new",
    price: "£25.00",
    priceIncl: "£27.00 incl.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    likes: 12
  },
  {
    id: 7,
    title: "Summer Dress",
    subtitle: "4.8 · New",
    price: "£35.00",
    priceIncl: "£37.00 incl.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    likes: 21
  },
  {
    id: 8,
    title: "Running Shoes",
    subtitle: "4.7 · Good",
    price: "£55.00",
    priceIncl: "£58.00 incl.",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    likes: 16
  },
  {
    id: 9,
    title: "Backpack",
    subtitle: "4.5 · Like new",
    price: "£40.00",
    priceIncl: "£42.00 incl.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    likes: 13
  },
  {
    id: 10,
    title: "Sunglasses",
    subtitle: "4.9 · New",
    price: "£20.00",
    priceIncl: "£22.00 incl.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    likes: 25
  },
  {
    id: 11,
    title: "Wool Scarf",
    subtitle: "4.6 · Good",
    price: "£15.00",
    priceIncl: "£16.50 incl.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    likes: 8
  },
  {
    id: 12,
    title: "Leather Boots",
    subtitle: "4.7 · Like new",
    price: "£75.00",
    priceIncl: "£78.00 incl.",
    image: "https://images.unsplash.com/photo-1517260911205-8a3b66e07b64?auto=format&fit=crop&w=400&q=80",
    likes: 19
  },
  {
    id: 13,
    title: "Sports Jacket",
    subtitle: "4.8 · New",
    price: "£60.00",
    priceIncl: "£63.00 incl.",
    image: "https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=crop&w=400&q=80",
    likes: 14
  },
  {
    id: 14,
    title: "Casual T-shirt",
    subtitle: "4.5 · Good",
    price: "£10.00",
    priceIncl: "£11.00 incl.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    likes: 11
  },
  {
    id: 15,
    title: "Travel Mug",
    subtitle: "4.9 · New",
    price: "£8.00",
    priceIncl: "£9.00 incl.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    likes: 7
  }
];

export const Favourited = () => {
  const favourites = exampleFavourites; // Replace with dynamic data in real app
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#c7d2fe] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        {favourites.length === 0 ? (
          <div className="animate-fadein w-full max-w-xs bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col items-center px-6 py-8 border border-white/30 relative" style={{boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.12)'}}>
            <span className="beating-heart mb-6 drop-shadow-xl" style={{filter: 'drop-shadow(0 0 12px #e573a6aa)'}}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffb6d5" />
                    <stop offset="1" stopColor="#e573a6" />
                  </linearGradient>
                </defs>
                <path d="M28 48s-13.5-9.1-18-17.1C6.1 25.1 6 19.5 10.2 15.7c4.2-3.8 10.2-2.7 13.1 1.2C25.9 19.5 28 22 28 22s2.1-2.5 4.7-5.1c2.9-3.9 8.9-5 13.1-1.2 4.2 3.8 4.1 9.4.2 15.2C41.5 38.9 28 48 28 48z" fill="url(#heartGradient)" stroke="#fff" strokeWidth="2"/>
              </svg>
            </span>
            <h1 className="text-xl font-extrabold text-gray-900 mb-1 text-center tracking-tight">Favourite</h1>
            <h2 className="text-base font-medium text-gray-700 mb-1 text-center">Save your favourites</h2>
            <p className="text-gray-500 mb-5 text-center text-sm">Favourite some items and find them here</p>
            <button className="px-6 py-2 bg-[#1E90FF] text-white rounded-full text-base font-bold shadow hover:bg-[#1876cc] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">Browse</button>
          </div>
        ) : (
          <div className="mt-12 w-full max-w-7xl px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {favourites.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-0 flex flex-col items-start relative transition-shadow hover:shadow-xl">
                  <div className="relative w-full">
                    <img src={item.image} alt={item.title} className="w-full h-56 object-cover rounded-2xl" />
                    <div className="absolute bottom-3 right-3 bg-white rounded-full flex items-center px-3 py-1 shadow-md">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#e573a6" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.62 20.87l-.12.1-.12-.1C7.1 17.14 3 13.39 3 9.5 3 6.42 5.42 4 8.5 4c1.74 0 3.41 0.81 4.5 2.09C14.09 4.81 15.76 4 17.5 4 20.58 4 23 6.42 23 9.5c0 3.89-4.1 7.64-8.38 11.37z"/>
                      </svg>
                      <span className="ml-1 text-gray-700 font-medium text-sm">{item.likes}</span>
                    </div>
                  </div>
                  <div className="px-4 pt-3 pb-4 w-full">
                    <div className="font-medium text-gray-900 text-base mb-1 truncate">{item.title}</div>
                    <div className="text-gray-500 text-sm mb-1">{item.subtitle}</div>
                    <div className="text-gray-700 text-base mb-0.5">{item.price}</div>
                    <div className="text-[#1E90FF] text-base font-semibold flex items-center gap-1">
                      {item.priceIncl}
                      <svg width="16" height="16" fill="none" stroke="#1E90FF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <style>{`
        .beating-heart svg {
          animation: beat 1s infinite;
          transform-origin: center;
        }
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.1); }
          20% { transform: scale(0.95); }
          30% { transform: scale(1.05); }
          50% { transform: scale(1.15); }
          70% { transform: scale(0.97); }
          80% { transform: scale(1.05); }
        }
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Favourited;
