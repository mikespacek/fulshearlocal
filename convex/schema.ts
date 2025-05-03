import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businesses: defineTable({
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
  }),

  categories: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
  }),
}); 