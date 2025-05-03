import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Define types for our business objects
interface BusinessData {
  name: string;
  address: string;
  phoneNumber: string;
  website: string;
  rating: number;
  hours: string[];
  latitude: number;
  longitude: number;
  placeId: string;
}

// Define the structure of newBusinesses with string index signature
interface BusinessesByCategory {
  [categoryName: string]: BusinessData[];
}

// Results interface
interface ImportResults {
  added: number;
  skipped: number;
  categories: string[];
  success?: boolean;
  message?: string;
  timestamp?: number;
}

// Mutation to add businesses to categories that are currently empty
export const addBusinessesToEmptyCategories = mutation({
  args: {
    adminKey: v.string(), // Simple admin key for basic protection
  },
  handler: async (ctx, args) => {
    // Simple auth - in a real app, use proper authentication
    // For testing, we'll accept any admin key
    // const adminKey = process.env.ADMIN_KEY;
    // if (!adminKey || args.adminKey !== adminKey) {
    //   throw new Error("Unauthorized");
    // }

    // Step 1: Get all categories
    const categories = await ctx.db.query("categories").collect();
    
    // Create a map of category names to IDs for easy lookup
    const categoryMap = new Map<string, Id<"categories">>();
    for (const category of categories) {
      categoryMap.set(category.name, category._id);
    }

    // Step 2: Get all businesses
    const businesses = await ctx.db.query("businesses").collect();

    // Step 3: Count businesses per category
    const businessesPerCategory = new Map<Id<"categories">, number>();
    for (const business of businesses) {
      const categoryId = business.categoryId;
      businessesPerCategory.set(
        categoryId, 
        (businessesPerCategory.get(categoryId) || 0) + 1
      );
    }

    // Step 4: Identify empty categories
    const emptyCategories = [];
    for (const category of categories) {
      if (!businessesPerCategory.has(category._id) || businessesPerCategory.get(category._id) === 0) {
        emptyCategories.push(category);
      }
    }

    // Step 5: Insert new businesses for empty categories
    const results: ImportResults = {
      added: 0,
      skipped: 0,
      categories: []
    };

    // New businesses data by category
    const newBusinesses: BusinessesByCategory = {
      "Retail": [
        {
          name: "Fulshear Fashion Boutique",
          address: "3425 FM 1463 Rd, Katy, TX 77494",
          phoneNumber: "(281) 394-5885",
          website: "https://fulshearboutique.com",
          rating: 4.7,
          hours: [
            "Monday: 10:00 AM - 6:00 PM",
            "Tuesday: 10:00 AM - 6:00 PM",
            "Wednesday: 10:00 AM - 6:00 PM",
            "Thursday: 10:00 AM - 6:00 PM",
            "Friday: 10:00 AM - 7:00 PM",
            "Saturday: 10:00 AM - 5:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.7072,
          longitude: -95.8420,
          placeId: "fulshear-fashion-boutique-001"
        },
        {
          name: "Fulshear Hardware Store",
          address: "30402 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 533-0002",
          website: "https://fulshearhardware.com",
          rating: 4.5,
          hours: [
            "Monday: 7:00 AM - 7:00 PM",
            "Tuesday: 7:00 AM - 7:00 PM",
            "Wednesday: 7:00 AM - 7:00 PM",
            "Thursday: 7:00 AM - 7:00 PM",
            "Friday: 7:00 AM - 7:00 PM",
            "Saturday: 8:00 AM - 6:00 PM",
            "Sunday: 9:00 AM - 5:00 PM"
          ],
          latitude: 29.6933,
          longitude: -95.8973,
          placeId: "fulshear-hardware-002"
        }
      ],
      "Services": [
        {
          name: "Fulshear Postal Services",
          address: "8722 FM 359 Rd, Fulshear, TX 77441",
          phoneNumber: "(281) 346-0254",
          website: "https://fulshearpostal.com",
          rating: 4.2,
          hours: [
            "Monday: 9:00 AM - 5:00 PM",
            "Tuesday: 9:00 AM - 5:00 PM",
            "Wednesday: 9:00 AM - 5:00 PM",
            "Thursday: 9:00 AM - 5:00 PM",
            "Friday: 9:00 AM - 5:00 PM",
            "Saturday: 9:00 AM - 2:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.6881,
          longitude: -95.8793,
          placeId: "fulshear-postal-001"
        },
        {
          name: "Fulshear Dry Cleaning",
          address: "6420 FM 1463, Katy, TX 77494",
          phoneNumber: "(281) 394-9002",
          website: "https://fulsheardrycleaners.com",
          rating: 4.6,
          hours: [
            "Monday: 7:00 AM - 7:00 PM",
            "Tuesday: 7:00 AM - 7:00 PM",
            "Wednesday: 7:00 AM - 7:00 PM",
            "Thursday: 7:00 AM - 7:00 PM",
            "Friday: 7:00 AM - 7:00 PM",
            "Saturday: 8:00 AM - 5:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.7072,
          longitude: -95.8333,
          placeId: "fulshear-dry-cleaning-002"
        }
      ],
      "Healthcare": [
        {
          name: "Fulshear Medical Center",
          address: "27120 Fulshear Bend Dr, Fulshear, TX 77441",
          phoneNumber: "(832) 924-3222",
          website: "https://fulshearmedical.com",
          rating: 4.8,
          hours: [
            "Monday: 8:00 AM - 5:00 PM",
            "Tuesday: 8:00 AM - 5:00 PM",
            "Wednesday: 8:00 AM - 5:00 PM",
            "Thursday: 8:00 AM - 5:00 PM",
            "Friday: 8:00 AM - 5:00 PM",
            "Saturday: Closed",
            "Sunday: Closed"
          ],
          latitude: 29.7014,
          longitude: -95.8912,
          placeId: "fulshear-medical-001"
        },
        {
          name: "Fulshear Family Pharmacy",
          address: "5623 FM 1463, Katy, TX 77494",
          phoneNumber: "(281) 693-3784",
          website: "https://fulshearpharmacy.com",
          rating: 4.7,
          hours: [
            "Monday: 9:00 AM - 7:00 PM",
            "Tuesday: 9:00 AM - 7:00 PM",
            "Wednesday: 9:00 AM - 7:00 PM",
            "Thursday: 9:00 AM - 7:00 PM",
            "Friday: 9:00 AM - 7:00 PM",
            "Saturday: 9:00 AM - 2:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.7336,
          longitude: -95.8334,
          placeId: "fulshear-pharmacy-002"
        }
      ],
      "Education": [
        {
          name: "Fulshear Elementary School",
          address: "29600 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(832) 223-5500",
          website: "https://www.lcisd.org/schools/elementary/fulshear",
          rating: 4.5,
          hours: [
            "Monday: 7:30 AM - 4:00 PM",
            "Tuesday: 7:30 AM - 4:00 PM",
            "Wednesday: 7:30 AM - 4:00 PM",
            "Thursday: 7:30 AM - 4:00 PM",
            "Friday: 7:30 AM - 4:00 PM",
            "Saturday: Closed",
            "Sunday: Closed"
          ],
          latitude: 29.6936,
          longitude: -95.9052,
          placeId: "fulshear-elementary-001"
        },
        {
          name: "Fulshear Learning Center",
          address: "5650 FM 1463, Katy, TX 77494",
          phoneNumber: "(281) 394-5040",
          website: "https://fulshearlearningcenter.com",
          rating: 4.9,
          hours: [
            "Monday: 8:00 AM - 6:00 PM",
            "Tuesday: 8:00 AM - 6:00 PM",
            "Wednesday: 8:00 AM - 6:00 PM",
            "Thursday: 8:00 AM - 6:00 PM",
            "Friday: 8:00 AM - 6:00 PM",
            "Saturday: 9:00 AM - 1:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.7320,
          longitude: -95.8338,
          placeId: "fulshear-learning-002"
        }
      ],
      "Entertainment": [
        {
          name: "Fulshear Cinema",
          address: "6363 FM 1463, Katy, TX 77494",
          phoneNumber: "(281) 394-5600",
          website: "https://fulshearcinema.com",
          rating: 4.4,
          hours: [
            "Monday: 11:00 AM - 11:00 PM",
            "Tuesday: 11:00 AM - 11:00 PM",
            "Wednesday: 11:00 AM - 11:00 PM",
            "Thursday: 11:00 AM - 11:00 PM",
            "Friday: 11:00 AM - 1:00 AM",
            "Saturday: 10:00 AM - 1:00 AM",
            "Sunday: 10:00 AM - 11:00 PM"
          ],
          latitude: 29.7287,
          longitude: -95.8333,
          placeId: "fulshear-cinema-001"
        },
        {
          name: "Fulshear Arcade & Games",
          address: "30402 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 346-2290",
          website: "https://fulsheararcade.com",
          rating: 4.6,
          hours: [
            "Monday: 12:00 PM - 10:00 PM",
            "Tuesday: 12:00 PM - 10:00 PM",
            "Wednesday: 12:00 PM - 10:00 PM",
            "Thursday: 12:00 PM - 10:00 PM",
            "Friday: 12:00 PM - 12:00 AM",
            "Saturday: 10:00 AM - 12:00 AM",
            "Sunday: 11:00 AM - 9:00 PM"
          ],
          latitude: 29.6927,
          longitude: -95.8951,
          placeId: "fulshear-arcade-002"
        }
      ],
      "Childcare & Education": [
        {
          name: "Fulshear Montessori School",
          address: "5550 FM 1463, Katy, TX 77494",
          phoneNumber: "(281) 394-9797",
          website: "https://fulshearmontessori.com",
          rating: 4.8,
          hours: [
            "Monday: 6:30 AM - 6:30 PM",
            "Tuesday: 6:30 AM - 6:30 PM",
            "Wednesday: 6:30 AM - 6:30 PM",
            "Thursday: 6:30 AM - 6:30 PM",
            "Friday: 6:30 AM - 6:30 PM",
            "Saturday: Closed",
            "Sunday: Closed"
          ],
          latitude: 29.7340,
          longitude: -95.8337,
          placeId: "fulshear-montessori-001"
        },
        {
          name: "Little Explorers Daycare",
          address: "29818 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 346-0222",
          website: "https://littleexplorersdaycare.com",
          rating: 4.9,
          hours: [
            "Monday: 6:00 AM - 6:30 PM",
            "Tuesday: 6:00 AM - 6:30 PM",
            "Wednesday: 6:00 AM - 6:30 PM",
            "Thursday: 6:00 AM - 6:30 PM",
            "Friday: 6:00 AM - 6:30 PM",
            "Saturday: Closed",
            "Sunday: Closed"
          ],
          latitude: 29.7019,
          longitude: -95.8775,
          placeId: "little-explorers-002"
        }
      ],
      "Recreation & Entertainment": [
        {
          name: "Fulshear Family Park",
          address: "27200 Fulshear Bend Dr, Fulshear, TX 77441",
          phoneNumber: "(281) 346-1796",
          website: "https://www.fulshearparks.com",
          rating: 4.7,
          hours: [
            "Monday: 6:00 AM - 10:00 PM",
            "Tuesday: 6:00 AM - 10:00 PM",
            "Wednesday: 6:00 AM - 10:00 PM",
            "Thursday: 6:00 AM - 10:00 PM",
            "Friday: 6:00 AM - 10:00 PM",
            "Saturday: 6:00 AM - 10:00 PM",
            "Sunday: 6:00 AM - 10:00 PM"
          ],
          latitude: 29.7010,
          longitude: -95.8910,
          placeId: "fulshear-family-park-001"
        },
        {
          name: "Fulshear Bowling Center",
          address: "29615 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 346-1829",
          website: "https://fulshearbowling.com",
          rating: 4.5,
          hours: [
            "Monday: 11:00 AM - 11:00 PM",
            "Tuesday: 11:00 AM - 11:00 PM",
            "Wednesday: 11:00 AM - 11:00 PM",
            "Thursday: 11:00 AM - 11:00 PM",
            "Friday: 11:00 AM - 1:00 AM",
            "Saturday: 10:00 AM - 1:00 AM",
            "Sunday: 12:00 PM - 10:00 PM"
          ],
          latitude: 29.7011,
          longitude: -95.8711,
          placeId: "fulshear-bowling-002"
        }
      ],
      "Home Services": [
        {
          name: "Fulshear AC & Heating",
          address: "8722 FM 359 S, Fulshear, TX 77441",
          phoneNumber: "(281) 346-0202",
          website: "https://fulshearac.com",
          rating: 4.7,
          hours: [
            "Monday: 8:00 AM - 5:00 PM",
            "Tuesday: 8:00 AM - 5:00 PM",
            "Wednesday: 8:00 AM - 5:00 PM",
            "Thursday: 8:00 AM - 5:00 PM",
            "Friday: 8:00 AM - 5:00 PM",
            "Saturday: By appointment",
            "Sunday: Closed"
          ],
          latitude: 29.6881,
          longitude: -95.8799,
          placeId: "fulshear-ac-001"
        },
        {
          name: "Fulshear Plumbing Services",
          address: "30406 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 346-2290",
          website: "https://fulshearplumbing.com",
          rating: 4.6,
          hours: [
            "Monday: 7:00 AM - 7:00 PM",
            "Tuesday: 7:00 AM - 7:00 PM",
            "Wednesday: 7:00 AM - 7:00 PM",
            "Thursday: 7:00 AM - 7:00 PM",
            "Friday: 7:00 AM - 7:00 PM",
            "Saturday: 8:00 AM - 5:00 PM",
            "Sunday: Emergency Service Only"
          ],
          latitude: 29.6927,
          longitude: -95.8981,
          placeId: "fulshear-plumbing-002"
        }
      ],
      "Religious Organizations": [
        {
          name: "Fulshear Community Church",
          address: "30402 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 346-8812",
          website: "https://fulshearcommunitychurch.com",
          rating: 4.8,
          hours: [
            "Monday: 9:00 AM - 5:00 PM",
            "Tuesday: 9:00 AM - 5:00 PM",
            "Wednesday: 9:00 AM - 8:00 PM",
            "Thursday: 9:00 AM - 5:00 PM",
            "Friday: 9:00 AM - 5:00 PM",
            "Saturday: Closed",
            "Sunday: 8:00 AM - 1:00 PM"
          ],
          latitude: 29.7027,
          longitude: -95.8951,
          placeId: "fulshear-community-church-001"
        },
        {
          name: "Fulshear Baptist Church",
          address: "29901 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 346-2234",
          website: "https://fulshearbaptist.org",
          rating: 4.7,
          hours: [
            "Monday: 9:00 AM - 4:00 PM",
            "Tuesday: 9:00 AM - 4:00 PM",
            "Wednesday: 9:00 AM - 8:00 PM",
            "Thursday: 9:00 AM - 4:00 PM",
            "Friday: 9:00 AM - 4:00 PM",
            "Saturday: Closed",
            "Sunday: 8:00 AM - 1:00 PM"
          ],
          latitude: 29.7022,
          longitude: -95.8655,
          placeId: "fulshear-baptist-church-002"
        }
      ],
      "Sports & Fitness": [
        {
          name: "CrossFit Fulshear",
          address: "29615 FM 1093 #13, Fulshear, TX 77441",
          phoneNumber: "(281) 346-7799",
          website: "https://crossfitfulshear.com",
          rating: 4.9,
          hours: [
            "Monday: 5:00 AM - 8:00 PM",
            "Tuesday: 5:00 AM - 8:00 PM",
            "Wednesday: 5:00 AM - 8:00 PM",
            "Thursday: 5:00 AM - 8:00 PM",
            "Friday: 5:00 AM - 7:00 PM",
            "Saturday: 8:00 AM - 12:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.7011,
          longitude: -95.8711,
          placeId: "crossfit-fulshear-001"
        },
        {
          name: "Fulshear Yoga Studio",
          address: "6420 FM 1463 #150, Katy, TX 77494",
          phoneNumber: "(281) 394-5090",
          website: "https://fulshearyoga.com",
          rating: 4.8,
          hours: [
            "Monday: 6:00 AM - 8:00 PM",
            "Tuesday: 6:00 AM - 8:00 PM",
            "Wednesday: 6:00 AM - 8:00 PM",
            "Thursday: 6:00 AM - 8:00 PM",
            "Friday: 6:00 AM - 7:00 PM",
            "Saturday: 8:00 AM - 2:00 PM",
            "Sunday: 9:00 AM - 1:00 PM"
          ],
          latitude: 29.7072,
          longitude: -95.8333,
          placeId: "fulshear-yoga-002"
        }
      ]
    };

    // Add new businesses for empty categories
    for (const category of emptyCategories) {
      const categoryName = category.name;
      results.categories.push(categoryName);

      // Check if we have predefined businesses for this category
      if (newBusinesses[categoryName]) {
        for (const business of newBusinesses[categoryName]) {
          try {
            await ctx.db.insert("businesses", {
              name: business.name,
              address: business.address,
              phoneNumber: business.phoneNumber,
              website: business.website,
              categoryId: category._id,
              rating: business.rating,
              hours: business.hours,
              latitude: business.latitude,
              longitude: business.longitude,
              placeId: business.placeId,
              lastUpdated: Date.now(),
            });
            results.added++;
          } catch (error) {
            console.error(`Error adding business "${business.name}":`, error);
            results.skipped++;
          }
        }
      } else {
        console.log(`No predefined businesses for category: ${categoryName}`);
        results.skipped++;
      }
    }

    return {
      success: true,
      message: `Added ${results.added} businesses to ${results.categories.length} empty categories: ${results.categories.join(", ")}`,
      timestamp: Date.now(),
    };
  },
}); 