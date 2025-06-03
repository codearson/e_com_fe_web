import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Buying = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">
          How to Buy on E-Com
        </h1>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-[#1E90FF] font-bold text-2xl">1.</div>
              <h2 className="text-2xl font-semibold">Browse & Search</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-8 mt-2 space-y-1">
              <li>Use the search bar for specific items</li>
              <li>Browse categories to explore products</li>
              <li>Filter by price, condition, and location</li>
              <li>Save your favorite items</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-[#1E90FF] font-bold text-2xl">2.</div>
              <h2 className="text-2xl font-semibold">Check Item Details</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-8 mt-2 space-y-1">
              <li>Review all item photos carefully</li>
              <li>Read the full item description</li>
              <li>Check the seller's ratings and reviews</li>
              <li>Verify item measurements and condition</li>
              <li>Ask the seller questions if needed</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-[#1E90FF] font-bold text-2xl">3.</div>
              <h2 className="text-2xl font-semibold">Make a Purchase</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-8 mt-2 space-y-1">
              <li>Add items to your cart</li>
              <li>Choose your shipping method</li>
              <li>Select your payment option</li>
              <li>Review your order details</li>
              <li>Confirm your purchase</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-[#1E90FF] font-bold text-2xl">4.</div>
              <h2 className="text-2xl font-semibold">Receive & Review</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-8 mt-2 space-y-1">
              <li>Track your order status</li>
              <li>Inspect item upon delivery</li>
              <li>Confirm receipt in the app</li>
              <li>Leave feedback for the seller</li>
              <li>Contact support if needed</li>
            </ul>
          </section>
        </div>

        <section className="mt-16">
          <h3 className="text-2xl font-semibold mb-2 text-gray-900">Buyer Protection</h3>
          <p className="text-gray-700">
            Every purchase on E-Com is covered by our Buyer Protection program.
            If your item doesn't arrive or isn't as described, we'll help you get your money back.
          </p>
        </section>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Start Shopping?</h3>
          <a
            href="#"
            className="inline-block px-8 py-4 bg-[#1E90FF] text-white font-semibold rounded-lg hover:bg-[#1876cc] transition"
          >
            Browse Products
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Buying;
