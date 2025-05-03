import { mutation } from "./_generated/server";

// Categories to remove (duplicates or unnecessary ones)
const categoriesToRemove = [
  "Retail", // Overlaps with "Shopping"
  "Services", // Overlaps with "Professional Services"
  "Healthcare", // Overlaps with "Medical & Dental"
  "Entertainment" // Duplicates "Recreation & Entertainment"
];

export default mutation({
  handler: async (ctx) => {
    const results = {
      removed: 0,
      notFound: 0,
      businessesUpdated: 0
    };

    // Get all existing categories
    const existingCategories = await ctx.db.query("categories").collect();
    
    // Find the replacement category IDs
    const replacementMap = new Map();
    existingCategories.forEach(category => {
      // Set up replacements for the categories we'll remove
      if (category.name === "Shopping") {
        replacementMap.set("Retail", category._id);
      } else if (category.name === "Professional Services") {
        replacementMap.set("Services", category._id);
      } else if (category.name === "Medical & Dental") {
        replacementMap.set("Healthcare", category._id);
      } else if (category.name === "Recreation & Entertainment") {
        replacementMap.set("Entertainment", category._id);
      }
    });

    // Get all businesses to update their category IDs if needed
    const businesses = await ctx.db.query("businesses").collect();
    
    // Process each category to remove
    for (const categoryName of categoriesToRemove) {
      // Find the category
      const categoryToRemove = existingCategories.find(c => c.name === categoryName);
      
      if (categoryToRemove) {
        // Get the replacement category ID
        const replacementCategoryId = replacementMap.get(categoryName);
        
        // Update businesses with this category to use the replacement
        if (replacementCategoryId) {
          for (const business of businesses) {
            if (business.categoryId === categoryToRemove._id) {
              await ctx.db.patch(business._id, {
                categoryId: replacementCategoryId
              });
              results.businessesUpdated++;
            }
          }
        }
        
        // Delete the category
        await ctx.db.delete(categoryToRemove._id);
        results.removed++;
      } else {
        results.notFound++;
      }
    }
    
    return {
      success: true,
      message: `Removed ${results.removed} unnecessary categories, ${results.businessesUpdated} businesses updated`,
      results
    };
  }
}); 