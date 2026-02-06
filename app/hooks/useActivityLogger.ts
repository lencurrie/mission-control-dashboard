import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback } from "react";

interface ActivityLogOptions {
  actionType: string;
  description: string;
  status?: "success" | "error" | "pending";
  metadata?: {
    toolName?: string;
    filePath?: string;
    channel?: string;
    duration?: number;
    errorMessage?: string;
  };
  sessionId?: string;
  agentId?: string;
}

export function useActivityLogger() {
  const logActivityMutation = useMutation(api.activities.logActivity);

  const logActivity = useCallback(
    async (options: ActivityLogOptions) => {
      try {
        const activityId = await logActivityMutation({
          actionType: options.actionType,
          description: options.description,
          status: options.status || "success",
          metadata: options.metadata,
          sessionId: options.sessionId,
          agentId: options.agentId || "default-agent",
        });
        return { success: true, activityId };
      } catch (error) {
        console.error("Failed to log activity:", error);
        return { success: false, error };
      }
    },
    [logActivityMutation]
  );

  const logToolCall = useCallback(
    async (toolName: string, description: string, options?: Partial<ActivityLogOptions>) => {
      return logActivity({
        actionType: "tool_call",
        description,
        metadata: { toolName, ...options?.metadata },
        ...options,
      });
    },
    [logActivity]
  );

  const logFileOperation = useCallback(
    async (operation: string, filePath: string, options?: Partial<ActivityLogOptions>) => {
      return logActivity({
        actionType: "file_operation",
        description: `${operation}: ${filePath}`,
        metadata: { filePath, ...options?.metadata },
        ...options,
      });
    },
    [logActivity]
  );

  const logMessageSent = useCallback(
    async (channel: string, description: string, options?: Partial<ActivityLogOptions>) => {
      return logActivity({
        actionType: "message_sent",
        description,
        metadata: { channel, ...options?.metadata },
        ...options,
      });
    },
    [logActivity]
  );

  const logTaskCompleted = useCallback(
    async (taskName: string, options?: Partial<ActivityLogOptions>) => {
      return logActivity({
        actionType: "task_completed",
        description: `Completed task: ${taskName}`,
        ...options,
      });
    },
    [logActivity]
  );

  const logError = useCallback(
    async (description: string, errorMessage: string, options?: Partial<ActivityLogOptions>) => {
      return logActivity({
        actionType: options?.actionType || "error",
        description,
        status: "error",
        metadata: { errorMessage, ...options?.metadata },
        ...options,
      });
    },
    [logActivity]
  );

  return {
    logActivity,
    logToolCall,
    logFileOperation,
    logMessageSent,
    logTaskCompleted,
    logError,
  };
}