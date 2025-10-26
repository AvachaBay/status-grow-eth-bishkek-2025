"use client";

import { useState } from "react";

const Partners = () => {
  const [currentSection, setCurrentSection] = useState("hero");

  const pricingPlans = [
    {
      name: "Starter",
      price: "FREE",
      tag: "FREE",
      features: [
        "3 quest campaigns per month",
        "Basic quest builder",
        "Real-time analytics",
        "Community support",
        "Approval in 24 hours",
      ],
      isFeatured: false,
    },
    {
      name: "Growth",
      price: "$99/mo",
      tag: "POPULAR",
      features: [
        "10 quest campaigns",
        "Advanced quest builder",
        "Priority support",
        "Featured on homepage",
        "Custom NFT badges",
        "Performance insights",
      ],
      isFeatured: true,
    },
    {
      name: "Scale",
      price: "$299/mo",
      tag: "ENTERPRISE",
      features: [
        "20 quest campaigns",
        "All Growth features",
        "Dedicated account manager",
        "Custom reward pools",
        "Advanced integration",
        "Co-marketing opportunities",
      ],
      isFeatured: false,
    },
  ];

  const benefits = [
    {
      icon: "🎯",
      title: "Targeted User Acquisition",
      description: "Reach engaged Web3 users actively seeking quality projects. Verified users, bot-protected.",
    },
    {
      icon: "💰",
      title: "Flexible Reward Pools",
      description: "Support with your own tokens, stablecoins, SNT, or NFTs. Build loyalty with meaningful incentives.",
    },
    {
      icon: "📊",
      title: "Real-Time Analytics",
      description: "Track completion rates, engagement, and ROI. Make data-driven optimization decisions.",
    },
    {
      icon: "🚀",
      title: "Zero Development Time",
      description: "No code required. Set up quests in minutes. Approval in 24 hours.",
    },
    {
      icon: "🤝",
      title: "Community Building",
      description: "Build deeper connections with your users. Gamification drives engagement and retention.",
    },
    {
      icon: "📈",
      title: "TVL & Growth",
      description: "Attract quality liquidity and users. Onboard participants interested in your project.",
    },
  ];

  const handlePartnerFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let emailBody = "Partnership Application:\n\n";
    emailBody += `Project: ${formData.get("projectName")}\n`;
    emailBody += `Website: ${formData.get("projectUrl")}\n`;
    emailBody += `Description: ${formData.get("projectDescription")}\n`;
    emailBody += `\nContact:\n`;
    emailBody += `Name: ${formData.get("contactName")}\n`;
    emailBody += `Email: ${formData.get("contactEmail")}\n`;
    emailBody += `Phone: ${formData.get("contactPhone") || "N/A"}\n`;
    emailBody += `Role: ${formData.get("contactRole")}\n`;
    emailBody += `\nSocial Media:\n`;
    emailBody += `Twitter: ${formData.get("twitter")} (${formData.get("twitterFollowers") || "N/A"} followers)\n`;
    emailBody += `Telegram Channel: ${formData.get("telegramChannel") || "N/A"} (${formData.get("telegramChannelFollowers") || "N/A"} subscribers)\n`;
    emailBody += `Telegram Chat: ${formData.get("telegramChat") || "N/A"} (${formData.get("telegramChatFollowers") || "N/A"} members)\n`;
    emailBody += `Discord: ${formData.get("discord") || "N/A"} (${formData.get("discordFollowers") || "N/A"} members)\n`;
    emailBody += `LinkedIn: ${formData.get("linkedin") || "N/A"} (${formData.get("linkedinFollowers") || "N/A"} followers)\n`;
    emailBody += `Mirror: ${formData.get("mirror") || "N/A"} (${formData.get("mirrorFollowers") || "N/A"} followers)\n`;
    emailBody += `Other: ${formData.get("otherSocial") || "N/A"} (${formData.get("otherFollowers") || "N/A"} followers)\n`;
    emailBody += `\nDetails:\n`;
    emailBody += `Goals: ${formData.get("questGoals")}\n`;
    emailBody += `Budget: ${formData.get("rewardBudget")}\n`;
    emailBody += `Reward Type: ${formData.get("rewardType") || "N/A"}\n`;

    const projectName = formData.get("projectName");
    const mailtoLink = `mailto:partners@statusgrow.com?subject=Partnership: ${encodeURIComponent(projectName as string)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  if (currentSection === "registration") {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8 text-center">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              ✓ Thank you! Our team will contact you within 24 hours.
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12">
            <h1 className="text-4xl font-bold text-center mb-3">Partner Registration</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-10">
              Tell us about your project in 3 minutes
            </p>

            <form onSubmit={handlePartnerFormSubmit} className="space-y-8">
              {/* Project Information */}
              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-5">📋 Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Project Name *</label>
                    <input
                      type="text"
                      name="projectName"
                      placeholder="e.g., Aave"
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Website *</label>
                    <input
                      type="url"
                      name="projectUrl"
                      placeholder="https://yourproject.com"
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <textarea
                    name="projectDescription"
                    placeholder="What does your project do?"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-5">👤 Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="contactName"
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <label className="flex items-start cursor-pointer">
                  <input type="checkbox" name="terms" required className="mt-1 mr-3 w-5 h-5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the terms and give permission to StatusGrow to contact me.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-5">Launch Your Quest Campaign</h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            StatusGrow is the best way to onboard users, build community,
            <br />
            and grow your project on Status Network.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-anchor" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Choose the plan that fits your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 border-2 rounded-2xl p-10 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  plan.isFeatured
                    ? "border-blue-500 shadow-2xl shadow-blue-500/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-full text-xs font-semibold mb-4 ${
                    plan.tag === "FREE"
                      ? "bg-green-100 text-green-600"
                      : plan.tag === "POPULAR"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {plan.tag}
                </div>
                <h3 className="text-3xl font-bold mb-3">{plan.name}</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="text-green-500 font-bold mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setCurrentSection("registration")}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.isFeatured
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      : "bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {plan.name === "Scale" ? "Contact Us" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Launch on StatusGrow?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Maximize user engagement and project growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 className="text-lg font-semibold mb-2">
                  {benefit.icon} {benefit.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Grow?</h2>
          <p className="text-xl mb-10 opacity-95">Join top Web3 projects launching quests on StatusGrow</p>
          <button
            onClick={() => setCurrentSection("registration")}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200"
          >
            Start Your Application
          </button>
        </div>
      </section>
    </>
  );
};

export default Partners;
