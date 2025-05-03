"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { GoogleMap } from "@/components/google-map";
import Link from "next/link";

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  
  // Fulshear, TX coordinates as the default center
  const [mapCenter, setMapCenter] = useState({ lat: 29.6936, lng: -95.8883 });
  
  // Fetch businesses based on search or get all
  const searchResults = useQuery(api.businesses.search, { searchTerm });
  const allBusinesses = useQuery(api.businesses.getAll);
  
  // Use search results if search term exists, otherwise use all businesses
  const businesses = searchTerm ? searchResults : allBusinesses;

  // Create markers for the map from businesses
  const markers = businesses?.map((business) => ({
    position: { lat: business.latitude, lng: business.longitude },
    title: business.name,
    id: business._id,
  })) || [];

  // When a business is selected, update the center of the map
  useEffect(() => {
    if (selectedBusinessId && businesses) {
      const selectedBusiness = businesses.find(
        (business) => business._id === selectedBusinessId
      );
      if (selectedBusiness) {
        setMapCenter({
          lat: selectedBusiness.latitude,
          lng: selectedBusiness.longitude,
        });
      }
    }
  }, [selectedBusinessId, businesses]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
            Map View
          </h1>
          
          <div className="mb-6">
            <SearchBar 
              onSearch={setSearchTerm} 
              placeholder="Search businesses on map..." 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business listing */}
            <div className="md:col-span-1 order-2 md:order-1">
              <div className="bg-white rounded-lg shadow-md p-4 h-[70vh] md:h-[calc(100vh-220px)] overflow-auto">
                <h2 className="text-xl font-semibold mb-4">
                  {businesses ? `Businesses (${businesses.length})` : 'Loading...'}
                </h2>
                
                {businesses?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No businesses found</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {businesses?.map((business) => (
                      <li 
                        key={business._id} 
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedBusinessId === business._id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'border hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedBusinessId(business._id)}
                      >
                        <h3 className="font-medium">{business.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{business.address}</p>
                        <Link 
                          href={`/business/${business._id}`} 
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View details
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Map section */}
            <div className="md:col-span-2 order-1 md:order-2">
              <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden h-[50vh] md:h-[calc(100vh-220px)]">
                <GoogleMap
                  center={mapCenter}
                  markers={markers}
                  onMarkerClick={(id) => setSelectedBusinessId(id)}
                  zoom={14}
                  className="w-full h-full"
                />
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