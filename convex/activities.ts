import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query to get paginated activities
export const getActivities = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    actionType: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    let queryBuilder = ctx.db.query("activities").order("desc");
    
    if (args.actionType) {
      queryBuilder = queryBuilder.withIndex("by_action_type", (q) =>
        q.eq("actionType", args.actionType)
      );
    }
    
    if (args.status) {
      queryBuilder = queryBuilder.withIndex("by_status", (q) =>
        q.eq("status", args.status)
      );
    }

    const activities = await queryBuilder.take(limit);
    
    return {
      activities,
      nextCursor: activities.length === limit 
        ? activities[activities.length - 1]._id 
        : null,
    };
  },
});

// Query to get activities by time range
export const getActivitiesByRange = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activities")
      .withIndex("by_timestamp", (q) =>
        q.gte("timestamp", args.startTime).lte("timestamp", args.endTime)
      )
      .order("desc")
      .take(100);
  },
});

// Mutation to log a new activity
export const logActivity = mutation({
  args: {
    actionType: v.string(),
    description: v.string(),
    status: v.string(),
    metadata: v.optional(v.object({
      toolName: v.optional(v.string()),
      filePath: v.optional(v.string()),
      channel: v.optional(v.string()),
      duration: v.optional(v.number()),
      errorMessage: v.optional(v.string()),
    })),
    sessionId: v.optional(v.string()),
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      timestamp: Date.now(),
      ...args,
    });

    // Also add to search index for global search
    await ctx.db.insert("searchIndex", {
      content: `${args.actionType}: ${args.description}`,
      contentType: "activity",
      title: args.actionType,
      referenceId: activityId,
      lastModified: Date.now(),
    });

    return activityId;
  },
});

// Mutation to update activity status
export const updateActivityStatus = mutation({
  args: {
    activityId: v.id("activities"),
    status: v.string(),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.activityId, {
      status: args.status,
      ...(args.errorMessage && {
        metadata: { errorMessage: args.errorMessage },
      }),
    });
  },
});

// Get activity statistics
export const getActivityStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const allActivities = await ctx.db.query("activities").collect();
    
    const last24Hours = allActivities.filter(a => a.timestamp > oneDayAgo);
    const lastWeek = allActivities.filter(a => a.timestamp > oneWeekAgo);

    const actionTypeCounts = allActivities.reduce((acc, activity) => {
      acc[activity.actionType] = (acc[activity.actionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusCounts = allActivities.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActivities: allActivities.length,
      last24Hours: last24Hours.length,
      lastWeek: lastWeek.length,
      actionTypeCounts,
      statusCounts,
    };
  },
});