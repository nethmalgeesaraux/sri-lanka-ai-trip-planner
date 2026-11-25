
import {
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";

import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";

import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

// Initialize Better Auth component
export const authComponent =
  createClient<DataModel>(components.betterAuth);

// Create authentication instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: process.env.SITE_URL!,

    database: authComponent.adapter(ctx),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    plugins: [
      convex({ authConfig }),
    ],
  });
};

// Get currently logged-in user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});
