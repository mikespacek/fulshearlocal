"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";

export default function DebugPage() {
  const debugTools = [
    {
      title: "Image Test",
      description: "Test which images are loading properly on the current deployment",
      path: "/debug/image-test",
      icon: "🖼️"
    },
    {
      title: "Database Debug",
      description: "Inspect and fix issues with the Convex database",
      path: "/debug/database",
      icon: "🗄️"
    },
    {
      title: "Environment Info",
      description: "View environment variables and server information",
      path: "/debug/environment",
      icon: "🔧"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
              &larr; Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Debug Tools</h1>
            <p className="text-gray-600">
              Various tools to help diagnose and fix issues with the application.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {debugTools.map((tool, index) => (
              <Link 
                key={index} 
                href={tool.path}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{tool.icon}</span>
                  <h2 className="text-xl font-semibold">{tool.title}</h2>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 