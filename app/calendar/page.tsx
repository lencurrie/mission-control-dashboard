"use client";

import { DashboardLayout } from "../components/DashboardLayout";
import { Calendar, Clock, Plus } from "lucide-react";

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Calendar</h1>
            <p className="text-gray-600 mt-1">
              Schedule and manage your AI assistant tasks
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              The task calendar will be available once the Convex backend is configured.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Run <code className="bg-gray-100 px-1 py-0.5 rounded">npx convex dev</code> to enable</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-1">Create Reminders</h3>
            <p className="text-sm text-blue-700">Set up one-time or recurring reminders for important tasks</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-1">Schedule Jobs</h3>
            <p className="text-sm text-purple-700">Use cron expressions to automate recurring tasks</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-1">Track Progress</h3>
            <p className="text-sm text-green-700">Monitor task completion and view execution history</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
