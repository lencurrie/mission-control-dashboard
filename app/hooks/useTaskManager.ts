import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback } from "react";

interface TaskCreateOptions {
  name: string;
  description?: string;
  scheduledTime: number;
  recurrencePattern?: string;
  priority?: "low" | "medium" | "high";
  metadata?: {
    command?: string;
    targetChannel?: string;
    payload?: string;
  };
}

interface TaskUpdateOptions {
  name?: string;
  description?: string;
  scheduledTime?: number;
  recurrencePattern?: string;
  status?: "pending" | "running" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high";
}

export function useTaskManager() {
  const createTaskMutation = useMutation(api.tasks.createTask);
  const updateTaskMutation = useMutation(api.tasks.updateTask);
  const deleteTaskMutation = useMutation(api.tasks.deleteTask);
  const completeTaskMutation = useMutation(api.tasks.completeTask);

  const createTask = useCallback(
    async (options: TaskCreateOptions) => {
      try {
        const taskId = await createTaskMutation(options);
        return { success: true, taskId };
      } catch (error) {
        console.error("Failed to create task:", error);
        return { success: false, error };
      }
    },
    [createTaskMutation]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: TaskUpdateOptions) => {
      try {
        await updateTaskMutation({ taskId, updates });
        return { success: true };
      } catch (error) {
        console.error("Failed to update task:", error);
        return { success: false, error };
      }
    },
    [updateTaskMutation]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        await deleteTaskMutation({ taskId });
        return { success: true };
      } catch (error) {
        console.error("Failed to delete task:", error);
        return { success: false, error };
      }
    },
    [deleteTaskMutation]
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      try {
        await completeTaskMutation({ taskId });
        return { success: true };
      } catch (error) {
        console.error("Failed to complete task:", error);
        return { success: false, error };
      }
    },
    [completeTaskMutation]
  );

  const createCronJob = useCallback(
    async (
      name: string,
      cronExpression: string,
      command: string,
      options?: Partial<TaskCreateOptions>
    ) => {
      // Parse cron expression to get next scheduled time
      // For simplicity, we'll use the current time + 1 hour as a placeholder
      const scheduledTime = Date.now() + 60 * 60 * 1000;

      return createTask({
        name,
        description: `Cron job: ${cronExpression}`,
        scheduledTime,
        recurrencePattern: cronExpression,
        priority: "medium",
        metadata: { command, ...options?.metadata },
        ...options,
      });
    },
    [createTask]
  );

  const createReminder = useCallback(
    async (
      name: string,
      scheduledTime: number,
      targetChannel?: string,
      options?: Partial<TaskCreateOptions>
    ) => {
      return createTask({
        name,
        description: `Reminder: ${name}`,
        scheduledTime,
        priority: "high",
        metadata: { targetChannel, ...options?.metadata },
        ...options,
      });
    },
    [createTask]
  );

  return {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    createCronJob,
    createReminder,
  };
}