import { mutation } from "./_generated/server";

const categoryImages = [
  {
    name: "Restaurants",
    imageUrl: "/category-images/restaurants.jpg",
    description: "Discover local dining options from casual eateries to fine dining",
    order: 1,
  },
  {
    name: "Shopping",
    imageUrl: "/category-images/shopping.jpg",
    description: "Browse local stores and boutiques for all your shopping needs",
    order: 2,
  },
  {
    name: "Medical & Dental",
    imageUrl: "/category-images/medical.jpg",
    description: "Find trusted healthcare providers and medical services",
    order: 3,
  },
  {
    name: "Beauty & Wellness",
    imageUrl: "/category-images/beauty.jpg",
    description: "Pamper yourself with local beauty and wellness services",
    order: 4,
  },
  {
    name: "Financial Services",
    imageUrl: "/category-images/financial.jpg",
    description: "Connect with local financial advisors, banks, and services",
    order: 5,
  },
  {
    name: "Real Estate",
    imageUrl: "/category-images/real-estate.jpg",
    description: "Explore real estate options with local agents and services",
    order: 6,
  },
  {
    name: "Automotive",
    imageUrl: "/category-images/automotive.jpg",
    description: "Find reliable auto services, repairs, and dealerships",
    order: 7,
  },
  {
    name: "Professional Services",
    imageUrl: "/category-images/professional.jpg",
    description: "Connect with local professionals and business services",
    order: 8,
  },
  {
    name: "Childcare & Education",
    imageUrl: "/category-images/education.jpg",
    description: "Discover childcare options and educational institutions",
    order: 9,
  },
  {
    name: "Religious Organizations",
    imageUrl: "/category-images/religious.jpg",
    description: "Find places of worship and religious organizations",
    order: 10,
  },
  {
    name: "Sports & Fitness",
    imageUrl: "/category-images/fitness.jpg",
    description: "Stay active with local gyms, sports, and fitness options",
    order: 11,
  },
  {
    name: "Recreation & Entertainment",
    imageUrl: "/category-images/entertainment.jpg",
    description: "Find fun things to do including entertainment and recreation",
    order: 12,
  },
  {
    name: "Home Services",
    imageUrl: "/category-images/home-services.jpg",
    description: "Find contractors, repair services, and other home maintenance needs",
    order: 13,
  },
];

// Update categories with images and descriptions
export const updateCategoryImages = mutation({
  handler: async (ctx) => {
    const results = {
      updated: 0,
      skipped: 0,
      total: categoryImages.length,
    };

    // Get all existing categories
    const existingCategories = await ctx.db.query("categories").collect();
    
    // Update each category
    for (const categoryData of categoryImages) {
      // Find the matching category
      const existingCategory = existingCategories.find(
        (c) => c.name === categoryData.name
      );
      
      if (existingCategory) {
        // Update the category with the image and description
        await ctx.db.patch(existingCategory._id, {
          imageUrl: categoryData.imageUrl,
          description: categoryData.description,
          order: categoryData.order,
        });
        
        results.updated++;
      } else {
        results.skipped++;
      }
    }
    
    return {
      success: true,
      message: `Updated ${results.updated} categories with images and descriptions`,
      results,
    };
  },
}); 