import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({ task: v.string(), email: v.string() }).index(
    "by_email",
    ["email"]
  ),
});
