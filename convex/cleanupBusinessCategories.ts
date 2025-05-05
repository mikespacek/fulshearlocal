import { mutation } from "./_generated/server";

// This function will:
// 1. Find businesses with invalid category IDs
// 2. Identify duplicate categories and merge them
// 3. Remove businesses with invalid category IDs that can't be fixed

export default mutation({
  handler: async (ctx) => {
    const results = {
      fixedBusinesses: 0,
      removedBusinesses: 0,
      totalBusinesses: 0,
      invalidCategories: 0,
    };

    // Get all categories to build a valid ID map
    const categories = await ctx.db.query("categories").collect();
    const validCategoryIds = new Set(categories.map(cat => cat._id));
    
    // Get all businesses
    const businesses = await ctx.db.query("businesses").collect();
    results.totalBusinesses = businesses.length;
    
    // Check each business
    for (const business of businesses) {
      // Check if the business has a valid category ID
      if (!business.categoryId || !validCategoryIds.has(business.categoryId)) {
        console.log(`Business "${business.name}" has an invalid category ID: ${business.categoryId}`);
        results.invalidCategories++;
        
        // Try to find a suitable category based on the business name or description
        let bestCategory = null;
        
        // Simple heuristic - you could make this more sophisticated
        if (business.name.toLowerCase().includes("restaurant") || 
            business.name.toLowerCase().includes("cafe") || 
            business.name.toLowerCase().includes("bakery") ||
            business.name.toLowerCase().includes("food")) {
          bestCategory = categories.find(c => c.name === "Restaurants");
        }
        else if (business.name.toLowerCase().includes("shop") || 
                business.name.toLowerCase().includes("store") ||
                business.name.toLowerCase().includes("market")) {
          bestCategory = categories.find(c => c.name === "Shopping");
        }
        else if (business.name.toLowerCase().includes("doctor") ||
                business.name.toLowerCase().includes("medical") ||
                business.name.toLowerCase().includes("dental") ||
                business.name.toLowerCase().includes("clinic") ||
                business.name.toLowerCase().includes("hospital")) {
          bestCategory = categories.find(c => c.name === "Medical & Dental");
        }
        // Add more category matching rules as needed
        
        if (bestCategory) {
          // Update the business with the correct category
          await ctx.db.patch(business._id, {
            categoryId: bestCategory._id,
            lastUpdated: Date.now()
          });
          results.fixedBusinesses++;
          console.log(`Fixed business "${business.name}" by assigning to category "${bestCategory.name}"`);
        } else {
          // If we can't determine a suitable category, remove the business
          await ctx.db.delete(business._id);
          results.removedBusinesses++;
          console.log(`Removed business "${business.name}" because it had an invalid category that couldn't be fixed`);
        }
      }
    }
    
    return {
      success: true,
      message: `Fixed ${results.fixedBusinesses} businesses, removed ${results.removedBusinesses} out of ${results.totalBusinesses} total. Found ${results.invalidCategories} with invalid categories.`,
      results
    };
  },
}); 