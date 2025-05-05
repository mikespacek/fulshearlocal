"use client";

export function Footer() {
  return (
    <footer className="bg-gray-50 py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-2xl font-semibold">Fulshear Local</h2>
          <p className="text-gray-600 max-w-2xl">
            Connecting the Fulshear community with local businesses and services.
          </p>
          <a 
            href="mailto:hello@fulshearlocal.com"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            hello@fulshearlocal.com
          </a>
          
          <div className="w-full max-w-2xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-gray-500 text-sm">
              <p>© 2025 Fulshear Local. All rights reserved.</p>
              <p className="flex items-center mt-2 md:mt-0">
                Made with <span className="text-red-500 mx-1">❤</span> by <span className="ml-1 text-gray-600 font-black">CALLIE BRAND</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 