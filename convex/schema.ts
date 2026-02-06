import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Activity Feed - records every action the AI assistant takes
  activities: defineTable({
    timestamp: v.number(), // Unix timestamp
    actionType: v.string(), // tool_call, file_operation, message_sent, task_completed, etc.
    description: v.string(),
    status: v.string(), // success, error, pending
    metadata: v.optional(v.object({
      toolName: v.optional(v.string()),
      filePath: v.optional(v.string()),
      channel: v.optional(v.string()),
      duration: v.optional(v.number()),
      errorMessage: v.optional(v.string()),
    })),
    sessionId: v.optional(v.string()),
    agentId: v.string(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_action_type", ["actionType"])
    .index("by_status", ["status"])
    .index("by_session", ["sessionId"]),

  // Scheduled Tasks - cron jobs, reminders, future events
  tasks: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    scheduledTime: v.number(), // Unix timestamp
    recurrencePattern: v.optional(v.string()), // cron expression or "daily", "weekly", etc.
    status: v.string(), // pending, running, completed, cancelled
    priority: v.optional(v.string()), // low, medium, high
    metadata: v.optional(v.object({
      command: v.optional(v.string()),
      targetChannel: v.optional(v.string()),
      payload: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_scheduled_time", ["scheduledTime"])
    .index("by_status", ["status"])
    .index("by_recurrence", ["recurrencePattern"]),

  // Search Index - for global search functionality
  searchIndex: defineTable({
    content: v.string(),
    contentType: v.string(), // memory_file, workspace_doc, activity, task
    title: v.string(),
    path: v.optional(v.string()),
    referenceId: v.optional(v.string()), // ID of the referenced document
    tags: v.optional(v.array(v.string())),
    lastModified: v.number(),
    relevanceScore: v.optional(v.number()),
  })
    .index("by_content_type", ["contentType"])
    .index("by_last_modified", ["lastModified"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["contentType", "tags"],
    }),

  // System settings and configuration
  systemConfig: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});