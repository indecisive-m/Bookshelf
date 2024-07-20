import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const fetchBookInfoFromOpenLibaryWithISBN = action({
  args: {
    isbn: v.string(),
  },
  handler: async (ctx, args) => {
    const data = await fetch(
      `https://openlibrary.org/search.json?isbn=${args.isbn}`
    );

    const result = await data.json();

    return result;
  },
});

export const addBookIntoDB = mutation({
  args: {
    isbn: v.string(),
    bookshelf: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.email;

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    if (!args.bookshelf) {
      args.bookshelf = "default";
    }

    return ctx.db.insert("books", {
      bookshelf: args.bookshelf,
      email: userId,
      isbn: args.isbn,
    });
  },
});

export const getAllBooksFromDB = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.email;

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    return ctx.db
      .query("books")
      .withIndex("by_email", (q) => q.eq("email", userId))
      .collect();
  },
});
