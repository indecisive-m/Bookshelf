import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    isbn: v.string(),
    bookshelf: v.optional(v.string()),
    user: v.string(),
  }).index("by_bookshelf", ["bookshelf"]),

  users: defineTable({
    name: v.string(),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
