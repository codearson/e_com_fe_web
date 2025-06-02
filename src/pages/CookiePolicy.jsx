import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white">  
    <Navbar />     
    <main className="max-w-5xl mx-auto px-6 py-16 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Cookie Policy
        </h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Cookies help us personalize your experience and analyze our platform
          performance. This page explains how we use cookies and your choices.
        </p>

        <section className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Track website usage and visitor behavior</li>
            <li>Enable essential functionalities like login and cart</li>
            <li>Deliver relevant ads and product suggestions</li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Managing Your Preferences</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You can enable or disable cookies via your browser settings</li>
            <li>
              Customize cookie use on our{" "}
              <a
                href="/cookie-settings"
                className="text-blue-600 hover:underline font-medium"
              >
                Cookie Settings
              </a>{" "}
              page
            </li>
            <li>
              Disabling cookies may affect your ability to use some site
              features
            </li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Your Consent</h2>
          <p className="text-gray-700">
            By continuing to use our website, you consent to our use of cookies
            as outlined in this policy.
          </p>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default CookiePolicy;
