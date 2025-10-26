"use client";

import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "How is StatusGrow completely free?",
      answer:
        "StatusGrow is built on Status Network, a gasless Layer 2. The network subsidizes transaction costs through yield, so users never pay gas fees.",
    },
    {
      question: "What kind of rewards can I earn?",
      answer:
        "You can earn SNT tokens, partner tokens, NFT badges, Soulbound Tokens for reputation, and whitelist spots.",
    },
    {
      question: "How do I get started?",
      answer: "Just connect your MetaMask or Status Wallet. No signup, no email, no KYC. Start earning immediately.",
    },
    {
      question: "Is StatusGrow available on mobile?",
      answer: "Yes! Integrated directly into Status App on iOS and Android, plus desktop web.",
    },
    {
      question: "How do you prevent bots and farmers?",
      answer: "We use RLN technology and reputation scoring. Only genuine, active users get rewarded.",
    },
    {
      question: "Can my project launch quests?",
      answer: "Yes! We offer free quest listings for partners with analytics and co-marketing support.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => (prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]));
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to know</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                openItems.includes(index)
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400"
                  : "hover:border-blue-300 dark:hover:border-blue-600"
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                <span className="text-2xl text-gray-400 dark:text-gray-500">
                  {openItems.includes(index) ? "−" : "+"}
                </span>
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
