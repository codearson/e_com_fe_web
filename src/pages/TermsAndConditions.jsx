import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
    <main className="flex-grow px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-8">
            Terms & Conditions
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            By accessing this website, you agree to be bound by these terms and
            conditions of use, all applicable laws, and regulations. Please review them carefully.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">User Conduct</h2>
            <ul className="space-y-3 text-gray-700 text-base pl-1">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">✔</span>
                Do not misuse the service or attempt to disrupt it.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">✔</span>
                Respect copyright and intellectual property rights.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">✔</span>
                Do not submit false or misleading information.
              </li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Liability</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are not liable for any damages resulting from your use of the website,
              including but not limited to data loss, service interruptions, or third-party actions.
            </p>
          </section>
        </div>
      </main>
        <Footer />
    </div>
  );
};

export default TermsAndConditions;
