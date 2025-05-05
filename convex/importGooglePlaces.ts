import { action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

interface BusinessData {
  _id: Id<"businesses">;
  _creationTime: number;
  name: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  categoryId: Id<"categories">;
  hours?: string[];
  latitude: number;
  longitude: number;
  placeId: string;
  description?: string;
  lastUpdated: number;
  photos?: string[];
}

interface ImportResults {
  success: boolean;
  message: string;
  results: {
    successful: number;
    skipped: number;
    failed: number;
    totalProcessed: number;
    deleteMode: string;
    lastImportDate: string;
  };
}

// Action to fetch data from Google Places API and import to database
export const importFulshearBusinesses = action({
  args: {
    googleApiKey: v.string(),
    deleteExisting: v.optional(v.boolean()),
    daysToLookBack: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<ImportResults> => {
    const googleApiKey = args.googleApiKey;
    const deleteExisting = args.deleteExisting ?? false;
    const daysToLookBack = args.daysToLookBack ?? 30; // Default to 30 days
    
    try {
      // STEP 1: If requested, delete existing businesses. Otherwise, keep them
      let deletedCount = 0;
      
      if (deleteExisting) {
        // Get all businesses
        const businesses = await ctx.runQuery(api.businesses.getAll);
        
        // Delete them one by one
        for (const business of businesses) {
          await ctx.runMutation(api.businesses.deleteById, { id: business._id });
          deletedCount++;
        }
        
        console.log(`Database purged: Deleted ${deletedCount} businesses`);
      } else {
        console.log("Keeping existing businesses");
      }
      
      // STEP 2: Get existing businesses and their place IDs to avoid duplicates
      const existingBusinesses: BusinessData[] = await ctx.runQuery(api.businesses.getAll);
      const existingPlaceIds = new Set(existingBusinesses.map((b: BusinessData) => b.placeId));
      
      // Also track the last import date (from existing businesses)
      const lastImportTimestamp: number = existingBusinesses.length > 0 
        ? Math.max(...existingBusinesses.map((b: BusinessData) => b.lastUpdated ?? 0))
        : 0;
      
      const lastImportDate: Date = new Date(lastImportTimestamp);
      console.log(`Last import date: ${lastImportDate.toISOString()}`);
      
      // STEP 3: Get categories for mapping
      const categories = await ctx.runQuery(api.categories.getAll);
      const categoryMap = new Map();
      
      for (const category of categories) {
        categoryMap.set(category.name, category._id);
      }
      
      // STEP 4: Search for Fulshear businesses using Google Places API
      const results = {
        successful: 0,
        skipped: 0,
        failed: 0,
        totalProcessed: 0,
      };
      
      // Array of search terms to cover different business types in Fulshear
      const searchQueries = [
        "restaurants in Fulshear TX",
        "shops in Fulshear TX",
        "medical in Fulshear TX",
        "dental in Fulshear TX",
        "real estate in Fulshear TX",
        "financial services in Fulshear TX",
        "beauty salon in Fulshear TX",
        "automotive in Fulshear TX",
        "grocery in Fulshear TX"
      ];
      
      // Category mapping function - map Google place types to our categories
      const mapToCategory = (types: string[]) => {
        const typeToCategory: Record<string, string> = {
          "restaurant": "Restaurants",
          "food": "Restaurants",
          "cafe": "Restaurants",
          "meal_takeaway": "Restaurants",
          "bakery": "Restaurants",
          
          "store": "Shopping",
          "shopping_mall": "Shopping",
          "supermarket": "Shopping",
          "clothing_store": "Shopping",
          "home_goods_store": "Shopping",
          "grocery_or_supermarket": "Shopping",
          
          "doctor": "Medical & Dental",
          "dentist": "Medical & Dental",
          "health": "Medical & Dental",
          "hospital": "Medical & Dental",
          "pharmacy": "Medical & Dental",
          
          "beauty_salon": "Beauty & Wellness",
          "spa": "Beauty & Wellness",
          "hair_care": "Beauty & Wellness",
          
          "finance": "Financial Services",
          "bank": "Financial Services",
          "accounting": "Financial Services",
          "insurance_agency": "Financial Services",
          
          "real_estate_agency": "Real Estate",
          
          "car_repair": "Automotive",
          "car_dealer": "Automotive",
          
          "school": "Childcare & Education",
          "primary_school": "Childcare & Education",
          "secondary_school": "Childcare & Education",
          
          "lawyer": "Professional Services",
          "attorney": "Professional Services",
          
          "church": "Religious Organizations",
          "place_of_worship": "Religious Organizations",
          
          "gym": "Sports & Fitness",
          "park": "Recreation & Entertainment",
          "amusement_park": "Recreation & Entertainment",
          "library": "Recreation & Entertainment",
          
          "electrician": "Home Services",
          "plumber": "Home Services",
          "contractor": "Home Services",
          "roofing_contractor": "Home Services",
        };
        
        // Find the first matching category
        for (const type of types) {
          if (typeToCategory[type]) {
            return typeToCategory[type];
          }
        }
        
        // Default to a general category if no match
        return "Professional Services";
      };
      
      // Process each search query
      for (const query of searchQueries) {
        // Encode the query for URL
        const encodedQuery = encodeURIComponent(query);
        
        // If looking for recently added places, add a time parameter 
        // Note: Google Places API doesn't directly support date filtering, 
        // but we can add 'new' to the query to prioritize newer places
        const timeQualifier = daysToLookBack < 90 ? " new" : "";
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}${timeQualifier}&key=${googleApiKey}`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (!searchResponse.ok || searchData.status !== "OK") {
          console.error(`Places API error: ${searchData.status}`, searchData.error_message);
          continue;
        }
        
        // Process each place
        for (const place of searchData.results) {
          try {
            // Skip if location is not in Fulshear
            if (!place.formatted_address.toLowerCase().includes("fulshear")) {
              continue;
            }
            
            // Skip if we already have this place in our database
            if (existingPlaceIds.has(place.place_id)) {
              results.skipped++;
              continue;
            }
            
            // Get detailed place information
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,opening_hours,geometry,place_id,types,photos&key=${googleApiKey}`;
            
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            
            if (!detailsResponse.ok || detailsData.status !== "OK") {
              console.error(`Place details API error: ${detailsData.status}`, detailsData.error_message);
              results.failed++;
              continue;
            }
            
            const placeDetails = detailsData.result;
            
            // Map Google place types to our categories
            const categoryName = mapToCategory(placeDetails.types || []);
            const categoryId = categoryMap.get(categoryName);
            
            if (!categoryId) {
              console.warn(`Could not find matching category for: ${categoryName}`);
              results.failed++;
              continue;
            }
            
            // Format hours in our standard format
            let hours: string[] = [];
            if (placeDetails.opening_hours && placeDetails.opening_hours.weekday_text) {
              hours = placeDetails.opening_hours.weekday_text;
            }
            
            // Process photos - get photo references and convert to photo URLs
            let photos: string[] = [];
            if (placeDetails.photos && placeDetails.photos.length > 0) {
              try {
                // Limit to maximum 10 photos per business to increase chances of getting good photos
                const photoReferences = placeDetails.photos.slice(0, 10).map((photo: any) => photo.photo_reference);
                
                console.log(`Processing ${photoReferences.length} photos for ${placeDetails.name}`);
              
                // Convert photo references to URLs, ensuring the first photo is the business profile image
              photos = photoReferences.map((ref: string) => 
                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${ref}&key=${googleApiKey}`
              );

                // If the business has a profile_photo_reference property, prioritize it as the first photo
                if (placeDetails.profile_photo_reference) {
                  const profilePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${placeDetails.profile_photo_reference}&key=${googleApiKey}`;
                  
                  // Add profile photo at the beginning
                  photos.unshift(profilePhotoUrl);
                  
                  // Remove duplicates while preserving order
                  photos = [...new Set(photos)].slice(0, 10);
                }
                
                console.log(`Added ${photos.length} photos for ${placeDetails.name}`);
              } catch (photoError) {
                console.error(`Error processing photos for ${placeDetails.name}:`, photoError);
                // Continue with other data even if photo processing fails
              }
            } else {
              console.log(`No photos available for ${placeDetails.name}`);
            }
            
            // Create business object with photos
            const business = {
              name: placeDetails.name,
              address: placeDetails.formatted_address,
              phoneNumber: placeDetails.formatted_phone_number || undefined,
              website: placeDetails.website || undefined,
              categoryId: categoryId as Id<"categories">,
              rating: placeDetails.rating || undefined,
              hours: hours.length > 0 ? hours : undefined,
              latitude: placeDetails.geometry.location.lat,
              longitude: placeDetails.geometry.location.lng,
              placeId: placeDetails.place_id,
              photos: photos.length > 0 ? photos : undefined,
              description: `${placeDetails.name} is a ${categoryName.toLowerCase()} business located in Fulshear, TX. ${
                placeDetails.rating ? `It has a rating of ${placeDetails.rating} stars.` : ""
              }`,
              lastUpdated: Date.now(),
            };
            
            // Add to database
            await ctx.runMutation(api.businesses.add, { business });
            
            results.successful++;
            console.log(`Added new business: ${business.name}`);
          } catch (error) {
            console.error(`Error processing place:`, error);
            results.failed++;
          }
          
          results.totalProcessed++;
        }
      }
      
      return {
        success: true,
        message: `Import completed: ${results.successful} added, ${results.skipped} skipped (already in database), ${results.failed} failed`,
        results: {
          successful: results.successful,
          skipped: results.skipped,
          failed: results.failed,
          totalProcessed: results.totalProcessed,
          deleteMode: deleteExisting ? "Replaced existing" : "Added to existing",
          lastImportDate: lastImportDate.toISOString()
        }
      };
    } catch (error) {
      console.error("Google Places import error:", error);
      throw new Error(`Failed to import from Google Places: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 