import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mapBusinessTypeToCategory } from "./utils/googlePlaces";
import { api } from "./_generated/api";

// This function is called to refresh business data from Google Places API
export const refreshBusinessData = mutation({
  args: {
    // Array of business data fetched from Google Places API
    businessesData: v.array(
      v.object({
        name: v.string(),
        address: v.string(),
        latitude: v.number(),
        longitude: v.number(),
        phoneNumber: v.optional(v.union(v.string(), v.null())),
        website: v.optional(v.union(v.string(), v.null())),
        rating: v.optional(v.union(v.number(), v.null())),
        types: v.array(v.string()),
        hours: v.array(v.string()),
        placeId: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Log operation start
    console.log("Business data processing started at", new Date().toISOString());
    
    try {
      // Step 1: Fetch all categories to map business types to category IDs
      const categories = await ctx.db.query("categories").collect();
      
      // Create a map of category names to IDs for easy lookup
      const categoryMap = new Map();
      for (const category of categories) {
        categoryMap.set(category.name, category._id);
      }
      
      // Step 2: Process and insert/update businesses in database
      const results = {
        added: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
      };
      
      for (const businessData of args.businessesData) {
        try {
          // Check if business already exists (by placeId)
          const existingBusinesses = await ctx.db
            .query("businesses")
            .filter((q) => q.eq(q.field("placeId"), businessData.placeId))
            .collect();
          
          const existingBusiness = existingBusinesses[0];
          
          // Map business type to a category ID
          const categoryId = businessData.types 
            ? mapBusinessTypeToCategory(businessData.types, categoryMap) 
            : null;
          
          if (!categoryId) {
            console.warn(`Could not assign category for business: ${businessData.name}`);
            results.skipped++;
            continue;
          }
          
          // Convert null values to undefined for Convex schema compatibility
          const phoneNumber = businessData.phoneNumber === null ? undefined : businessData.phoneNumber;
          const website = businessData.website === null ? undefined : businessData.website;
          const rating = businessData.rating === null ? undefined : businessData.rating;
          
          // Prepare business object for database
          const businessForDb = {
            name: businessData.name,
            address: businessData.address,
            latitude: businessData.latitude,
            longitude: businessData.longitude,
            phoneNumber,
            website,
            rating,
            hours: businessData.hours,
            placeId: businessData.placeId,
            categoryId: categoryId as Id<"categories">,
            lastUpdated: Date.now(),
          };
          
          // Update existing or insert new business
          if (existingBusiness) {
            await ctx.db.patch(existingBusiness._id, businessForDb);
            results.updated++;
          } else {
            await ctx.db.insert("businesses", businessForDb);
            results.added++;
          }
        } catch (error) {
          console.error(`Error processing business: ${businessData.name}`, error);
          results.errors++;
        }
      }
      
      // Log completion and return results
      console.log("Business data processing completed at", new Date().toISOString());
      
      return {
        success: true,
        message: `Data refresh completed: ${results.added} added, ${results.updated} updated, ${results.skipped} skipped, ${results.errors} errors`,
        timestamp: Date.now(),
        results,
      };
    } catch (error) {
      console.error("Business data processing failed:", error);
      throw new Error(`Data processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Wrapper action that combines fetching and processing
export const fetchAndRefreshBusinessData = mutation({
  args: {
    adminKey: v.string() // Simple admin key for basic protection
  },
  handler: async (ctx, args) => {
    // Simple auth - in a real app, use proper authentication
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey || args.adminKey !== adminKey) {
      throw new Error("Unauthorized");
    }
    
    try {
      // First fetch the businesses using the action
      // Note: This is just a placeholder as we can't directly call an action from a mutation
      // In the UI, you'll need to call these two functions in sequence
      return {
        success: true,
        message: "To refresh business data, first call fetchGooglePlaces:fetchBusinesses, then pass the result to refreshData:refreshBusinessData",
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Business data refresh failed:", error);
      throw new Error(`Data refresh failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 