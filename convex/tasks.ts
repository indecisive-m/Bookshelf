import { v } from "convex/values";
import { mutation, query } from "../convex/_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const submitTask = mutation({
  args: {
    task: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      task: args.task,
    });
  },
});
