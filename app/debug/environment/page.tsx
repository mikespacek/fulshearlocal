"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

export default function EnvironmentPage() {
  const [envInfo, setEnvInfo] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Collect environment information
    const info: Record<string, string> = {};
    
    // Next.js environment
    info["NODE_ENV"] = process.env.NODE_ENV || "unknown";
    info["NEXT_PUBLIC_CONVEX_URL"] = process.env.NEXT_PUBLIC_CONVEX_URL || "not defined";
    info["NEXT_PUBLIC_VERCEL_URL"] = process.env.NEXT_PUBLIC_VERCEL_URL || "not defined";
    
    // Browser environment
    if (typeof window !== 'undefined') {
      info["Window Location"] = window.location.href;
      info["Base URL"] = window.location.origin;
      info["User Agent"] = window.navigator.userAgent;
      info["Screen Size"] = `${window.screen.width}x${window.screen.height}`;
      info["Window Size"] = `${window.innerWidth}x${window.innerHeight}`;
      info["Device Pixel Ratio"] = window.devicePixelRatio.toString();
      info["Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    
    setEnvInfo(info);
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
            <h1 className="text-3xl font-bold mb-2">Environment Information</h1>
            <p className="text-gray-600">Details about the current server and client environment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
              <div className="space-y-4">
                {["NODE_ENV", "NEXT_PUBLIC_CONVEX_URL", "NEXT_PUBLIC_VERCEL_URL"].map((key) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">{key}</p>
                    <p className="text-xs bg-gray-100 p-2 rounded overflow-auto break-all">
                      {envInfo[key] || "Loading..."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
              <div className="space-y-4">
                {["Base URL", "Window Location", "User Agent", "Screen Size", "Window Size", "Device Pixel Ratio", "Timezone"].map((key) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">{key}</p>
                    <p className="text-xs bg-gray-100 p-2 rounded overflow-auto break-all">
                      {envInfo[key] || "Loading..."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">All Environment Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs overflow-auto whitespace-pre-wrap break-all">
                {JSON.stringify(envInfo, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 