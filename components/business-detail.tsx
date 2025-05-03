"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleMap } from "@/components/google-map";
import Link from "next/link";
import { ArrowLeft, Clock, Globe, MapPin, Phone, Star } from "lucide-react";

interface BusinessDetailProps {
  id: string;
}

interface Business {
  _id: Id<"businesses">;
  name: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  hours?: string[];
  categoryId: Id<"categories">;
  description?: string;
}

interface Category {
  _id: Id<"categories">;
  name: string;
}

export function BusinessDetail({ id }: BusinessDetailProps) {
  // Convert string ID to Convex ID type
  const businessId = id as Id<"businesses">;
  
  // Fetch business details
  const business = useQuery(api.businesses.getById, { id: businessId }) as Business | undefined;
  
  // Fetch category data
  const categories = useQuery(api.categories.getAll) as Category[] | undefined;
  const category = categories?.find(
    (cat) => business && cat._id === business.categoryId
  );

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <Link href="/" className="flex items-center text-sm mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
            </Link>
            
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2 space-y-6">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-6 w-1/2" />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link href="/" className="flex items-center text-sm mb-8 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
          <div className="flex items-center mb-8">
            <span className="text-sm text-muted-foreground mr-3">
              {category?.name || "Unknown Category"}
            </span>
            {business.rating && (
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-yellow-700">{business.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="aspect-video bg-gray-100 rounded-lg mb-8 overflow-hidden">
                {business.latitude && business.longitude ? (
                  <GoogleMap
                    center={{ lat: business.latitude, lng: business.longitude }}
                    markers={[
                      {
                        position: { lat: business.latitude, lng: business.longitude },
                        title: business.name,
                        id: business._id,
                      },
                    ]}
                    zoom={16}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Map location not available</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-muted-foreground">
                  {business.description || "Local business in Fulshear, TX"}
                </p>
              </div>
            </div>
            
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 shrink-0 mt-0.5 text-gray-500" />
                  <span className="text-gray-700">{business.address}</span>
                </div>
                
                {business.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 shrink-0 text-gray-500" />
                    <span className="text-gray-700">{business.phoneNumber}</span>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 shrink-0 text-gray-500" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {new URL(business.website).hostname}
                    </a>
                  </div>
                )}
                
                {business.hours && business.hours.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center mb-3">
                      <Clock className="h-5 w-5 mr-3 shrink-0 text-gray-500" />
                      <span className="font-medium">Hours</span>
                    </div>
                    <ul className="space-y-1 ml-8 text-sm text-gray-700">
                      {business.hours.map((hour: string, index: number) => (
                        <li key={index}>{hour}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {business.website && (
                <Button className="w-full mt-4" asChild>
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Fulshear Local. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 