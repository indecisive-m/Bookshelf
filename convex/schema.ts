import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    id: v.id("users"),
    isbn: v.string(),
    bookshelf: v.optional(v.string()),
  }).index("by_bookshelf", ["bookshelf"]),

  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
