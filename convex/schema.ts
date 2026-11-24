
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles
  profiles: defineTable({
    authSubject: v.string(),
    displayName: v.string(),
    email: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_auth_subject", ["authSubject"]),

  // Sri Lankan tourist destinations
  destinations: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    province: v.string(),
    district: v.string(),
    category: v.string(),
    images: v.array(v.string()),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    bestTimeToVisit: v.string(),
    estimatedDailyBudget: v.number(),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_district", ["district"])
    .index("by_category", ["category"]),

  // User trips
  trips: defineTable({
    profileId: v.id("profiles"),
    title: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    travelers: v.number(),
    budget: v.number(),
    currency: v.union(v.literal("LKR"), v.literal("USD")),
    travelStyle: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("confirmed"),
      v.literal("completed")
    ),
    createdAt: v.number(),
  }).index("by_profile", ["profileId"]),

  // Day-by-day trip activities
  itineraries: defineTable({
    tripId: v.id("trips"),
    dayNumber: v.number(),
    date: v.number(),
    activities: v.array(
      v.object({
        time: v.string(),
        title: v.string(),
        description: v.string(),
        destinationId: v.optional(v.id("destinations")),
        estimatedCost: v.optional(v.number()),
      })
    ),
    createdAt: v.number(),
  }).index("by_trip", ["tripId"]),

  // Favorite destinations
  favorites: defineTable({
    profileId: v.id("profiles"),
    destinationId: v.id("destinations"),
    createdAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_destination", ["destinationId"])
    .index("by_profile_and_destination", [
      "profileId",
      "destinationId",
    ]),

  // Destination reviews
  reviews: defineTable({
    profileId: v.id("profiles"),
    destinationId: v.id("destinations"),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_destination", ["destinationId"])
    .index("by_profile", ["profileId"]),
});
