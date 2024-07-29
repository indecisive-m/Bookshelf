import { ConvexError, v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";

const getCurrentUser = async (ctx: QueryCtx, externalId: string) => {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
};

export const fetchBookInfoFromOpenLibaryWithISBN = action({
  args: {
    isbn: v.string(),
    bookshelf: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const data = await fetch(
      `https://openlibrary.org/search.json?isbn=${args.isbn}&fields=title,ratings_average,first_sentence,first_publish_year,author_name`
    );

    const result = await data.json();

    const bookResult = await result.docs[0];
    const bookshelf = args.bookshelf;
    const isbn = args.isbn;

    const authorsNames = await bookResult.author_name;
    const firstPublishYear = await bookResult.first_publish_year;
    const bookTitle = await bookResult.title;
    const averageRating = await bookResult.ratings_average;
    const firstSentence = await bookResult.first_sentence[0];

    await ctx.runMutation(internal.books.addBookIntoDB, {
      bookTitle,
      finishedReading: true,
      authorsNames,
      firstPublishYear,
      averageRating,
      firstSentence,
      bookshelf,
      isbn,
    });
  },
});

export const addBookIntoDB = internalMutation({
  args: {
    isbn: v.string(),
    bookshelf: v.optional(v.string()),
    bookTitle: v.string(),
    authorsNames: v.array(v.string()),
    firstPublishYear: v.number(),
    firstSentence: v.string(),
    averageRating: v.number(),
    userRating: v.optional(v.string()),
    comment: v.optional(v.string()),
    finishedReading: v.boolean(),
  },

  handler: async (ctx: MutationCtx, args) => {
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

    const insertIntoDB = await ctx.db.insert("books", {
      bookshelf: args.bookshelf,
      isbn: args.isbn,
      user: user._id,
      bookTitle: args.bookTitle,
      authorsNames: args.authorsNames,
      averageRating: args.averageRating,
      firstPublishYear: args.firstPublishYear,
      firstSentence: args.firstSentence,
      finishedReading: args.finishedReading,
    });

    return insertIntoDB;
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

export const getBookFromDBWIthIsbn = query({
  args: {
    isbn: v.string(),
  },

  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await getCurrentUser(ctx, userIdentity.subject);

    if (!user) {
      throw new ConvexError("Unauthenticated Call");
    }

    return ctx.db
      .query("books")
      .withIndex("by_isbn", (q) => q.eq("isbn", args.isbn))
      .collect();
  },
});

export const getAllBooksOnABookshelf = query({
  args: {
    bookshelf: v.string(),
  },

  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await getCurrentUser(ctx, userIdentity.subject);

    if (!user) {
      throw new ConvexError("Unauthenticated Call");
    }

    return ctx.db
      .query("books")
      .withIndex("by_bookshelf", (q) => q.eq("bookshelf", args.bookshelf))
      .collect();
  },
});

export const getListOfAllBookshelfs = query({
  args: {},
  handler: async (ctx) => {
    let shelves = new Set();
    const db = await ctx.db.query("books").collect();

    db.map((data) => shelves.add(data.bookshelf));

    const bookshelves = Array.from(shelves);

    return bookshelves;
  },
});
