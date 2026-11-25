import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { authComponent } from "./auth";

const STYLE_OPTIONS = ["Adventure", "Relaxation", "Family", "Culture"] as const;
const BUDGET_OPTIONS = [
  "All Budget",
  "Budget friendly",
  "Comfortable",
  "Luxury",
] as const;
const INTEREST_OPTIONS = [
  "Nature & Culture",
  "Beach & Relaxation",
  "Wildlife",
  "Heritage",
] as const;
const SEASON_OPTIONS = [
  "Flexible",
  "December – March",
  "April – June",
  "July – September",
  "October – November",
] as const;
const START_OPTIONS = ["Colombo", "Kandy", "Galle", "Ella"] as const;
const DURATION_OPTIONS = [3, 5, 7, 10, 14] as const;

const dayInputValidator = v.object({
  destinationId: v.id("destinations"),
  title: v.string(),
  description: v.string(),
  travelNote: v.string(),
  estimatedCost: v.number(),
});

function validateText(
  value: string,
  min: number,
  max: number,
  label: string
): string {
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new ConvexError(`${label} must be ${min}–${max} characters.`);
  }
  return trimmed;
}

function assertChoice<T extends readonly string[]>(
  value: string,
  options: T,
  label: string
): T[number] {
  if (!options.includes(value)) {
    throw new ConvexError(`Choose a valid ${label}.`);
  }
  return value as T[number];
}

function dailyEstimateForBudget(budget: string): number {
  if (budget === "Budget friendly") return 6500;
  if (budget === "Luxury") return 35000;
  return 15000;
}

function mapCategoryToTag(category: string): string {
  if (category === "Historical" || category === "Cultural") return "Heritage";
  return category;
}

async function getProfileByAuth(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) return null;
  const authSubject = String(user._id);
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_auth_subject", (q) => q.eq("authSubject", authSubject))
    .first();
  return { user, authSubject, profile };
}

async function getOrCreateProfile(ctx: MutationCtx) {
  const auth = await getProfileByAuth(ctx);
  if (!auth) {
    throw new ConvexError("Sign in or create an account to continue.");
  }
  if (auth.profile) return auth.profile;

  const profileId = await ctx.db.insert("profiles", {
    authSubject: auth.authSubject,
    displayName: auth.user.name || auth.user.email || "Traveller",
    email: auth.user.email || undefined,
    createdAt: Date.now(),
  });
  const created = await ctx.db.get("profiles", profileId);
  if (!created) {
    throw new ConvexError("Unable to initialize your traveller profile.");
  }
  return created;
}

function formatTrip(doc: Doc<"trips">) {
  const duration =
    doc.duration ??
    Math.max(
      1,
      Math.round((doc.endDate - doc.startDate) / (24 * 60 * 60 * 1000)) || 3
    );
  return {
    id: String(doc._id),
    title: doc.title,
    style: doc.travelStyle ?? "Adventure",
    duration: String(duration),
    budget: doc.budgetTier ?? "All Budget",
    interests: doc.interests ?? "Nature & Culture",
    season: doc.season ?? "Flexible",
    travellers: doc.travelers ?? 1,
    startingPoint: doc.startingPoint ?? "Colombo",
    source: doc.source ?? "gemini",
    days: (doc.days ?? []).map((day) => ({
      destination: String(day.destinationId),
      title: day.title,
      description: day.description,
      travelNote: day.travelNote,
      estimatedCost: day.estimatedCost,
    })),
  };
}

async function syncItineraries(
  ctx: MutationCtx,
  tripId: Id<"trips">,
  startDate: number,
  days: Array<{
    destinationId: Id<"destinations">;
    title: string;
    description: string;
    travelNote: string;
    estimatedCost: number;
  }>
) {
  const existing = await ctx.db
    .query("itineraries")
    .withIndex("by_trip", (q) => q.eq("tripId", tripId))
    .take(30);
  for (const row of existing) {
    await ctx.db.delete("itineraries", row._id);
  }
  const now = Date.now();
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    await ctx.db.insert("itineraries", {
      tripId,
      dayNumber: i + 1,
      date: startDate + i * 24 * 60 * 60 * 1000,
      activities: [
        {
          time: "Full Day",
          title: day.title,
          description: day.description,
          destinationId: day.destinationId,
          estimatedCost: day.estimatedCost,
        },
      ],
      createdAt: now,
    });
  }
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const auth = await getProfileByAuth(ctx);
    if (!auth?.profile) return [];

    const trips = await ctx.db
      .query("trips")
      .withIndex("by_profile", (q) => q.eq("profileId", auth.profile!._id))
      .order("desc")
      .take(100);

    return trips.map(formatTrip);
  },
});

export const checkAndRecordGeneration = mutation({
  args: {},
  handler: async (ctx) => {
    const profile = await getOrCreateProfile(ctx);
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const recent = await ctx.db
      .query("generationRequests")
      .withIndex("by_profile_and_created_at", (q) =>
        q.eq("profileId", profile._id).gt("createdAt", oneHourAgo)
      )
      .take(10);

    if (recent.length >= 5) {
      throw new ConvexError(
        "You have reached 5 generation attempts this hour. Please try again later."
      );
    }

    await ctx.db.insert("generationRequests", {
      profileId: profile._id,
      createdAt: now,
    });

    return { allowed: true };
  },
});

export const createTrip = mutation({
  args: {
    title: v.string(),
    style: v.string(),
    duration: v.number(),
    budget: v.string(),
    interests: v.string(),
    season: v.string(),
    travellers: v.number(),
    startingPoint: v.string(),
    source: v.union(v.literal("gemini"), v.literal("manual")),
    days: v.array(dayInputValidator),
  },
  handler: async (ctx, args) => {
    const profile = await getOrCreateProfile(ctx);

    if (!DURATION_OPTIONS.includes(args.duration as (typeof DURATION_OPTIONS)[number])) {
      throw new ConvexError("Choose a supported trip duration.");
    }
    if (!Number.isInteger(args.travellers) || args.travellers < 1 || args.travellers > 12) {
      throw new ConvexError("Choose 1–12 travellers.");
    }

    const style = assertChoice(args.style, STYLE_OPTIONS, "travel style");
    const budgetTier = assertChoice(args.budget, BUDGET_OPTIONS, "budget");
    const interests = assertChoice(args.interests, INTEREST_OPTIONS, "interest");
    const season = assertChoice(args.season, SEASON_OPTIONS, "season");
    const startingPoint = assertChoice(
      args.startingPoint,
      START_OPTIONS,
      "starting point"
    );
    const title = validateText(args.title, 2, 100, "Trip title");

    if (args.days.length !== args.duration) {
      throw new ConvexError("One itinerary entry per day is required.");
    }

    const validatedDays = [];
    let totalBudget = 0;
    for (const day of args.days) {
      const dest = await ctx.db.get("destinations", day.destinationId);
      if (!dest || !dest.isPublished) {
        throw new ConvexError("Itinerary references an unavailable destination.");
      }
      if (
        !Number.isFinite(day.estimatedCost) ||
        day.estimatedCost < 0 ||
        day.estimatedCost > 1000000
      ) {
        throw new ConvexError("Day estimated cost must be between 0 and 1,000,000.");
      }
      const estimatedCost = Math.round(day.estimatedCost);
      totalBudget += estimatedCost * args.travellers;
      validatedDays.push({
        destinationId: day.destinationId,
        title: validateText(day.title, 2, 120, "Day title"),
        description: validateText(day.description, 10, 2000, "Day description"),
        travelNote: validateText(day.travelNote || "Verify local transport.", 2, 500, "Travel note"),
        estimatedCost,
      });
    }

    const startDate = Date.now();
    const endDate = startDate + args.duration * 24 * 60 * 60 * 1000;

    const tripId = await ctx.db.insert("trips", {
      profileId: profile._id,
      title,
      startDate,
      endDate,
      travelers: args.travellers,
      budget: totalBudget,
      currency: "LKR",
      travelStyle: style,
      status: "planning",
      duration: args.duration,
      budgetTier,
      interests,
      season,
      startingPoint,
      source: args.source,
      days: validatedDays,
      createdAt: startDate,
    });

    await syncItineraries(ctx, tripId, startDate, validatedDays);

    const created = await ctx.db.get("trips", tripId);
    if (!created) {
      throw new ConvexError("Failed to save trip.");
    }
    return formatTrip(created);
  },
});

export const createManualTrip = mutation({
  args: {
    style: v.string(),
    duration: v.number(),
    budget: v.string(),
    interests: v.string(),
    season: v.string(),
    travellers: v.number(),
    startingPoint: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await getOrCreateProfile(ctx);

    if (!DURATION_OPTIONS.includes(args.duration as (typeof DURATION_OPTIONS)[number])) {
      throw new ConvexError("Choose a supported trip duration.");
    }
    if (!Number.isInteger(args.travellers) || args.travellers < 1 || args.travellers > 12) {
      throw new ConvexError("Choose 1–12 travellers.");
    }

    const style = assertChoice(args.style, STYLE_OPTIONS, "travel style");
    const budgetTier = assertChoice(args.budget, BUDGET_OPTIONS, "budget");
    const interests = assertChoice(args.interests, INTEREST_OPTIONS, "interest");
    const season = assertChoice(args.season, SEASON_OPTIONS, "season");
    const startingPoint = assertChoice(
      args.startingPoint,
      START_OPTIONS,
      "starting point"
    );

    const allDestinations = (await ctx.db.query("destinations").take(100)).filter(
      (d) => d.isPublished
    );
    if (allDestinations.length === 0) {
      throw new ConvexError(
        "Destinations are being prepared. Please try again shortly."
      );
    }

    const targetTag =
      interests === "Beach & Relaxation"
        ? "Beach"
        : interests === "Heritage"
          ? "Heritage"
          : interests === "Wildlife"
            ? "Wildlife"
            : "Nature";

    const preferred = allDestinations.filter(
      (d) => mapCategoryToTag(d.category) === targetTag
    );
    const stops = preferred.length > 0 ? preferred : allDestinations;
    const dailyCost = dailyEstimateForBudget(budgetTier);

    const days = Array.from({ length: args.duration }, (_, i) => ({
      destinationId:
        stops[
          Math.min(
            stops.length - 1,
            Math.floor((i * stops.length) / args.duration)
          )
        ]._id,
      title: `Day ${i + 1}: Make it your own`,
      description:
        "Add your morning, afternoon, and evening activities here. Check local transport and opening times before travelling.",
      travelNote:
        "Manual planning template. Transfer details have not been verified.",
      estimatedCost: dailyCost,
    }));

    const startDate = Date.now();
    const endDate = startDate + args.duration * 24 * 60 * 60 * 1000;
    const totalBudget = dailyCost * args.duration * args.travellers;

    const tripId = await ctx.db.insert("trips", {
      profileId: profile._id,
      title: `${args.duration}-Day ${style} Plan`,
      startDate,
      endDate,
      travelers: args.travellers,
      budget: totalBudget,
      currency: "LKR",
      travelStyle: style,
      status: "planning",
      duration: args.duration,
      budgetTier,
      interests,
      season,
      startingPoint,
      source: "manual",
      days,
      createdAt: startDate,
    });

    await syncItineraries(ctx, tripId, startDate, days);

    const created = await ctx.db.get("trips", tripId);
    if (!created) {
      throw new ConvexError("Failed to create manual trip.");
    }
    return formatTrip(created);
  },
});

export const updateTrip = mutation({
  args: {
    id: v.id("trips"),
    title: v.string(),
    days: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const profile = await getOrCreateProfile(ctx);
    const existing = await ctx.db.get("trips", args.id);
    if (!existing || existing.profileId !== profile._id) {
      throw new ConvexError(
        "Unable to update this trip. Check your entries and account access."
      );
    }

    const title = validateText(args.title, 2, 100, "Trip title");
    const existingDays = existing.days ?? [];

    let updatedDays = existingDays;
    if (args.days !== undefined) {
      if (args.days.length !== existingDays.length) {
        throw new ConvexError(
          "Invalid request: preserve the number of itinerary days."
        );
      }
      updatedDays = existingDays.map((day, idx) => ({
        destinationId: day.destinationId,
        title: validateText(args.days![idx].title, 2, 120, "Day title"),
        description: validateText(
          args.days![idx].description,
          10,
          2000,
          "Day description"
        ),
        travelNote: day.travelNote,
        estimatedCost: day.estimatedCost,
      }));
    }

    await ctx.db.patch("trips", args.id, {
      title,
      days: updatedDays,
    });

    await syncItineraries(ctx, args.id, existing.startDate, updatedDays);

    const updated = await ctx.db.get("trips", args.id);
    if (!updated) {
      throw new ConvexError("Trip not found after update.");
    }
    return formatTrip(updated);
  },
});

export const deleteTrip = mutation({
  args: {
    id: v.id("trips"),
  },
  handler: async (ctx, args) => {
    const profile = await getOrCreateProfile(ctx);
    const existing = await ctx.db.get("trips", args.id);
    if (!existing || existing.profileId !== profile._id) {
      throw new ConvexError("Unable to delete this trip.");
    }

    const itineraries = await ctx.db
      .query("itineraries")
      .withIndex("by_trip", (q) => q.eq("tripId", args.id))
      .take(30);
    for (const row of itineraries) {
      await ctx.db.delete("itineraries", row._id);
    }

    await ctx.db.delete("trips", args.id);
    return { success: true };
  },
});
