import { ConvexError, v } from "convex/values";
import { action, mutation, query, QueryCtx } from "./_generated/server";

const getCurrentUser = async (ctx: QueryCtx, externalId: string) => {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
};

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
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("Unauthenicated Call");
    }

    const user = await getCurrentUser(ctx, userIdentity.subject);

    if (!user) {
      throw new ConvexError("Unauthenticated Call");
    }

    if (!args.bookshelf) {
      args.bookshelf = "default";
    }

    return ctx.db.insert("books", {
      bookshelf: args.bookshelf,
      isbn: args.isbn,
      user: user._id,
    });
  },
});

export const getAllBooksFromDB = query({
  args: {},
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await getCurrentUser(ctx, userIdentity.subject);

    if (!user) {
      throw new ConvexError("Unauthenticated Call");
    }

    return ctx.db.query("books").collect();
  },
});
