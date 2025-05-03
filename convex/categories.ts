import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all categories
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Get a single category by ID
export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Delete a category by ID
export const deleteById = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    // Check if any businesses still use this category
    const businessesWithCategory = await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("categoryId"), args.id))
      .collect();
    
    // If businesses are still using this category, don't delete it
    if (businessesWithCategory.length > 0) {
      return {
        success: false,
        message: `Cannot delete category: still has ${businessesWithCategory.length} businesses`,
        businessCount: businessesWithCategory.length
      };
    }
    
    // Delete the category if no businesses are using it
    await ctx.db.delete(args.id);
    return { 
      success: true,
      message: "Category deleted successfully" 
    };
  },
}); 