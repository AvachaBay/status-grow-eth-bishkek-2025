"use client";

import Footer from "~~/components/statusgrow/Footer";
import Header from "~~/components/statusgrow/Header";
import Partners from "~~/components/statusgrow/Partners";

const PartnersPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <Partners />
      <Footer />
    </div>
  );
};

export default PartnersPage;
