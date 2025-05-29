import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="text-center py-8 px-4">
        <h1 className="text-5xl font-bold mb-4">Our Mission</h1>
        <p className="text-2xl text-justify max-w-4xl mx-auto">
          At E-Com, we want second-hand clothes to be people’s first choice.
          Buying used helps save money, reduces waste, and lets you find cool,
          unique items. We're here to support a greener way to shop.
        </p>
      </section>
      <div className="w-full">
        <img
          src="https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="About Us"
          className="w-full h-auto"
        />
      </div>

      <section className="text-center py-12 px-4">
        <h1 className="text-5xl font-bold mb-8">
          1 Simple Idea Now Unites a Community of Millions
        </h1>
        <div className="grid  grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl font-semibold mb-3 flex items-center gap-3 justify-left">
              <img
                src="https://cdn-icons-gif.flaticon.com/15578/15578616.gif"
                alt="Who We Are Icon"
                className="w-20 h-20 object-contain"
              />
              Who We Are
            </h2>
            <p className="text-2xl text-justify">
              We are a diverse team with a shared passion for making second-hand
              shopping simple, enjoyable, and accessible. United by a common
              goal, we work together to create a better and more sustainable way
              to shop.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-3 flex items-center gap-3 justify-left">
              <img
                src="https://cdn-icons-gif.flaticon.com/8722/8722562.gif"
                alt="How We Started Icon"
                className="w-20 h-20 object-contain"
              />
              How We Started
            </h2>
            <p className="text-2xl text-justify">
              E-Com began in 2025 in Sri Lanka when Milda and Justas had a
              simple idea: help people exchange clothes. What started small has
              now grown into a big community across Europe.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-3 flex items-center gap-3 justify-right">
              <img
                src="https://cdn-icons-gif.flaticon.com/15589/15589212.gif"
                alt="How We Started Icon"
                className="w-20 h-20 object-contain"
              />
              Be Part of It
            </h2>
            <p className="text-2xl text-justify">
              Want to clean out your closet or find something new to wear? Join
              E-Com and help make fashion more eco-friendly.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-3xl font-semibold">
              Buy or Sell Your Product With Us
            </h3>
            <a
              href="/"
              className="px-6 py-3 bg-[#1E90FF] text-white font-semibold rounded hover:bg-[#1876cc] transition"
            >
              Go to Shop
            </a>
          </div>
        </div>
      </section>
      <section className="px-4 py-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center">
          Investors & Leadership
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <img
            src="https://images.pexels.com/photos/12437056/pexels-photo-12437056.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Investor"
            className="w-full h-auto rounded-md shadow-md"
          />
          <img
            src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="CEO"
            className="w-full h-auto rounded-md shadow-md"
          />
          <img
            src="https://images.pexels.com/photos/8837549/pexels-photo-8837549.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="CEO 2"
            className="w-full h-auto rounded-md shadow-md"
          />
          <img
            src="https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="CEO 3"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default AboutUs;
