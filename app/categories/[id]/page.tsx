"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { BusinessCard } from "@/components/business-card";
import { BusinessCardSkeleton } from "@/components/business-card-skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { use } from "react";

interface Business {
  _id: Id<"businesses">;
  name: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  categoryId: Id<"categories">;
}

interface Category {
  _id: Id<"categories">;
  name: string;
  imageUrl?: string;
  description?: string;
  icon?: string;
}

type PageParams = { id: string };

export default function CategoryPage({ params }: { params: PageParams }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use React.use to unwrap params with proper typing
  const resolvedParams = use(params as any) as PageParams;
  const categoryId = resolvedParams.id as Id<"categories">;

  // Fetch businesses for this category
  const businesses = useQuery(api.businesses.getByCategory, { 
    categoryId: categoryId 
  }) as Business[] | undefined;

  // Fetch the category details
  const categories = useQuery(api.categories.getAll) as Category[] | undefined;
  const category = categories?.find(c => c._id === categoryId);

  // Filter businesses by search term if provided
  const filteredBusinesses = searchTerm && businesses 
    ? businesses.filter(business => 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : businesses;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link href="/" className="flex items-center text-sm mb-8 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to all categories
          </Link>
          
          {/* Category Header */}
          <div className="mb-12">
            {category ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-5xl">{category.icon || "📷"}</span>
                    </div>
                  )}
                </div>
                <div className="md:col-span-3">
                  <h1 className="text-3xl font-bold mb-3">{category?.name || "Loading..."}</h1>
                  <p className="text-muted-foreground text-lg mb-6">
                    {category?.description || `Browse all ${category?.name} in Fulshear, TX`}
                  </p>
                  <div className="w-full max-w-md">
                    <SearchBar 
                      onSearch={setSearchTerm} 
                      placeholder={`Search ${category?.name || 'businesses'}...`} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            )}
          </div>
          
          {/* Businesses Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                {searchTerm ? `Search Results: "${searchTerm}"` : `All ${category?.name || 'Businesses'}`}
              </h2>
              <p className="text-muted-foreground">
                {filteredBusinesses ? 
                  `Showing ${filteredBusinesses.length} ${filteredBusinesses.length === 1 ? 'business' : 'businesses'}` : 
                  'Loading businesses...'}
              </p>
            </div>
            
            {!filteredBusinesses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-medium mb-2">No businesses found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 
                    'Try adjusting your search term' : 
                    `There are no ${category?.name} businesses in our directory yet`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business._id}
                    id={business._id}
                    name={business.name}
                    address={business.address}
                    rating={business.rating}
                    phoneNumber={business.phoneNumber}
                    website={business.website}
                    category={category?.name || "Unknown"}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Fulshear Local. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 