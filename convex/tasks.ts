import { ConvexError, v } from "convex/values";
import { mutation, query } from "../convex/_generated/server";

export const get = query({
  args: {
    shelf: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.email;

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_email", (q) => q.eq("email", userId))
      .filter((q) => q.eq(q.field("shelf"), args.shelf))
      .collect();
  },
});

export const getShelves = query({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.email;

    if (!userId) {
      return [];
    }

    const table = await ctx.db
      .query("tasks")
      .withIndex("by_email", (q) => q.eq("email", userId))
      .collect();

    const shelfSet: Set<string | undefined> = new Set();

    table.map((table) => {
      shelfSet.add(table.shelf);
    });

    const shelves = Array.from(shelfSet);

    return shelves;
  },
});

export const submitTask = mutation({
  args: {
    task: v.string(),
    shelf: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.email;

    if (!userId) {
      throw new ConvexError("User ID not found");
    }

    if (!args.shelf) {
      args.shelf = "default";
    }

    return await ctx.db.insert("tasks", {
      task: args.task,
      email: userId,
      shelf: args.shelf,
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
