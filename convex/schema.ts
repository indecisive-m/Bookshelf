import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    task: v.string(),
    email: v.string(),
    shelf: v.optional(v.string()),
  }).index("by_email", ["email"]),

  books: defineTable({
    isbn: v.string(),
    email: v.string(),
    bookshelf: v.optional(v.string()),
  }).index("by_email", ["email"]),

  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
