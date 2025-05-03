import { mutation } from "./_generated/server";

/**
 * This function completely removes specific mock businesses by name
 */
export const removeSpecificMockBusinesses = mutation({
  handler: async (ctx) => {
    try {
      // Get all businesses
      const businesses = await ctx.db.query("businesses").collect();
      
      // List of mock business names to remove
      const mockBusinessNames = [
        "Fulshear Cafe",
        "Fulshear Market", 
        "Fulshear Auto Repair",
        "Fulshear Medical Center",
        "Fulshear Elementary School",
        "Fulshear Cinema"
      ];
      
      // Track the results
      const results = {
        removed: 0,
        kept: 0,
      };
      
      // Identify and remove mock businesses by name
      for (const business of businesses) {
        if (mockBusinessNames.includes(business.name)) {
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
        message: `Specific mock businesses removed: ${results.removed} businesses deleted, ${results.kept} businesses kept`,
        results,
      };
    } catch (error) {
      console.error("Error removing specific mock businesses:", error);
      throw new Error(`Failed to remove mock businesses: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 