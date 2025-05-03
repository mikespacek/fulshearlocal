"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Globe, MapPin, Phone, Star, ExternalLink } from "lucide-react";

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
  photos?: string[];
}

interface Category {
  _id: Id<"categories">;
  name: string;
}

// Function to generate meaningful business descriptions based on category, name, and other data
function generateBusinessDescription(
  business: Business, 
  categoryName: string | undefined
): string {
  // Start with business name and category description
  let description = `${business.name} is a ${categoryName?.toLowerCase() || 'local'} business located in Fulshear, TX.`;
  
  // Add rating info if available
  if (business.rating) {
    const ratingText = business.rating >= 4.5 ? 'highly-rated' : 
                      business.rating >= 4.0 ? 'well-rated' : 
                      business.rating >= 3.5 ? 'positively reviewed' : '';
    if (ratingText) {
      description += ` This ${ratingText} establishment has a ${business.rating.toFixed(1)}-star rating.`;
    }
  }
  
  // Add category-specific descriptions
  if (categoryName) {
    switch (categoryName) {
      case "Restaurants":
        description += ` They offer a variety of food options for Fulshear residents and visitors. Whether you're looking for a quick bite or a sit-down meal, ${business.name} provides a welcoming atmosphere for all dining needs.`;
        break;
      case "Shopping":
        description += ` They provide a selection of products to meet the shopping needs of Fulshear residents. Visitors can expect a friendly shopping experience with personalized service.`;
        break;
      case "Real Estate":
        description += ` They specialize in helping clients buy, sell, and rent properties in the Fulshear area. With knowledge of the local market, ${business.name} assists clients in finding their perfect home or investment property.`;
        break;
      case "Medical & Dental":
        description += ` They provide healthcare services to the Fulshear community with a focus on patient care and wellbeing. The professional staff is dedicated to delivering high-quality medical services.`;
        break;
      case "Beauty & Wellness":
        description += ` They offer services designed to enhance your wellbeing and appearance. The professional staff aims to provide a relaxing and rejuvenating experience for all clients.`;
        break;
      case "Financial Services":
        description += ` They provide financial expertise and services to individuals and businesses in the Fulshear area. Their professional team offers guidance on important financial decisions.`;
        break;
      case "Automotive":
        description += ` They provide vehicle-related services to keep Fulshear residents on the road. Their team of professionals is committed to quality service and customer satisfaction.`;
        break;
      case "Home Services":
        description += ` They provide essential services to maintain and improve homes in the Fulshear area. Their skilled professionals deliver reliable solutions for homeowners' needs.`;
        break;
      case "Childcare & Education":
        description += ` They are dedicated to nurturing and educating children in the Fulshear community. Their programs are designed to foster growth, learning, and development in a supportive environment.`;
        break;
      case "Religious Organizations":
        description += ` They serve the spiritual needs of the Fulshear community. They provide a welcoming place for worship, fellowship, and community service.`;
        break;
      case "Sports & Fitness":
        description += ` They offer facilities and programs to help Fulshear residents stay active and healthy. Their services promote physical fitness, wellness, and an active lifestyle.`;
        break;
      case "Recreation & Entertainment":
        description += ` They provide entertainment and recreational activities for Fulshear residents and visitors. They offer opportunities for enjoyment, relaxation, and creating memorable experiences.`;
        break;
      case "Professional Services":
        description += ` They offer specialized expertise to meet the needs of Fulshear businesses and residents. Their professional team is dedicated to delivering high-quality service.`;
        break;
      default:
        description += ` They serve the Fulshear community with dedication to quality and customer satisfaction.`;
    }
  }
  
  // Add contact encouragement
  if (business.phoneNumber || business.website) {
    description += ` Contact them ${business.phoneNumber ? 'by phone' : ''}${business.phoneNumber && business.website ? ' or ' : ''}${business.website ? 'through their website' : ''} to learn more about their services.`;
  }
  
  return description;
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

  // Get the Google My Business profile picture as the main image
  // The first photo in the array is the business profile picture from Google Places API
  const mainPhoto = business?.photos?.[0];
  
  // Format address for Google Maps link
  const formattedAddress = business?.address ? encodeURIComponent(business.address) : '';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;

  // Generate a description if none exists
  const businessDescription = business?.description || 
    (business ? generateBusinessDescription(business, category?.name) : "Local business in Fulshear, TX");

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
              {category ? (
                <Link 
                  href={`/categories/${category._id}`} 
                  className="hover:text-blue-600 transition-colors"
                >
                  {category.name}
                </Link>
              ) : "Unknown Category"}
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
                {mainPhoto ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={mainPhoto}
                      alt={business.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                      {/* Category-specific icons */}
                      {category?.name === "Real Estate" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      )}
                      {category?.name === "Restaurants" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                          <line x1="6" y1="1" x2="6" y2="4"></line>
                          <line x1="10" y1="1" x2="10" y2="4"></line>
                          <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                      )}
                      {category?.name === "Medical & Dental" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                      )}
                      {(!category || (category.name !== "Real Estate" && category.name !== "Restaurants" && category.name !== "Medical & Dental")) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{business.name}</h3>
                    <p className="text-gray-600 text-center mb-3">{category?.name || "Local Business"}</p>
                    {business.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.round(business.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{business.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 text-center mt-2">
                      No photos available from Google Places
                    </p>
                  </div>
                )}
              </div>
              
              {business.photos && business.photos.length > 1 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Photos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {business.photos.slice(1).map((photo, index) => (
                      <div 
                        key={index} 
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={photo}
                            alt={`${business.name} - Photo ${index + 2}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {businessDescription}
                </p>
                {business.hours && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Visit {business.name} during their business hours to experience their services firsthand.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 shrink-0 mt-0.5 text-gray-500" />
                  <a 
                    href={googleMapsUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 hover:underline flex items-center"
                  >
                    {business.address}
                    <ExternalLink className="h-3 w-3 ml-1 inline" />
                  </a>
                </div>
                
                {business.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 shrink-0 text-gray-500" />
                    <a 
                      href={`tel:${business.phoneNumber.replace(/\D/g,'')}`}
                      className="text-gray-700 hover:text-blue-600 hover:underline"
                    >
                      {business.phoneNumber}
                    </a>
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
              
              <div className="grid grid-cols-1 gap-3 mt-6">
                {business.website && (
                  <Button className="w-full" asChild>
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" asChild>
                  <a 
                    href={googleMapsUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </Button>
              </div>
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