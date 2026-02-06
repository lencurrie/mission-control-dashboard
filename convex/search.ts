import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Search across all indexed content
export const search = query({
  args: {
    query: v.string(),
    contentTypes: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    // Use Convex's built-in full-text search
    const results = await ctx.db
      .query("searchIndex")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.query)
      )
      .take(limit);

    // Filter by content type if specified
    const filteredResults = args.contentTypes
      ? results.filter(r => args.contentTypes!.includes(r.contentType))
      : results;

    // Add relevance scoring
    const scoredResults = filteredResults.map(result => ({
      ...result,
      relevanceScore: calculateRelevance(args.query, result),
    }));

    // Sort by relevance
    scoredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return scoredResults;
  },
});

// Get recent items for a content type
export const getRecent = query({
  args: {
    contentType: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("searchIndex")
      .withIndex("by_content_type", (q) =>
        q.eq("contentType", args.contentType)
      )
      .order("desc")
      .take(args.limit ?? 10);
  },
});

// Index memory file content
export const indexMemoryFile = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    path: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("searchIndex")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        lastModified: Date.now(),
        tags: args.tags,
      });
      return existing._id;
    }

    return await ctx.db.insert("searchIndex", {
      content: args.content,
      contentType: "memory_file",
      title: args.title,
      path: args.path,
      tags: args.tags || [],
      lastModified: Date.now(),
    });
  },
});

// Index workspace document
export const indexWorkspaceDoc = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    path: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("searchIndex")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        lastModified: Date.now(),
        tags: args.tags,
      });
      return existing._id;
    }

    return await ctx.db.insert("searchIndex", {
      content: args.content,
      contentType: "workspace_doc",
      title: args.title,
      path: args.path,
      tags: args.tags || [],
      lastModified: Date.now(),
    });
  },
});

// Remove from search index
export const removeFromIndex = mutation({
  args: {
    path: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("searchIndex")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// Get search statistics
export const getSearchStats = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db.query("searchIndex").collect();

    const byType = allItems.reduce((acc, item) => {
      acc[item.contentType] = (acc[item.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIndexed: allItems.length,
      byType,
    };
  },
});

// Helper function to calculate relevance score
function calculateRelevance(query: string, result: any): number {
  const queryLower = query.toLowerCase();
  const contentLower = result.content.toLowerCase();
  const titleLower = result.title.toLowerCase();

  let score = 0;

  // Exact title match
  if (titleLower === queryLower) score += 100;
  // Title contains query
  else if (titleLower.includes(queryLower)) score += 50;

  // Content contains query
  if (contentLower.includes(queryLower)) {
    // More occurrences = higher score
    const occurrences = contentLower.split(queryLower).length - 1;
    score += occurrences * 10;

    // Earlier occurrence = higher score
    const firstIndex = contentLower.indexOf(queryLower);
    if (firstIndex >= 0) {
      score += Math.max(0, 100 - firstIndex / 10);
    }
  }

  // Boost for recent content
  const age = Date.now() - result.lastModified;
  const daysOld = age / (1000 * 60 * 60 * 24);
  score += Math.max(0, 20 - daysOld);

  return score;
}