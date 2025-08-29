import React, { useState, useEffect } from "react";
import { createInquiry } from "../API/inquiryApi";
import { getUserByEmail } from "../API/config";
import { decodeJwt } from "../API/UserApi";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const Inquiry = () => {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryRole, setInquiryRole] = useState("BUYER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded = decodeJwt(token);
          const userEmail = decoded?.sub;
          if (userEmail) {
            const userData = await getUserByEmail(userEmail);
            if (userData) {
              setUser(userData);
              setEmail(userEmail);
            }
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        setError("You must be logged in to submit an inquiry.");
        return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (!subject || !message) {
      setError("Subject and message are required.");
      setIsSubmitting(false);
      return;
    }

    const inquiryData = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: email,
      userRole: inquiryRole,
      subject,
      message,
    };

    try {
      const result = await createInquiry(inquiryData);
      if (result.responseDto) {
        setSubject("");
        setMessage("");
        setSuccessMessage("Your inquiry has been submitted successfully! We will get back to you shortly.");
      } else {
        setError(result.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Get in Touch</h1>
            <p className="font-semibold text-gray-500 mb-8">Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
              {successMessage && <div className="text-green-600 bg-green-100 p-4 rounded-lg">{successMessage}</div>}

              <div>
                <label htmlFor="inquiryRole" className="block text-sm font-medium text-gray-700">Role</label>
                <select id="inquiryRole" value={inquiryRole} onChange={(e) => setInquiryRole(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g., Question about a product" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows="5" required placeholder="Please describe your inquiry in detail..." className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>

              <button type="submit" disabled={isSubmitting || !user} className="w-full inline-flex justify-center py-4 px-6 border border-transparent shadow-lg text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
               {!user && <p className="text-center text-sm text-gray-500 mt-4">Please log in to send a message.</p>}
            </form>
          </div>

          <div className="hidden md:block">
              <img src="/src/assets/rag-doll-with-giant-magnifying-glass-question-mark.jpg" alt="Contact us illustration" className="w-full h-auto" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inquiry;
