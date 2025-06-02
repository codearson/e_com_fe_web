import React from "react";
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
    <main className="max-w-5xl mx-auto px-6 py-16 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          At E-Com, your privacy is our priority. This policy outlines how we
          collect, use, and protect your data when you interact with our
          platform.
        </p>

        <section className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">What We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Personal details (e.g., name, email, address)</li>
            <li>Order history and preferences</li>
            <li>Usage data and device information</li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>To personalize your shopping experience</li>
            <li>To process transactions securely</li>
            <li>To provide customer support and service updates</li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You can access and update your personal data</li>
            <li>You can opt out of marketing emails at any time</li>
            <li>You have the right to request deletion of your data</li>
          </ul>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default PrivacyPolicy;
