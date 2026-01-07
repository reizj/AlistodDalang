import Navbar from "../components/navbar";
import React from "react";
import HeroSection from "../components/hero";
import HowItWorks from "../components/howitworks";
import Features from "../components/features";
import Developers from "../components/developersection";
import Footer from "../components/footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white">
      {/* Navbar on top */}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="bg-transparent">
        <HeroSection />
      </section>

      {/* Features */}
      <section id="features" className="bg-transparent">
        <Features />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-transparent">
        <HowItWorks />
      </section>

      {/* Developers (Contact) */}
      <section id="contact" className="bg-transparent">
        <Developers />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
