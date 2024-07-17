import { ConvexError, jsonToConvex, v } from "convex/values";
import { mutation, query } from "../convex/_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.email;

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_email", (q) => q.eq("email", userId))
      .collect();
  },
});

export const submitTask = mutation({
  args: {
    task: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.email;

    if (!userId) {
      throw new ConvexError("User ID not found");
    }
    return await ctx.db.insert("tasks", {
      task: args.task,
      email: userId,
    });
  },
});

export const removeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.delete(args.taskId);
  },
});
