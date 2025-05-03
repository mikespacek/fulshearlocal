import { mutation } from "./_generated/server";

// Sample data for development purposes
const categories = [
  { name: "Restaurants", icon: "utensils" },
  { name: "Retail", icon: "shopping-bag" },
  { name: "Services", icon: "briefcase" },
  { name: "Healthcare", icon: "heart" },
  { name: "Education", icon: "school" },
  { name: "Entertainment", icon: "film" },
];

const businesses = [
  {
    name: "Fulshear Cafe",
    address: "123 Main St, Fulshear, TX 77441",
    phoneNumber: "(281) 555-1234",
    website: "https://example.com/fulshear-cafe",
    rating: 4.7,
    hours: [
      "Monday: 7:00 AM - 8:00 PM",
      "Tuesday: 7:00 AM - 8:00 PM",
      "Wednesday: 7:00 AM - 8:00 PM",
      "Thursday: 7:00 AM - 8:00 PM",
      "Friday: 7:00 AM - 9:00 PM",
      "Saturday: 8:00 AM - 9:00 PM",
      "Sunday: 8:00 AM - 6:00 PM",
    ],
    latitude: 29.6919,
    longitude: -95.8824,
    placeId: "sample-place-id-1",
    categoryIndex: 0, // Restaurants
  },
  {
    name: "Fulshear Market",
    address: "456 Oak St, Fulshear, TX 77441",
    phoneNumber: "(281) 555-5678",
    website: "https://example.com/fulshear-market",
    rating: 4.5,
    hours: [
      "Monday: 9:00 AM - 9:00 PM",
      "Tuesday: 9:00 AM - 9:00 PM",
      "Wednesday: 9:00 AM - 9:00 PM",
      "Thursday: 9:00 AM - 9:00 PM",
      "Friday: 9:00 AM - 10:00 PM",
      "Saturday: 9:00 AM - 10:00 PM",
      "Sunday: 10:00 AM - 8:00 PM",
    ],
    latitude: 29.6935,
    longitude: -95.8801,
    placeId: "sample-place-id-2",
    categoryIndex: 1, // Retail
  },
  {
    name: "Fulshear Auto Repair",
    address: "789 Mechanic Ln, Fulshear, TX 77441",
    phoneNumber: "(281) 555-9012",
    website: "https://example.com/fulshear-auto",
    rating: 4.8,
    hours: [
      "Monday: 8:00 AM - 6:00 PM",
      "Tuesday: 8:00 AM - 6:00 PM",
      "Wednesday: 8:00 AM - 6:00 PM",
      "Thursday: 8:00 AM - 6:00 PM",
      "Friday: 8:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 3:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.6940,
    longitude: -95.8842,
    placeId: "sample-place-id-3",
    categoryIndex: 2, // Services
  },
  {
    name: "Fulshear Medical Center",
    address: "101 Health Blvd, Fulshear, TX 77441",
    phoneNumber: "(281) 555-3456",
    website: "https://example.com/fulshear-medical",
    rating: 4.6,
    hours: [
      "Monday: 8:00 AM - 8:00 PM",
      "Tuesday: 8:00 AM - 8:00 PM",
      "Wednesday: 8:00 AM - 8:00 PM",
      "Thursday: 8:00 AM - 8:00 PM",
      "Friday: 8:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 2:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.6922,
    longitude: -95.8812,
    placeId: "sample-place-id-4",
    categoryIndex: 3, // Healthcare
  },
  {
    name: "Fulshear Elementary School",
    address: "202 Education Way, Fulshear, TX 77441",
    phoneNumber: "(281) 555-7890",
    website: "https://example.com/fulshear-elementary",
    rating: 4.4,
    hours: [
      "Monday: 7:30 AM - 3:30 PM",
      "Tuesday: 7:30 AM - 3:30 PM",
      "Wednesday: 7:30 AM - 3:30 PM",
      "Thursday: 7:30 AM - 3:30 PM",
      "Friday: 7:30 AM - 3:30 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    latitude: 29.6950,
    longitude: -95.8830,
    placeId: "sample-place-id-5",
    categoryIndex: 4, // Education
  },
  {
    name: "Fulshear Cinema",
    address: "303 Movie St, Fulshear, TX 77441",
    phoneNumber: "(281) 555-0123",
    website: "https://example.com/fulshear-cinema",
    rating: 4.3,
    hours: [
      "Monday: 11:00 AM - 11:00 PM",
      "Tuesday: 11:00 AM - 11:00 PM",
      "Wednesday: 11:00 AM - 11:00 PM",
      "Thursday: 11:00 AM - 11:00 PM",
      "Friday: 11:00 AM - 1:00 AM",
      "Saturday: 10:00 AM - 1:00 AM",
      "Sunday: 10:00 AM - 11:00 PM",
    ],
    latitude: 29.6925,
    longitude: -95.8840,
    placeId: "sample-place-id-6",
    categoryIndex: 5, // Entertainment
  },
];

// Mutation to seed the database
export const seedDatabase = mutation({
  handler: async (ctx) => {
    // Add categories first
    const categoryIds = [];
    
    for (const category of categories) {
      const id = await ctx.db.insert("categories", {
        name: category.name,
        icon: category.icon,
      });
      categoryIds.push(id);
    }
    
    // Add businesses
    for (const business of businesses) {
      await ctx.db.insert("businesses", {
        name: business.name,
        address: business.address,
        phoneNumber: business.phoneNumber,
        website: business.website,
        categoryId: categoryIds[business.categoryIndex],
        rating: business.rating,
        hours: business.hours,
        latitude: business.latitude,
        longitude: business.longitude,
        placeId: business.placeId,
        lastUpdated: Date.now(),
      });
    }
    
    return {
      success: true,
      message: `Seeded ${categories.length} categories and ${businesses.length} businesses`,
    };
  },
}); 