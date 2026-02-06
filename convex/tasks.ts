import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query to get all tasks
export const getTasks = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let queryBuilder = ctx.db.query("tasks").order("asc");

    if (args.status) {
      queryBuilder = queryBuilder.withIndex("by_status", (q) =>
        q.eq("status", args.status)
      );
    }

    if (args.startDate && args.endDate) {
      queryBuilder = queryBuilder.withIndex("by_scheduled_time", (q) =>
        q.gte("scheduledTime", args.startDate).lte("scheduledTime", args.endDate)
      );
    }

    return await queryBuilder.take(args.limit ?? 100);
  },
});

// Query to get tasks for a specific week
export const getWeekTasks = query({
  args: {
    weekStart: v.number(), // Unix timestamp of week start (Sunday)
  },
  handler: async (ctx, args) => {
    const weekEnd = args.weekStart + 7 * 24 * 60 * 60 * 1000;
    
    return await ctx.db
      .query("tasks")
      .withIndex("by_scheduled_time", (q) =>
        q.gte("scheduledTime", args.weekStart).lte("scheduledTime", weekEnd)
      )
      .order("asc")
      .collect();
  },
});

// Query to get upcoming tasks
export const getUpcomingTasks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db
      .query("tasks")
      .withIndex("by_scheduled_time", (q) =>
        q.gte("scheduledTime", now)
      )
      .order("asc")
      .take(args.limit ?? 10);
  },
});

// Mutation to create a new task
export const createTask = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    scheduledTime: v.number(),
    recurrencePattern: v.optional(v.string()),
    priority: v.optional(v.string()),
    metadata: v.optional(v.object({
      command: v.optional(v.string()),
      targetChannel: v.optional(v.string()),
      payload: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Add to search index
    await ctx.db.insert("searchIndex", {
      content: `${args.name}: ${args.description || ""} ${args.recurrencePattern || ""}`,
      contentType: "task",
      title: args.name,
      referenceId: taskId,
      lastModified: now,
    });

    return taskId;
  },
});

// Mutation to update a task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      scheduledTime: v.optional(v.number()),
      recurrencePattern: v.optional(v.string()),
      status: v.optional(v.string()),
      priority: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to delete a task
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

// Mutation to mark task as completed
export const completeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      status: "completed",
      updatedAt: Date.now(),
    });
  },
});

// Get task statistics
export const getTaskStats = query({
  args: {},
  handler: async (ctx) => {
    const allTasks = await ctx.db.query("tasks").collect();
    const now = Date.now();

    const pending = allTasks.filter(t => t.status === "pending").length;
    const completed = allTasks.filter(t => t.status === "completed").length;
    const running = allTasks.filter(t => t.status === "running").length;
    const overdue = allTasks.filter(t => t.status === "pending" && t.scheduledTime < now).length;

    return {
      total: allTasks.length,
      pending,
      completed,
      running,
      overdue,
    };
  },
});