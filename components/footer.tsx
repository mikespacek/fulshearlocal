"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Fulshear Local</h3>
            <p className="text-gray-400 text-sm mb-4">
              Discover the best local businesses in Fulshear, Texas. Your comprehensive guide to shops, restaurants, and services.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Map
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Fulshear, TX 77441</li>
              <li>
                <a 
                  href="mailto:info@fulshearlocal.com" 
                  className="hover:text-white transition-colors"
                >
                  info@fulshearlocal.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          <p>© {currentYear} Fulshear Local. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 