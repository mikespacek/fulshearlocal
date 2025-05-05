import { mutation } from "./_generated/server";

// Update category images to use absolute URLs
export default mutation({
  handler: async (ctx) => {
    const baseUrl = "https://fulshearlocal.vercel.app";
    const results = {
      updated: 0,
      total: 0,
      failures: 0,
      skipped: 0
    };
    
    // Get all categories
    const categories = await ctx.db.query("categories").collect();
    results.total = categories.length;
    
    console.log(`Found ${categories.length} categories to process`);
    
    // Process each category and update image URLs to absolute URLs
    for (const category of categories) {
      const currentUrl = category.imageUrl;
      
      // Only update URLs that are relative paths
      if (currentUrl && currentUrl.startsWith('/')) {
        try {
          const absoluteUrl = `${baseUrl}${currentUrl}`;
          console.log(`Updating ${category.name}: ${currentUrl} -> ${absoluteUrl}`);
          
          // Update the category
          await ctx.db.patch(category._id, {
            imageUrl: absoluteUrl
          });
          
          results.updated++;
        } catch (error) {
          console.error(`Error updating ${category.name}:`, error);
          results.failures++;
        }
      } else {
        console.log(`Skipping ${category.name}: URL already absolute or not set`);
        results.skipped++;
      }
    }
    
    return {
      success: results.failures === 0,
      message: `Updated ${results.updated} out of ${results.total} categories with absolute image URLs`,
      results
    };
  },
}); 