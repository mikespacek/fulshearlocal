import { mutation } from "./_generated/server";

// New categories based on Katy Magazine website
const newCategories = [
  { name: "Restaurants", icon: "utensils" },
  { name: "Shopping", icon: "shopping-bag" },
  { name: "Childcare & Education", icon: "school" },
  { name: "Medical & Dental", icon: "hospital" },
  { name: "Real Estate", icon: "home" },
  { name: "Recreation & Entertainment", icon: "umbrella-beach" },
  { name: "Professional Services", icon: "briefcase" },
  { name: "Home Services", icon: "tools" },
  { name: "Beauty & Wellness", icon: "spa" },
  { name: "Financial Services", icon: "dollar-sign" },
  { name: "Religious Organizations", icon: "church" },
  { name: "Sports & Fitness", icon: "running" },
  { name: "Automotive", icon: "car" },
];

// Mutation to update the categories
export const updateCategories = mutation({
  handler: async (ctx) => {
    // Get existing categories
    const existingCategories = await ctx.db.query("categories").collect();
    
    // Create a map of category names to IDs
    const categoryMap = new Map();
    for (const category of existingCategories) {
      categoryMap.set(category.name, category._id);
    }
    
    // Add or update categories
    const results = {
      added: 0,
      updated: 0,
    };
    
    for (const category of newCategories) {
      // Check if category exists by name
      const existingCategory = existingCategories.find(c => c.name === category.name);
      
      if (existingCategory) {
        // Update if icon is different
        if (existingCategory.icon !== category.icon) {
          await ctx.db.patch(existingCategory._id, { icon: category.icon });
          results.updated++;
        }
      } else {
        // Add new category
        await ctx.db.insert("categories", {
          name: category.name,
          icon: category.icon,
        });
        results.added++;
      }
    }
    
    return {
      success: true,
      message: `Updated categories: ${results.added} added, ${results.updated} updated`,
    };
  },
}); 