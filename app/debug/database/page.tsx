"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DatabaseDebugPage() {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState<string>("");
  
  // Fetch categories from Convex
  const categories = useQuery(api.categories.getAll);
  
  // Mutation to update a category
  const updateCategory = useMutation(api.categories.updateCategory);
  
  useEffect(() => {
    // Set the base URL once the component mounts
    setBaseUrl(window.location.origin);
  }, []);
  
  // Function to fix image URLs
  const fixImageUrls = async () => {
    if (!categories || !baseUrl) return;
    
    setUpdatingStatus("Updating category images...");
    let updated = 0;
    
    for (const category of categories) {
      if (category.imageUrl && category.imageUrl.startsWith('/category-images/')) {
        // Create absolute URL
        const absoluteUrl = `${baseUrl}${category.imageUrl}`;
        
        try {
          // Update the category
          await updateCategory({
            id: category._id,
            data: { imageUrl: absoluteUrl }
          });
          updated++;
          setUpdatingStatus(`Updated ${updated} of ${categories.length} categories...`);
        } catch (error) {
          console.error("Error updating category:", error);
          setUpdatingStatus(`Error updating category: ${category.name}`);
        }
      }
    }
    
    setUpdatingStatus(`Completed! Updated ${updated} categories.`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/debug" className="text-blue-600 hover:underline mb-4 inline-block">
              &larr; Back to Debug
            </Link>
            <h1 className="text-3xl font-bold mb-2">Database Debug</h1>
            <p className="text-gray-600">Inspect and fix database issues</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Tools</h2>
              
              <button
                onClick={fixImageUrls}
                disabled={!categories || updatingStatus.includes("Updating")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Fix Image URLs
              </button>
              
              {updatingStatus && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm">{updatingStatus}</p>
                </div>
              )}
            </div>
            
            <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              
              {!categories ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="text-gray-500">No categories found</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category._id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        </div>
                        <div className="text-xs text-gray-500">ID: {String(category._id).split('_').pop()}</div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Image URL:</p>
                        <div className="p-2 bg-gray-50 rounded text-xs overflow-auto break-all">
                          {category.imageUrl || "No image"}
                        </div>
                      </div>
                      
                      {category.imageUrl && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div>
                            <img 
                              src={category.imageUrl} 
                              alt={category.name} 
                              className="w-full h-20 object-cover rounded-md" 
                              onError={(e) => {
                                e.currentTarget.src = "/category-images/default.jpg";
                              }}
                            />
                          </div>
                          {category.imageUrl.startsWith('/') && (
                            <div>
                              <img 
                                src={`${baseUrl}${category.imageUrl}`} 
                                alt={category.name} 
                                className="w-full h-20 object-cover rounded-md" 
                                onError={(e) => {
                                  e.currentTarget.src = "/category-images/default.jpg";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 