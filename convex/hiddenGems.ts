import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", String(user._id)))
      .first();
    if (!profile) return [];

    return await ctx.db
      .query("hiddenGems")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .order("desc")
      .take(50);
  },
});

export const saveGem = mutation({
  args: {
    name: v.string(),
    region: v.string(),
    category: v.string(),
    whySpecial: v.string(),
    howToReach: v.string(),
    bestTime: v.string(),
    restTip: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Sign in to save hidden gems.");

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

    const existing = await ctx.db
      .query("hiddenGems")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .take(50);

    if (existing.some((g) => g.name.toLowerCase() === args.name.trim().toLowerCase())) {
      throw new ConvexError("This hidden gem is already saved to your account.");
    }

    return await ctx.db.insert("hiddenGems", {
      profileId: profile._id,
      name: args.name.trim().slice(0, 100),
      region: args.region.trim().slice(0, 80),
      category: args.category.trim().slice(0, 50),
      whySpecial: args.whySpecial.trim().slice(0, 600),
      howToReach: args.howToReach.trim().slice(0, 400),
      bestTime: args.bestTime.trim().slice(0, 120),
      restTip: args.restTip.trim().slice(0, 400),
      createdAt: Date.now(),
    });
  },
});

export const removeGem = mutation({
  args: { id: v.id("hiddenGems") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Sign in required.");
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_subject", (q) => q.eq("authSubject", String(user._id)))
      .first();
    if (!profile) throw new ConvexError("Profile unavailable.");

    const gem = await ctx.db.get("hiddenGems", args.id);
    if (!gem || gem.profileId !== profile._id) {
      throw new ConvexError("Hidden gem not found.");
    }
    await ctx.db.delete("hiddenGems", args.id);
    return { success: true };
  },
});
