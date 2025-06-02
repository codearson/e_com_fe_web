import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const OurPlatform = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Our Platform – Empowering Buyers to Become Sellers</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Who Are We?</h2>
          <p>
            We are <strong>E-Com</strong>, a technology driven online marketplace connecting buyers and sellers across diverse categories from fashion to electronics and everyday essentials.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">What Is E-Com?</h2>
          <p>
            <strong>E-Com</strong> is a user-friendly marketplace where any registered buyer can become a seller by clicking the <strong>“Sell”</strong> button. We provide the tools and protections for smooth transactions but do not sell items ourselves.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Seamless buying & selling via one account</li>
            <li>Secure transactions with payment protection</li>
            <li>Easy item listings with photo and description upload</li>
            <li>Optional visibility boosts for better reach</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Who Can Use the Platform?</h2>
          <p>
            Individuals aged 18 or above with verified accounts, small businesses, and sellers in compliance with local laws. Minors may use the platform under parental supervision.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">What Can You Sell?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Fashion items and accessories</li>
            <li>Gadgets and electronics</li>
            <li>Homeware and decor</li>
            <li>PetCare accessories</li>
            <li>New, unused products</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Prohibited Items</h2>
          <ul className="list-disc list-inside space-y-1 text-red-600">
            <li>Counterfeit or illegal items</li>
            <li>Used hygiene products or medications</li>
            <li>Items that conflict with the platform’s values or laws</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Buyer Protection</h2>
          <p>
            Buyers using the secure checkout are protected. We strongly recommend completing all transactions within the platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Feedback & Disputes</h2>
          <p>
            Users can leave and reply to feedback, report issues, and rely on our team for mediation. Feedback helps maintain a trusted environment for all.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Fair Use & Compliance</h2>
          <p>
            Sellers must act in accordance with applicable laws and platform rules. Misleading, aggressive, or dishonest practices are strictly prohibited.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default OurPlatform;
