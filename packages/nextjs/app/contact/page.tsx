"use client";

import Contact from "~~/components/statusgrow/Contact";
import Footer from "~~/components/statusgrow/Footer";
import Header from "~~/components/statusgrow/Header";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <Contact />
      <Footer />
    </div>
  );
};

export default ContactPage;
