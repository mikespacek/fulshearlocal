"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { CategoryImage } from "@/components/category-image";

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  
  const categoryImages = [
    "/category-images/restaurants.jpg",
    "/category-images/shopping.jpg",
    "/category-images/medical.jpg",
    "/category-images/beauty.jpg",
    "/category-images/default.jpg",
  ];
  
  useEffect(() => {
    // Collect environment variables
    const vars: Record<string, string> = {};
    
    // Add Next.js public env vars
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      vars["NEXT_PUBLIC_VERCEL_URL"] = process.env.NEXT_PUBLIC_VERCEL_URL;
    }
    
    if (process.env.NEXT_PUBLIC_CONVEX_URL) {
      vars["NEXT_PUBLIC_CONVEX_URL"] = process.env.NEXT_PUBLIC_CONVEX_URL;
    }
    
    vars["NODE_ENV"] = process.env.NODE_ENV || "unknown";
    vars["Base URL"] = window.location.origin;
    
    setEnvVars(vars);
  }, []);
  
  // Test image loading
  const testImageLoad = (src: string) => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(prev => ({ ...prev, [src]: true }));
    };
    img.onerror = () => {
      setImageLoaded(prev => ({ ...prev, [src]: false }));
    };
    img.src = src;
  };
  
  useEffect(() => {
    categoryImages.forEach(src => {
      testImageLoad(src);
    });
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(envVars, null, 2)}
              </pre>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Image Loading Test</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryImages.map((src, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="text-sm mb-2 truncate">{src}</p>
                  <div className="aspect-square relative mb-2 bg-gray-200">
                    <img 
                      src={src} 
                      alt={`Test ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className={`text-sm font-medium ${
                    imageLoaded[src] === undefined ? 'text-gray-500' :
                    imageLoaded[src] ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {imageLoaded[src] === undefined ? 'Testing...' :
                     imageLoaded[src] ? 'Loaded ✓' : 'Failed ✗'}
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">CategoryImage Component Test</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryImages.map((src, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="text-sm mb-2 truncate">{src}</p>
                  <div className="aspect-square relative mb-2 bg-gray-200">
                    <CategoryImage
                      imageUrl={src}
                      altText={`Test ${index + 1}`}
                      fill
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 