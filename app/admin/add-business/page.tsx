"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Check, MapPin, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "../auth-provider";

// Define the type for a new business
interface NewBusiness {
  name: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  categoryId: Id<"categories"> | null;
  rating?: number;
  description?: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

export default function AddBusinessPage() {
  const { isAuthenticated } = useAuth();
  // Initialize business state
  const [business, setBusiness] = useState<NewBusiness>({
    name: "",
    address: "",
    phoneNumber: "",
    website: "",
    categoryId: null,
    rating: 0,
    description: "",
    latitude: 29.6936, // Default to Fulshear coordinates
    longitude: -95.8883,
    placeId: "" // Will be auto-generated
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch categories for dropdown
  const categories = useQuery(api.categories.getAll);
  
  // Prepare mutation to add a business
  const addBusiness = useMutation(api.businesses.add);
  
  // Function to update business fields
  const updateField = (field: keyof NewBusiness, value: any) => {
    setBusiness({
      ...business,
      [field]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business.name || !business.address || !business.categoryId) {
      setError("Name, address, and category are required");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a unique place ID if not provided
      const placeId = business.placeId || `manual_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create the business object to send to Convex
      const businessData = {
        name: business.name,
        address: business.address,
        phoneNumber: business.phoneNumber || undefined,
        website: business.website || undefined,
        categoryId: business.categoryId,
        rating: business.rating && business.rating > 0 ? business.rating : undefined,
        description: business.description || undefined,
        latitude: business.latitude,
        longitude: business.longitude,
        placeId: placeId,
        lastUpdated: Date.now(),
      };
      
      // Add the business
      const result = await addBusiness({ business: businessData });
      
      if (result.success) {
        setSuccess(true);
        // Reset form
        setBusiness({
          name: "",
          address: "",
          phoneNumber: "",
          website: "",
          categoryId: null,
          rating: 0,
          description: "",
          latitude: 29.6936,
          longitude: -95.8883,
          placeId: ""
        });
      } else {
        setError("Failed to add business");
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center text-sm mb-8 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Add Business</h1>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="add-business-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={business.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("name", e.target.value)}
                    placeholder="Enter business name"
                    required
                  />
                </div>
                
                {/* Business Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select 
                    value={business.categoryId?.toString() || ""} 
                    onValueChange={(value) => updateField("categoryId", value)}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="address"
                    value={business.address}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("address", e.target.value)}
                    placeholder="Enter full address"
                    required
                  />
                </div>
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={business.phoneNumber || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("phoneNumber", e.target.value)}
                    placeholder="(555) 555-5555"
                  />
                </div>
                
                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={business.website || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("website", e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                
                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    value={business.rating || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("rating", parseFloat(e.target.value) || 0)}
                    placeholder="4.5"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={business.description || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("description", e.target.value)}
                    placeholder="Describe the business"
                    rows={3}
                  />
                </div>
                
                {/* Location */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <h3 className="text-sm font-medium">Location Coordinates</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={business.latitude}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("latitude", parseFloat(e.target.value) || 0)}
                        placeholder="29.6936"
                        type="number"
                        step="0.0001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={business.longitude}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("longitude", parseFloat(e.target.value) || 0)}
                        placeholder="-95.8883"
                        type="number"
                        step="0.0001"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Default coordinates are set to Fulshear, TX. Adjust as needed.
                  </p>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Success</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Business added successfully
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit"
                form="add-business-form"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Business"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
} 