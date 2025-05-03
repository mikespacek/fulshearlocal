import { query } from "./_generated/server";

// Get all categories
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
}); 