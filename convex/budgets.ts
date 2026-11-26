import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const CATEGORIES = ["Stay", "Transport", "Food", "Activities", "Other"] as const;

export const listByTrip = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", String(user._id)))
      .first();
    if (!profile) return [];

    const trip = await ctx.db.get("trips", args.tripId);
    if (!trip || trip.profileId !== profile._id) return [];

    return await ctx.db
      .query("tripExpenses")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .order("desc")
      .take(100);
  },
});

export const addExpense = mutation({
  args: {
    tripId: v.id("trips"),
    title: v.string(),
    category: v.string(),
    amount: v.number(),
    dayNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Sign in to track trip expenses.");

    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", String(user._id)))
      .first();

    if (!profile) {
      const id = await ctx.db.insert("profiles", {
        authSubject: String(user._id),
        displayName: user.name || user.email || "Traveller",
        email: user.email || undefined,
        createdAt: Date.now(),
      });
      profile = await ctx.db.get("profiles", id);
    }
    if (!profile) throw new ConvexError("Profile unavailable.");

    const trip = await ctx.db.get("trips", args.tripId);
    if (!trip || trip.profileId !== profile._id) {
      throw new ConvexError("Trip not found or access denied.");
    }

    const title = args.title.trim();
    if (title.length < 2 || title.length > 80) {
      throw new ConvexError("Expense title must be 2–80 characters.");
    }
    if (!CATEGORIES.includes(args.category as (typeof CATEGORIES)[number])) {
      throw new ConvexError("Choose a valid expense category.");
    }
    if (!Number.isFinite(args.amount) || args.amount <= 0 || args.amount > 5000000) {
      throw new ConvexError("Enter a valid LKR amount.");
    }

    return await ctx.db.insert("tripExpenses", {
      profileId: profile._id,
      tripId: args.tripId,
      title,
      category: args.category as (typeof CATEGORIES)[number],
      amount: Math.round(args.amount),
      dayNumber: args.dayNumber,
      createdAt: Date.now(),
    });
  },
});

export const deleteExpense = mutation({
  args: { id: v.id("tripExpenses") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Sign in required.");
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", String(user._id)))
      .first();
    if (!profile) throw new ConvexError("Profile unavailable.");

    const existing = await ctx.db.get("tripExpenses", args.id);
    if (!existing || existing.profileId !== profile._id) {
      throw new ConvexError("Expense not found.");
    }
    await ctx.db.delete("tripExpenses", args.id);
    return { success: true };
  },
});
