import { mutation } from "./_generated/server";

/**
 * This function cleans up the database by removing all mock/sample businesses
 * that have place IDs starting with "sample-" or "example-".
 */
export const removeMockBusinesses = mutation({
  handler: async (ctx) => {
    try {
      // Get all businesses
      const businesses = await ctx.db.query("businesses").collect();
      
      // Track the results
      const results = {
        removed: 0,
        kept: 0,
      };
      
      // Identify and remove mock businesses
      for (const business of businesses) {
        // Check if this is a mock business by its placeId
        const isMockBusiness = business.placeId.startsWith("sample-") || 
                              business.placeId.startsWith("example-");
        
        if (isMockBusiness) {
          // Delete the mock business
          await ctx.db.delete(business._id);
          console.log(`Removed mock business: ${business.name}`);
          results.removed++;
        } else {
          // Keep real businesses
          results.kept++;
        }
      }
      
      return {
        success: true,
        message: `Database cleanup complete: Removed ${results.removed} mock businesses, kept ${results.kept} real businesses`,
        results,
      };
    } catch (error) {
      console.error("Error cleaning up database:", error);
      throw new Error(`Failed to clean up database: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 