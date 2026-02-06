// Integration hooks for capturing assistant actions
// These functions can be called from the main AI assistant code

import { useActivityLogger } from "../app/hooks/useActivityLogger";
import { useTaskManager } from "../app/hooks/useTaskManager";
import { useSearchIndex } from "../app/hooks/useSearchIndex";

// Re-export all hooks for convenience
export { useActivityLogger, useTaskManager, useSearchIndex };

// Helper to wrap tool calls with logging
export function withActivityLogging<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    toolName: string;
    description: string;
    agentId?: string;
  }
): T {
  return (async (...args: any[]) => {
    const { logToolCall } = useActivityLogger();
    
    // Log the start of the tool call
    await logToolCall(options.toolName, options.description, {
      status: "pending",
      agentId: options.agentId,
    });

    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      
      // Log success
      await logToolCall(options.toolName, `${options.description} - Success`, {
        status: "success",
        agentId: options.agentId,
        metadata: { duration },
      });
      
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Log error
      await logToolCall(options.toolName, `${options.description} - Failed`, {
        status: "error",
        agentId: options.agentId,
        metadata: { 
          duration,
          errorMessage: error.message,
        },
      });
      
      throw error;
    }
  }) as T;
}

// Helper to wrap file operations with logging
export function withFileLogging<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    operation: string;
    getPath: (...args: any[]) => string;
    agentId?: string;
  }
): T {
  return (async (...args: any[]) => {
    const { logFileOperation } = useActivityLogger();
    const filePath = options.getPath(...args);
    
    try {
      const result = await fn(...args);
      
      await logFileOperation(options.operation, filePath, {
        status: "success",
        agentId: options.agentId,
      });
      
      return result;
    } catch (error: any) {
      await logFileOperation(options.operation, filePath, {
        status: "error",
        agentId: options.agentId,
        metadata: { errorMessage: error.message },
      });
      
      throw error;
    }
  }) as T;
}

// Batch log multiple activities
export async function batchLogActivities(
  activities: Array<{
    actionType: string;
    description: string;
    status?: "success" | "error" | "pending";
    metadata?: any;
  }>,
  agentId: string
) {
  const { logActivity } = useActivityLogger();
  
  const results = [];
  for (const activity of activities) {
    const result = await logActivity({
      ...activity,
      agentId,
    });
    results.push(result);
  }
  
  return results;
}