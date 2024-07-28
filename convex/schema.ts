import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    isbn: v.string(),
    bookshelf: v.optional(v.string()),
    user: v.string(),
    bookTitle: v.string(),
    authorsNames: v.array(v.string()),
    firstPublishYear: v.number(),
    firstSentence: v.string(),
    averageRating: v.number(),
    userRating: v.optional(v.string()),
    comment: v.optional(v.string()),
    finishedReading: v.boolean(),
  })
    .index("by_bookshelf", ["bookshelf"])
    .index("by_isbn", ["isbn"]),

  users: defineTable({
    name: v.string(),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
