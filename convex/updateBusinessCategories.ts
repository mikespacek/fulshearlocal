import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This function updates existing businesses to use our new categories
export const updateBusinessCategories = mutation({
  handler: async (ctx) => {
    // Get all businesses
    const businesses = await ctx.db.query("businesses").collect();
    
    // Get all categories
    const categories = await ctx.db.query("categories").collect();
    
    // Create category maps by name
    const categoryMap = new Map();
    for (const category of categories) {
      categoryMap.set(category.name, category._id);
    }
    
    // Define how to map existing businesses to new categories
    const businessCategoryMap: Record<string, string> = {
      'Fulshear Cafe': 'Restaurants',
      'Fulshear Market': 'Shopping',
      'Fulshear Auto Repair': 'Automotive',
      'Fulshear Medical Center': 'Medical & Dental',
      'Fulshear Elementary School': 'Childcare & Education',
      'Fulshear Cinema': 'Recreation & Entertainment',
    };
    
    // Add more realistic businesses for our new categories
    const newBusinesses = [
      {
        name: 'First Bank of Fulshear',
        address: '8022 FM 359 S, Fulshear, TX 77441',
        phoneNumber: '(281) 346-1250',
        website: 'https://www.firstbanks.com',
        rating: 4.2,
        hours: [
          'Monday: 9:00 AM - 5:00 PM',
          'Tuesday: 9:00 AM - 5:00 PM',
          'Wednesday: 9:00 AM - 5:00 PM',
          'Thursday: 9:00 AM - 5:00 PM',
          'Friday: 9:00 AM - 5:00 PM',
          'Saturday: 9:00 AM - 12:00 PM',
          'Sunday: Closed',
        ],
        latitude: 29.6961,
        longitude: -95.8867,
        placeId: 'example-first-bank-fulshear',
        categoryName: 'Financial Services',
      },
      {
        name: 'Fulshear Family Dental',
        address: '27120 Fulshear Bend Dr #400, Fulshear, TX 77441',
        phoneNumber: '(281) 346-8371',
        website: 'https://www.fulsheardental.com',
        rating: 4.8,
        hours: [
          'Monday: 9:00 AM - 6:00 PM',
          'Tuesday: 9:00 AM - 6:00 PM',
          'Wednesday: 9:00 AM - 6:00 PM',
          'Thursday: 9:00 AM - 6:00 PM',
          'Friday: 9:00 AM - 2:00 PM',
          'Saturday: Closed',
          'Sunday: Closed',
        ],
        latitude: 29.7014,
        longitude: -95.8912,
        placeId: 'example-fulshear-dental',
        categoryName: 'Medical & Dental',
      },
      {
        name: 'CrossFit Fulshear',
        address: '29615 FM 1093 #13, Fulshear, TX 77441',
        phoneNumber: '(281) 346-7799',
        website: 'https://www.crossfitfulshear.com',
        rating: 4.9,
        hours: [
          'Monday: 5:00 AM - 8:00 PM',
          'Tuesday: 5:00 AM - 8:00 PM',
          'Wednesday: 5:00 AM - 8:00 PM',
          'Thursday: 5:00 AM - 8:00 PM',
          'Friday: 5:00 AM - 7:00 PM',
          'Saturday: 8:00 AM - 12:00 PM',
          'Sunday: Closed',
        ],
        latitude: 29.7011,
        longitude: -95.8711,
        placeId: 'example-crossfit-fulshear',
        categoryName: 'Sports & Fitness',
      },
      {
        name: 'Fulshear Hair Salon',
        address: '6123 FM 1463 #100, Fulshear, TX 77441',
        phoneNumber: '(281) 533-0700',
        website: 'https://www.fulshearsalon.com',
        rating: 4.6,
        hours: [
          'Monday: 9:00 AM - 7:00 PM',
          'Tuesday: 9:00 AM - 7:00 PM',
          'Wednesday: 9:00 AM - 7:00 PM',
          'Thursday: 9:00 AM - 7:00 PM',
          'Friday: 9:00 AM - 7:00 PM',
          'Saturday: 9:00 AM - 6:00 PM',
          'Sunday: Closed',
        ],
        latitude: 29.7088,
        longitude: -95.8656,
        placeId: 'example-fulshear-hair',
        categoryName: 'Beauty & Wellness',
      },
      {
        name: 'Brookwood Community',
        address: '1752 FM 1489, Brookshire, TX 77423',
        phoneNumber: '(281) 375-2100',
        website: 'https://www.brookwoodcommunity.org',
        rating: 4.9,
        hours: [
          'Monday: 9:00 AM - 4:00 PM',
          'Tuesday: 9:00 AM - 4:00 PM',
          'Wednesday: 9:00 AM - 4:00 PM',
          'Thursday: 9:00 AM - 4:00 PM',
          'Friday: 9:00 AM - 4:00 PM',
          'Saturday: 9:00 AM - 4:00 PM',
          'Sunday: 11:00 AM - 4:00 PM',
        ],
        latitude: 29.7825,
        longitude: -95.9489,
        placeId: 'example-brookwood',
        categoryName: 'Professional Services',
      },
      {
        name: 'Fulshear AC & Heating',
        address: '8722 FM 359 S, Fulshear, TX 77441',
        phoneNumber: '(281) 346-0202',
        website: 'https://www.fulshearhvac.com',
        rating: 4.7,
        hours: [
          'Monday: 8:00 AM - 5:00 PM',
          'Tuesday: 8:00 AM - 5:00 PM',
          'Wednesday: 8:00 AM - 5:00 PM',
          'Thursday: 8:00 AM - 5:00 PM',
          'Friday: 8:00 AM - 5:00 PM',
          'Saturday: By appointment',
          'Sunday: Closed',
        ],
        latitude: 29.6881,
        longitude: -95.8799,
        placeId: 'example-fulshear-hvac',
        categoryName: 'Home Services',
      },
      {
        name: 'Fulshear Community Church',
        address: '30402 FM 1093, Fulshear, TX 77441',
        phoneNumber: '(281) 346-8812',
        website: 'https://www.fulshearcommunity.com',
        rating: 4.8,
        hours: [
          'Monday: 9:00 AM - 4:00 PM',
          'Tuesday: 9:00 AM - 4:00 PM',
          'Wednesday: 9:00 AM - 8:00 PM',
          'Thursday: 9:00 AM - 4:00 PM',
          'Friday: 9:00 AM - 4:00 PM',
          'Saturday: Closed',
          'Sunday: 8:00 AM - 12:00 PM',
        ],
        latitude: 29.7027,
        longitude: -95.8951,
        placeId: 'example-fulshear-church',
        categoryName: 'Religious Organizations',
      },
      {
        name: 'Keller Williams Realty Fulshear',
        address: '29818 FM 1093, Fulshear, TX 77441',
        phoneNumber: '(832) 508-2111',
        website: 'https://www.kwfulshear.com',
        rating: 4.7,
        hours: [
          'Monday: 9:00 AM - 6:00 PM',
          'Tuesday: 9:00 AM - 6:00 PM',
          'Wednesday: 9:00 AM - 6:00 PM',
          'Thursday: 9:00 AM - 6:00 PM',
          'Friday: 9:00 AM - 6:00 PM',
          'Saturday: 10:00 AM - 4:00 PM',
          'Sunday: Closed',
        ],
        latitude: 29.7019,
        longitude: -95.8775,
        placeId: 'example-kw-fulshear',
        categoryName: 'Real Estate',
      },
    ];
    
    // Update results tracking
    const results = {
      updated: 0,
      added: 0,
      errors: 0,
    };
    
    // Step 1: Update existing businesses with new categories
    for (const business of businesses) {
      try {
        const targetCategory = businessCategoryMap[business.name];
        if (targetCategory && categoryMap.has(targetCategory)) {
          const categoryId = categoryMap.get(targetCategory);
          await ctx.db.patch(business._id, { categoryId });
          results.updated++;
        }
      } catch (error) {
        console.error(`Error updating business: ${business.name}`, error);
        results.errors++;
      }
    }
    
    // Step 2: Add new businesses for more category coverage
    for (const newBusiness of newBusinesses) {
      try {
        if (categoryMap.has(newBusiness.categoryName)) {
          const categoryId = categoryMap.get(newBusiness.categoryName);
          
          // Prepare business object without categoryName
          const { categoryName, ...businessData } = newBusiness;
          
          await ctx.db.insert("businesses", {
            ...businessData,
            categoryId,
            lastUpdated: Date.now(),
          });
          
          results.added++;
        }
      } catch (error) {
        console.error(`Error adding business: ${newBusiness.name}`, error);
        results.errors++;
      }
    }
    
    return {
      success: true,
      message: `Business categories updated: ${results.updated} updated, ${results.added} added, ${results.errors} errors`,
      results,
    };
  },
}); 