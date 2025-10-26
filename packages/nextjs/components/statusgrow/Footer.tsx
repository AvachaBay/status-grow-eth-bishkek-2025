"use client";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-3">&copy; 2025 StatusGrow. Built for Web3 with ❤️</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Quest to Grow, Earn for Real</p>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            title="Twitter"
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            𝕏
          </a>
          <a
            href="#"
            title="Discord"
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            💬
          </a>
          <a
            href="#"
            title="Telegram"
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            ✈️
          </a>
          <a
            href="#"
            title="GitHub"
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            📝
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
