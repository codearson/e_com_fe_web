import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const CookieSettings = () => {
  return (
    <div className="min-h-screen bg-white">
       <Navbar />  
    <main className="max-w-4xl mx-auto px-6 py-16 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Cookie Settings
        </h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Customize your cookie preferences below to control how we use data to
          improve your experience.
        </p>

        <form className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              disabled
            />
            <label className="text-gray-700">
              <strong>Necessary Cookies</strong> — Required for website
              functionality and cannot be disabled.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label className="text-gray-700">
              <strong>Analytics Cookies</strong> — Help us understand how
              visitors interact with our website.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label className="text-gray-700">
              <strong>Marketing Cookies</strong> — Used to personalize
              advertising based on your interests.
            </label>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Save Preferences
          </button>
        </form>

        <p className="mt-8 text-gray-600">
          Want to know more? Visit our{" "}
          <a
            href="/cookie-policy"
            className="text-blue-600 hover:underline font-medium"
          >
            Cookie Policy
          </a>
          .
        </p>
      </main>
        <Footer />
    </div>
  );
};

export default CookieSettings;
