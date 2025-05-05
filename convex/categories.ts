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

// Update a category by ID
export const updateCategory = mutation({
  args: { 
    id: v.id("categories"),
    data: v.object({
      name: v.optional(v.string()),
      icon: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      description: v.optional(v.string()),
      order: v.optional(v.number()),
    })
  },
  handler: async (ctx, args) => {
    // Update the category with the provided data
    await ctx.db.patch(args.id, args.data);
    
    // Return the updated category
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

// New function to update image URLs in categories to absolute paths
export const updateImageUrls = mutation({
  handler: async (ctx) => {
    const baseUrl = "https://fulshearlocal.vercel.app";
    const results = {
      updated: 0,
      skipped: 0,
      total: 0
    };
    
    // Get all categories
    const categories = await ctx.db.query("categories").collect();
    results.total = categories.length;
    
    // Process each category
    for (const category of categories) {
      const currentUrl = category.imageUrl;
      
      // Only update relative URLs
      if (currentUrl && currentUrl.startsWith('/category-images/')) {
        const absoluteUrl = `${baseUrl}${currentUrl}`;
        
        // Update the category
        await ctx.db.patch(category._id, {
          imageUrl: absoluteUrl
        });
        
        results.updated++;
      } else {
        results.skipped++;
      }
    }
    
    return {
      success: true,
      message: `Updated ${results.updated} out of ${results.total} category image URLs to absolute paths`,
      updatedCategories: results.updated,
      skippedCategories: results.skipped,
      totalCategories: results.total
    };
  }
}); 