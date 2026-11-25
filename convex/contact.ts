import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

const TOPICS = [
  "Trip planning",
  "Site feedback",
  "General question",
] as const;

export const submitMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    message: v.string(),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.website && args.website.trim().length > 0) {
      throw new ConvexError("Please leave the website field blank.");
    }

    const name = args.name.trim();
    if (name.length < 2 || name.length > 80) {
      throw new ConvexError("Name must be 2–80 characters.");
    }

    const email = args.email.trim().toLowerCase();
    if (email.length < 5 || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ConvexError("Enter a valid email address.");
    }

    if (!TOPICS.includes(args.topic as (typeof TOPICS)[number])) {
      throw new ConvexError("Choose a valid topic.");
    }

    const message = args.message.trim();
    if (message.length < 10 || message.length > 4000) {
      throw new ConvexError("Message must be 10–4000 characters.");
    }

    await ctx.db.insert("contactMessages", {
      name,
      email,
      topic: args.topic as (typeof TOPICS)[number],
      message,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
