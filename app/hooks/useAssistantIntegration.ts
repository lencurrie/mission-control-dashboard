// Integration hooks for capturing assistant actions
// These functions can be called from the main AI assistant code

import { useActivityLogger } from "./useActivityLogger";
import { useTaskManager } from "./useTaskManager";
import { useSearchIndex } from "./useSearchIndex";

// Re-export all hooks for convenience
export { useActivityLogger, useTaskManager, useSearchIndex };

// Types for logger functions
type LogToolCallFn = (
  toolName: string,
  description: string,
  options?: {
    status?: "success" | "error" | "pending";
    agentId?: string;
    metadata?: any;
  }
) => Promise<any>;

type LogFileOperationFn = (
  operation: string,
  filePath: string,
  options?: {
    status?: "success" | "error" | "pending";
    agentId?: string;
    metadata?: any;
  }
) => Promise<any>;

type LogActivityFn = (
  activity: {
    actionType: string;
    description: string;
    status?: "success" | "error" | "pending";
    agentId?: string;
    metadata?: any;
  }
) => Promise<any>;

// Helper to wrap tool calls with logging
// Must be called from within a React component or hook
export function withActivityLogging<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    toolName: string;
    description: string;
    agentId?: string;
    logToolCall: LogToolCallFn;
  }
): T {
  return (async (...args: any[]) => {
    // Log the start of the tool call
    await options.logToolCall(options.toolName, options.description, {
      status: "pending",
      agentId: options.agentId,
    });

    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      
      // Log success
      await options.logToolCall(options.toolName, `${options.description} - Success`, {
        status: "success",
        agentId: options.agentId,
        metadata: { duration },
      });
      
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Log error
      await options.logToolCall(options.toolName, `${options.description} - Failed`, {
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
// Must be called from within a React component or hook
export function withFileLogging<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    operation: string;
    getPath: (...args: any[]) => string;
    agentId?: string;
    logFileOperation: LogFileOperationFn;
  }
): T {
  return (async (...args: any[]) => {
    const filePath = options.getPath(...args);
    
    try {
      const result = await fn(...args);
      
      await options.logFileOperation(options.operation, filePath, {
        status: "success",
        agentId: options.agentId,
      });
      
      return result;
    } catch (error: any) {
      await options.logFileOperation(options.operation, filePath, {
        status: "error",
        agentId: options.agentId,
        metadata: { errorMessage: error.message },
      });
      
      throw error;
    }
  }) as T;
}

// Batch log multiple activities
// Must be called from within a React component or hook
export async function batchLogActivities(
  activities: Array<{
    actionType: string;
    description: string;
    status?: "success" | "error" | "pending";
    metadata?: any;
  }>,
  agentId: string,
  logActivity: LogActivityFn
) {
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
