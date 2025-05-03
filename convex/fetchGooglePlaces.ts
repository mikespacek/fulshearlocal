import { action } from "./_generated/server";
import { v } from "convex/values";
import { fetchFulshearBusinesses, mapBusinessTypeToCategory } from "./utils/googlePlaces";

/**
 * Action to fetch business data from Google Places API and return it
 * This doesn't modify the database directly, it just fetches the data
 */
export const fetchBusinesses = action({
  args: {
    adminKey: v.string(), // Simple admin key for basic protection
  },
  handler: async (ctx, args) => {
    // Simple auth - in a real app, use proper authentication
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey || args.adminKey !== adminKey) {
      throw new Error("Unauthorized");
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("Google Places API key is not configured");
    }

    // Log operation start
    console.log("Business data fetch started at", new Date().toISOString());
    
    try {
      // Fetch business data from Google Places API
      const businessesData = await fetchFulshearBusinesses(apiKey);
      console.log(`Fetched ${businessesData.length} businesses from Google Places API`);
      
      // Return the data to be processed by a mutation
      return businessesData;
    } catch (error) {
      console.error("Business data fetch failed:", error);
      throw new Error(`Data fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 