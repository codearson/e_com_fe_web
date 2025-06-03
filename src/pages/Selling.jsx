import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Selling = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">
          How to Sell on E-Com
        </h1>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              <span className="text-[#1E90FF] font-bold mr-2">1.</span>
              Create Your Account
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sign up for a free E-Com account. You'll need to verify your email and complete your profile
              with accurate information to start selling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              <span className="text-[#1E90FF] font-bold mr-2">2.</span>
              List Your Items
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Click the "Sell" button and follow these steps:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Take clear photos of your item</li>
              <li>Write an accurate description</li>
              <li>Set a competitive price</li>
              <li>Choose the right category</li>
              <li>Add item condition and measurements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              <span className="text-[#1E90FF] font-bold mr-2">3.</span>
              Manage Your Sales
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Once your items are listed:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Respond to buyer questions promptly</li>
              <li>Keep your items' availability updated</li>
              <li>Handle orders professionally</li>
              <li>Ship items within the promised timeframe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              <span className="text-[#1E90FF] font-bold mr-2">4.</span>
              Get Paid
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Once the buyer receives and accepts the item, payment will be released to your account.
              You can withdraw your earnings through our secure payment system.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Start Selling?</h3>
          <a
            href="/sell"
            className="inline-block px-8 py-4 bg-[#1E90FF] text-white font-semibold rounded-lg hover:bg-[#1876cc] transition"
          >
            Start Selling Now
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Selling;
