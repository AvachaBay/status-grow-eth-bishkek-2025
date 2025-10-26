"use client";

import FAQ from "~~/components/statusgrow/FAQ";
import Features from "~~/components/statusgrow/Features";
import Footer from "~~/components/statusgrow/Footer";
import Header from "~~/components/statusgrow/Header";
import Hero from "~~/components/statusgrow/Hero";
import HowItWorks from "~~/components/statusgrow/HowItWorks";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;
