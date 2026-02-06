"use client";

import { useState } from "react";
import { useTaskManager } from "../../hooks/useTaskManager";
import { X, Plus, Clock, Repeat, AlertCircle } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export function CreateTaskModal({ isOpen, onClose, initialDate }: CreateTaskModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState(
    initialDate
      ? new Date(initialDate.getTime() - initialDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : ""
  );
  const [recurrencePattern, setRecurrencePattern] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [command, setCommand] = useState("");
  
  const { createTask } = useTaskManager();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createTask({
      name,
      description: description || undefined,
      scheduledTime: new Date(scheduledTime).getTime(),
      recurrencePattern: recurrencePattern || undefined,
      priority,
      metadata: command ? { command } : undefined,
    });

    if (result.success) {
      onClose();
      // Reset form
      setName("");
      setDescription("");
      setScheduledTime("");
      setRecurrencePattern("");
      setPriority("medium");
      setCommand("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter task name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Optional description"
            />
          </div>

          {/* Scheduled Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Scheduled Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Recurrence Pattern */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Repeat className="w-4 h-4 inline mr-1" />
              Recurrence Pattern
            </label>
            <select
              value={recurrencePattern}
              onChange={(e) => setRecurrencePattern(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">One-time task</option>
              <option value="0 * * * *">Every hour</option>
              <option value="0 */6 * * *">Every 6 hours</option>
              <option value="0 0 * * *">Daily</option>
              <option value="0 0 * * 1">Weekly (Monday)</option>
              <option value="0 0 1 * *">Monthly</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Priority
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                    priority === p
                      ? p === "high"
                        ? "bg-red-100 text-red-800 border-2 border-red-300"
                        : p === "medium"
                        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                        : "bg-blue-100 text-blue-800 border-2 border-blue-300"
                      : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Command */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Command to Execute
            </label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., send_reminder, heartbeat_check"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}