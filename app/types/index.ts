export interface Activity {
  _id: string;
  timestamp: number;
  actionType: "tool_call" | "file_operation" | "message_sent" | "task_completed" | "error";
  description: string;
  status: "success" | "error" | "pending";
  metadata?: {
    toolName?: string;
    filePath?: string;
    channel?: string;
    duration?: number;
    errorMessage?: string;
  };
  sessionId?: string;
  agentId: string;
}

export interface Task {
  _id: string;
  name: string;
  description?: string;
  scheduledTime: number;
  recurrencePattern?: string;
  status: "pending" | "running" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high";
  metadata?: {
    command?: string;
    targetChannel?: string;
    payload?: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface SearchResult {
  _id: string;
  content: string;
  contentType: "memory_file" | "workspace_doc" | "activity" | "task";
  title: string;
  path?: string;
  referenceId?: string;
  tags?: string[];
  lastModified: number;
  relevanceScore?: number;
}

export interface ActivityStats {
  totalActivities: number;
  last24Hours: number;
  lastWeek: number;
  actionTypeCounts: Record<string, number>;
  statusCounts: Record<string, number>;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  running: number;
  overdue: number;
}

export interface SearchStats {
  totalIndexed: number;
  byType: Record<string, number>;
}