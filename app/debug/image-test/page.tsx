"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

export default function ImageTestPage() {
  const [imageStatuses, setImageStatuses] = useState<Record<string, {loaded: boolean, error?: string}>>({});
  const [baseUrl, setBaseUrl] = useState<string>("");
  
  // List of image paths to test
  const imagePaths = [
    "/category-images/restaurants.jpg",
    "/category-images/shopping.jpg",
    "/category-images/medical.jpg",
    "/category-images/beauty.jpg",
    "/category-images/financial.jpg",
    "/category-images/real-estate.jpg",
    "/category-images/automotive.jpg",
    "/category-images/professional.jpg",
    "/category-images/education.jpg",
    "/category-images/religious.jpg",
    "/category-images/fitness.jpg",
    "/category-images/entertainment.jpg",
    "/category-images/home-services.jpg",
    "/category-images/default.jpg",
  ];

  useEffect(() => {
    // Set the base URL once the component mounts (client-side only)
    setBaseUrl(window.location.origin);
    
    // Test each image
    imagePaths.forEach(path => {
      const img = new Image();
      
      img.onload = () => {
        setImageStatuses(prev => ({
          ...prev,
          [path]: { loaded: true }
        }));
      };
      
      img.onerror = (e) => {
        setImageStatuses(prev => ({
          ...prev,
          [path]: { loaded: false, error: "Failed to load" }
        }));
      };
      
      img.src = path;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/debug" className="text-blue-600 hover:underline mb-4 inline-block">
              &larr; Back to Debug
            </Link>
            <h1 className="text-3xl font-bold mb-2">Image Test Page</h1>
            <p className="text-gray-600">Testing which images are available on this deployment</p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Server Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium">Environment</p>
                <p className="text-sm text-gray-700">{process.env.NODE_ENV || "unknown"}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium">Base URL</p>
                <p className="text-sm text-gray-700 break-all">{baseUrl}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Image Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePaths.map((path, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="aspect-square relative bg-gray-100">
                    <img 
                      src={path} 
                      alt={`Test image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm mb-1 truncate">{path}</p>
                    <div className="flex items-center">
                      {imageStatuses[path] ? (
                        imageStatuses[path].loaded ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Loaded ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Failed ✗
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Testing...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Direct Image Links</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ul className="space-y-2">
                {imagePaths.map((path, index) => (
                  <li key={index}>
                    <a 
                      href={path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {path}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 