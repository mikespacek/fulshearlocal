import { action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Action to fetch data from Google Places API and import to database
export const importFulshearBusinesses = action({
  args: {
    googleApiKey: v.string(),
  },
  handler: async (ctx, { googleApiKey }) => {
    try {
      // STEP 1: Delete all existing businesses
      // First get all businesses
      const businesses = await ctx.runQuery(api.businesses.getAll);
      let deletedCount = 0;
      
      // Delete them one by one
      for (const business of businesses) {
        await ctx.runMutation(api.businesses.deleteById, { id: business._id });
        deletedCount++;
      }
      
      console.log(`Database purged: Deleted ${deletedCount} businesses`);
      
      // STEP 2: Get categories from database to map businesses
      const categories = await ctx.runQuery(api.categories.getAll);
      const categoryMap = new Map();
      
      for (const category of categories) {
        categoryMap.set(category.name, category._id);
      }
      
      // STEP 3: Search for Fulshear businesses using Google Places API
      const results = {
        successful: 0,
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
        
        // First make the text search request
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${googleApiKey}`;
        
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
            
            // Get detailed place information
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,opening_hours,geometry,place_id,types&key=${googleApiKey}`;
            
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
            
            // Create business object
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
              description: `${placeDetails.name} is a ${categoryName.toLowerCase()} business located in Fulshear, TX. ${
                placeDetails.rating ? `It has a rating of ${placeDetails.rating} stars.` : ""
              }`,
              lastUpdated: Date.now(),
            };
            
            // Add to database
            await ctx.runMutation(api.businesses.add, { business });
            
            results.successful++;
            console.log(`Added business: ${business.name}`);
          } catch (error) {
            console.error(`Error processing place:`, error);
            results.failed++;
          }
          
          results.totalProcessed++;
        }
      }
      
      return {
        success: true,
        message: `Imported businesses from Google Places: ${results.successful} added, ${results.failed} failed`,
        results
      };
    } catch (error) {
      console.error("Google Places import error:", error);
      throw new Error(`Failed to import from Google Places: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 