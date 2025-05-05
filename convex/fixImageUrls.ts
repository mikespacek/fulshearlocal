import { mutation } from "./_generated/server";

// Direct function to fix image URLs in the database
export const fix = mutation({
  handler: async (ctx) => {
    const results = {
      updated: 0,
      total: 0,
    };

    // Use this specific Vercel URL
    const vercelUrl = "https://fulshearlocal.vercel.app";

    // Get all categories
    const categories = await ctx.db.query("categories").collect();
    results.total = categories.length;
    
    console.log(`Found ${categories.length} categories to update`);
    
    // Update each category with absolute URLs
    for (const category of categories) {
      const currentUrl = category.imageUrl;
      
      // Only fix URLs that are relative paths
      if (currentUrl && currentUrl.startsWith('/category-images/')) {
        const newUrl = `${vercelUrl}${currentUrl}`;
        
        // Log the change for debugging
        console.log(`Updating ${category.name}: ${currentUrl} -> ${newUrl}`);
        
        // Update the database
        await ctx.db.patch(category._id, {
          imageUrl: newUrl,
        });
        
        results.updated++;
      }
    }
    
    return {
      success: true,
      message: `Updated ${results.updated} out of ${results.total} categories with absolute image URLs`,
      results,
    };
  },
}); 