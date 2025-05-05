import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all businesses
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

// List all businesses (alias for getAll, used by import script)
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

// Get businesses by category
export const getByCategory = query({
  args: { categoryId: v.union(v.id("categories"), v.null()) },
  handler: async (ctx, args) => {
    // If categoryId is null, return an empty array
    if (args.categoryId === null) {
      return [];
    }
    
    return await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
      .collect();
  },
});

// Search businesses by name
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    // If search term is empty, return all businesses
    if (!args.searchTerm.trim()) {
      return await ctx.db.query("businesses").collect();
    }
    
    const searchTerm = args.searchTerm.toLowerCase().trim();
    // Get all businesses and filter by name, address, or description
    const businesses = await ctx.db.query("businesses").collect();
    return businesses.filter((business) =>
      business.name.toLowerCase().includes(searchTerm) ||
      (business.address && business.address.toLowerCase().includes(searchTerm)) ||
      (business.description && business.description.toLowerCase().includes(searchTerm))
    );
  },
});

// Get a single business by ID
export const getById = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Delete a business by ID
export const deleteById = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Add a new business
export const add = mutation({
  args: { 
    business: v.object({
      name: v.string(),
      address: v.string(),
      phoneNumber: v.optional(v.string()),
      website: v.optional(v.string()),
      categoryId: v.id("categories"),
      rating: v.optional(v.number()),
      hours: v.optional(v.array(v.string())),
      latitude: v.number(),
      longitude: v.number(),
      placeId: v.string(),
      photos: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      lastUpdated: v.number(),
    }) 
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("businesses", args.business);
    return { id, success: true };
  },
}); 

// Update an existing business
export const update = mutation({
  args: {
    id: v.id("businesses"),
    updates: v.object({
      name: v.optional(v.string()),
      address: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      website: v.optional(v.string()),
      categoryId: v.optional(v.id("categories")),
      rating: v.optional(v.number()),
      hours: v.optional(v.array(v.string())),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
      photos: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      lastUpdated: v.optional(v.number()),
    })
  },
  handler: async (ctx, args) => {
    // Check if business exists
    const business = await ctx.db.get(args.id);
    if (!business) {
      return { 
        success: false, 
        message: "Business not found" 
      };
    }
    
    // Apply updates
    await ctx.db.patch(args.id, {
      ...args.updates,
      lastUpdated: args.updates.lastUpdated || Date.now(),
    });
    
    return { 
      success: true, 
      message: "Business updated successfully" 
    };
  },
}); 