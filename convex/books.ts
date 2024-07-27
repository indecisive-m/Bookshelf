import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
    id: v.id("users"),
    bookshelf: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    // const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    // if (!userId) {
    //   throw new ConvexError("User not authenticated");
    // }

    const userId: Id<"users"> = user._id;

    if (!args.bookshelf) {
      args.bookshelf = "default";
    }

    return ctx.db.insert("books", {
      bookshelf: args.bookshelf,
      id: userId,
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

    return ctx.db.query("books").collect();
  },
});
