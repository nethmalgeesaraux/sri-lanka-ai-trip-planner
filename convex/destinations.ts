import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all published destinations
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("destinations").take(100);
    return rows.filter((d) => d.isPublished);
  },
});

// Get destination by slug
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("destinations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get destinations by district
export const getByDistrict = query({
  args: {
    district: v.string(),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("destinations")
      .withIndex("by_district", (q) =>
        q.eq("district", args.district)
      )
      .take(100);
    return rows.filter((d) => d.isPublished);
  },
});
