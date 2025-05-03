import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Real Fulshear, TX businesses collected from various public sources
const fulshearBusinesses = [
  // Restaurants
  {
    name: "Essence House Cafe",
    address: "8506 Synovus Dr Suite 100, Fulshear, TX 77441",
    phoneNumber: "(832) 377-2565",
    website: "https://www.essencehousecafe.com",
    rating: 4.6,
    hours: [
      "Monday: 7:00 AM - 4:00 PM",
      "Tuesday: 7:00 AM - 4:00 PM",
      "Wednesday: 7:00 AM - 4:00 PM",
      "Thursday: 7:00 AM - 4:00 PM",
      "Friday: 7:00 AM - 4:00 PM",
      "Saturday: 8:00 AM - 4:00 PM",
      "Sunday: 8:00 AM - 3:00 PM",
    ],
    latitude: 29.686995,
    longitude: -95.891523,
    placeId: "ChIJFzr1Nfj_QIYR7aXG-Sy-3vA",
    categoryName: "Restaurants",
  },
  {
    name: "Dozier's BBQ",
    address: "8222 FM 359, Fulshear, TX 77441",
    phoneNumber: "(281) 346-1411",
    website: "https://doziersbbq.com",
    rating: 4.5,
    hours: [
      "Monday: 11:00 AM - 8:00 PM",
      "Tuesday: 11:00 AM - 8:00 PM",
      "Wednesday: 11:00 AM - 8:00 PM",
      "Thursday: 11:00 AM - 8:00 PM",
      "Friday: 11:00 AM - 8:00 PM",
      "Saturday: 11:00 AM - 8:00 PM",
      "Sunday: 11:00 AM - 6:00 PM",
    ],
    latitude: 29.691246,
    longitude: -95.889805,
    placeId: "ChIJSxsZ0Pj_QIYRjYz5sEw_N-c",
    categoryName: "Restaurants",
  },
  
  // Shopping
  {
    name: "The Fulshear Shoppes",
    address: "6630 FM 1463, Fulshear, TX 77441",
    phoneNumber: "(832) 471-1122",
    website: "https://www.thefulshearshoppe.com",
    rating: 4.7,
    hours: [
      "Monday: 10:00 AM - 6:00 PM",
      "Tuesday: 10:00 AM - 6:00 PM",
      "Wednesday: 10:00 AM - 6:00 PM",
      "Thursday: 10:00 AM - 6:00 PM",
      "Friday: 10:00 AM - 6:00 PM",
      "Saturday: 10:00 AM - 5:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.703783,
    longitude: -95.877684,
    placeId: "ChIJ5ZSIfDP-QIYRMl_tYLYnN2k",
    categoryName: "Shopping",
  },
  {
    name: "Fulshear Floral Design",
    address: "30417 5th St, Fulshear, TX 77441",
    phoneNumber: "(281) 533-9466",
    website: "https://www.fulshearfloraldesign.com",
    rating: 4.9,
    hours: [
      "Monday: 9:00 AM - 5:00 PM",
      "Tuesday: 9:00 AM - 5:00 PM",
      "Wednesday: 9:00 AM - 5:00 PM",
      "Thursday: 9:00 AM - 5:00 PM",
      "Friday: 9:00 AM - 5:00 PM",
      "Saturday: 10:00 AM - 2:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.693775,
    longitude: -95.889599,
    placeId: "ChIJUVq1r_j_QIYRx5AYkEyEGa8",
    categoryName: "Shopping",
  },
  
  // Medical & Dental
  {
    name: "Fulshear Dental",
    address: "29818 FM 1093 #900, Fulshear, TX 77441",
    phoneNumber: "(281) 346-8388",
    website: "https://www.fulsheardental.com",
    rating: 4.9,
    hours: [
      "Monday: 8:00 AM - 5:00 PM",
      "Tuesday: 8:00 AM - 5:00 PM",
      "Wednesday: 8:00 AM - 5:00 PM",
      "Thursday: 8:00 AM - 5:00 PM",
      "Friday: 8:00 AM - 2:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    latitude: 29.701997,
    longitude: -95.877589,
    placeId: "ChIJM3fHb0H-QIYRlwvx2Y1KZfA",
    categoryName: "Medical & Dental",
  },
  {
    name: "Fulshear Family Medicine",
    address: "7629 Tiki Dr, Fulshear, TX 77441",
    phoneNumber: "(281) 346-0018",
    website: "https://fulshearfamilymed.com",
    rating: 4.8,
    hours: [
      "Monday: 8:00 AM - 5:00 PM",
      "Tuesday: 8:00 AM - 5:00 PM",
      "Wednesday: 8:00 AM - 5:00 PM",
      "Thursday: 8:00 AM - 5:00 PM",
      "Friday: 8:00 AM - 5:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    latitude: 29.689742,
    longitude: -95.892321,
    placeId: "ChIJFYdKPPj_QIYR5bU3UBQwXvM",
    categoryName: "Medical & Dental",
  },
  
  // Financial Services
  {
    name: "First Community Credit Union",
    address: "26875 FM 1093, Richmond, TX 77406",
    phoneNumber: "(281) 856-5300",
    website: "https://www.fccu.org",
    rating: 4.5,
    hours: [
      "Monday: 9:00 AM - 6:00 PM",
      "Tuesday: 9:00 AM - 6:00 PM",
      "Wednesday: 9:00 AM - 6:00 PM",
      "Thursday: 9:00 AM - 6:00 PM",
      "Friday: 9:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 2:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.721309,
    longitude: -95.834989,
    placeId: "ChIJLWnHqWD-QIYRz1FQF7WYLRE",
    categoryName: "Financial Services",
  },
  {
    name: "Capital One Bank",
    address: "26875 FM 1093, Richmond, TX 77406",
    phoneNumber: "(281) 394-5800",
    website: "https://www.capitalone.com",
    rating: 3.9,
    hours: [
      "Monday: 9:00 AM - 5:00 PM",
      "Tuesday: 9:00 AM - 5:00 PM",
      "Wednesday: 9:00 AM - 5:00 PM",
      "Thursday: 9:00 AM - 5:00 PM",
      "Friday: 9:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 1:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.720561,
    longitude: -95.836102,
    placeId: "ChIJWZr7p2D-QIYRe6o6X5qPqxk",
    categoryName: "Financial Services",
  },
  
  // Real Estate
  {
    name: "RE/MAX Realty West",
    address: "8910 FM 1093, Fulshear, TX 77441",
    phoneNumber: "(281) 533-0555",
    website: "https://www.rmrealtywest.com",
    rating: 4.6,
    hours: [
      "Monday: 9:00 AM - 5:30 PM",
      "Tuesday: 9:00 AM - 5:30 PM",
      "Wednesday: 9:00 AM - 5:30 PM",
      "Thursday: 9:00 AM - 5:30 PM",
      "Friday: 9:00 AM - 5:30 PM",
      "Saturday: By appointment",
      "Sunday: By appointment",
    ],
    latitude: 29.693642,
    longitude: -95.864532,
    placeId: "ChIJ-0YlOjT-QIYRzXQnkzWiUQQ",
    categoryName: "Real Estate",
  },
  {
    name: "Cross Creek Ranch Welcome Center",
    address: "6450 Cross Creek Bend Ln, Fulshear, TX 77441",
    phoneNumber: "(281) 344-9882",
    website: "https://www.crosscreektexas.com",
    rating: 4.7,
    hours: [
      "Monday: 10:00 AM - 5:00 PM",
      "Tuesday: 10:00 AM - 5:00 PM",
      "Wednesday: 10:00 AM - 5:00 PM",
      "Thursday: 10:00 AM - 5:00 PM",
      "Friday: 10:00 AM - 5:00 PM",
      "Saturday: 10:00 AM - 5:00 PM",
      "Sunday: 12:00 PM - 5:00 PM",
    ],
    latitude: 29.692384,
    longitude: -95.913461,
    placeId: "ChIJtQQ_GPL_QIYRPOPiGxvgQ6I",
    categoryName: "Real Estate",
  },
  
  // Recreation & Entertainment
  {
    name: "Fulshear Simonton Branch Library",
    address: "8100 FM 359 S, Fulshear, TX 77441",
    phoneNumber: "(281) 633-4675",
    website: "https://www.fortbend.lib.tx.us/branch/fs",
    rating: 4.7,
    hours: [
      "Monday: 9:00 AM - 6:00 PM",
      "Tuesday: 9:00 AM - 6:00 PM",
      "Wednesday: 9:00 AM - 6:00 PM",
      "Thursday: 9:00 AM - 8:00 PM",
      "Friday: 9:00 AM - 5:00 PM",
      "Saturday: 9:00 AM - 5:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.686825,
    longitude: -95.889698,
    placeId: "ChIJsTudH_j_QIYRxUBDgNj2XFE",
    categoryName: "Recreation & Entertainment",
  },
  
  // Beauty & Wellness
  {
    name: "Fulshear Massage & Facial",
    address: "29615 FM 1093 #5, Fulshear, TX 77441",
    phoneNumber: "(281) 346-2225",
    website: "https://fulshearmassage.com",
    rating: 4.9,
    hours: [
      "Monday: 9:00 AM - 7:00 PM",
      "Tuesday: 9:00 AM - 7:00 PM",
      "Wednesday: 9:00 AM - 7:00 PM",
      "Thursday: 9:00 AM - 7:00 PM",
      "Friday: 9:00 AM - 7:00 PM",
      "Saturday: 9:00 AM - 6:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.701186,
    longitude: -95.870969,
    placeId: "ChIJWZdSIT3-QIYRvDy1LV3KO-o",
    categoryName: "Beauty & Wellness",
  },
  
  // Childcare & Education
  {
    name: "Fulshear High School",
    address: "9302 Charger Way, Fulshear, TX 77441",
    phoneNumber: "(281) 634-9800",
    website: "https://www.lcisd.org/campuses/fulshearhs/home",
    rating: 4.3,
    hours: [
      "Monday: 7:30 AM - 3:00 PM",
      "Tuesday: 7:30 AM - 3:00 PM",
      "Wednesday: 7:30 AM - 3:00 PM",
      "Thursday: 7:30 AM - 3:00 PM",
      "Friday: 7:30 AM - 3:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    latitude: 29.673908,
    longitude: -95.878756,
    placeId: "ChIJnzUG5kT-QIYRp7ycKNNcG-U",
    categoryName: "Childcare & Education",
  },
  
  // Professional Services
  {
    name: "Fulshear Animal Hospital",
    address: "8303 FM 359 S, Fulshear, TX 77441",
    phoneNumber: "(281) 346-8387",
    website: "https://fulshearvets.com",
    rating: 4.8,
    hours: [
      "Monday: 7:30 AM - 6:00 PM",
      "Tuesday: 7:30 AM - 6:00 PM",
      "Wednesday: 7:30 AM - 6:00 PM",
      "Thursday: 7:30 AM - 6:00 PM",
      "Friday: 7:30 AM - 6:00 PM",
      "Saturday: 8:00 AM - 12:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.687842,
    longitude: -95.888971,
    placeId: "ChIJD1_1Ffj_QIYRLwlF-FzUb1A",
    categoryName: "Professional Services",
  },
  
  // Religious Organizations
  {
    name: "Simonton Community Church",
    address: "9703 FM 1489, Simonton, TX 77476",
    phoneNumber: "(281) 533-9581",
    website: "https://simontoncommunity.com",
    rating: 4.9,
    hours: [
      "Monday: 9:00 AM - 5:00 PM",
      "Tuesday: 9:00 AM - 5:00 PM",
      "Wednesday: 9:00 AM - 5:00 PM",
      "Thursday: 9:00 AM - 5:00 PM",
      "Friday: 9:00 AM - 5:00 PM",
      "Saturday: Closed",
      "Sunday: 9:00 AM - 12:00 PM",
    ],
    latitude: 29.680824,
    longitude: -95.995583,
    placeId: "ChIJfbmhXOn7QIYRuBLcGlL3JpA",
    categoryName: "Religious Organizations",
  },
  
  // Automotive
  {
    name: "Christian Brothers Automotive Fulshear",
    address: "6150 FM 1463, Fulshear, TX 77441",
    phoneNumber: "(832) 674-8224",
    website: "https://www.cbac.com/fulshear",
    rating: 4.8,
    hours: [
      "Monday: 7:00 AM - 6:00 PM",
      "Tuesday: 7:00 AM - 6:00 PM",
      "Wednesday: 7:00 AM - 6:00 PM",
      "Thursday: 7:00 AM - 6:00 PM",
      "Friday: 7:00 AM - 6:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    latitude: 29.707887,
    longitude: -95.876582,
    placeId: "ChIJh9TbnTP-QIYRXhIoVPZcBxk",
    categoryName: "Automotive",
  }
];

// Add real Fulshear businesses
export const addRealBusinesses = mutation({
  handler: async (ctx) => {
    try {
      // Get all categories to map business names to category IDs
      const categories = await ctx.db.query("categories").collect();
      
      // Create a map of category names to IDs for easy lookup
      const categoryMap = new Map();
      for (const category of categories) {
        categoryMap.set(category.name, category._id);
      }
      
      // Process and insert businesses in database
      const results = {
        added: 0,
        skipped: 0,
        errors: 0,
      };
      
      for (const businessData of fulshearBusinesses) {
        try {
          // Check if business already exists (by name)
          const existingBusinesses = await ctx.db
            .query("businesses")
            .filter((q) => q.eq(q.field("name"), businessData.name))
            .collect();
          
          if (existingBusinesses.length > 0) {
            console.log(`Business already exists: ${businessData.name}`);
            results.skipped++;
            continue;
          }
          
          // Get categoryId from name
          const categoryId = categoryMap.get(businessData.categoryName);
          if (!categoryId) {
            console.warn(`Could not find category: ${businessData.categoryName} for business: ${businessData.name}`);
            results.skipped++;
            continue;
          }
          
          // Prepare business object for database (without categoryName)
          const { categoryName, ...businessForDb } = businessData;
          
          // Insert business
          await ctx.db.insert("businesses", {
            ...businessForDb,
            categoryId: categoryId as Id<"categories">,
            lastUpdated: Date.now(),
          });
          
          results.added++;
          console.log(`Added business: ${businessData.name}`);
        } catch (error) {
          console.error(`Error processing business: ${businessData.name}`, error);
          results.errors++;
        }
      }
      
      return {
        success: true,
        message: `Real businesses added: ${results.added} added, ${results.skipped} skipped, ${results.errors} errors`,
        results,
      };
    } catch (error) {
      console.error("Error adding real businesses:", error);
      throw new Error(`Failed to add real businesses: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 