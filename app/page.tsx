"use client";

import { DashboardLayout } from "./components/DashboardLayout";
import {
  Activity,
  Calendar,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Zap,
  Settings,
} from "lucide-react";

export default function Home() {
  // Mock data for static deployment
  const activityStats = {
    totalActivities: 0,
    last24Hours: 0,
  };
  
  const taskStats = {
    pending: 0,
    overdue: 0,
    completed: 0,
    total: 0,
    running: 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor AI assistant activities, scheduled tasks, and search across all data.
          </p>
        </div>

        {/* Global Search Placeholder */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 text-gray-400">
            <Search className="w-5 h-5" />
            <span>Search across memories, docs, activities, and tasks...</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Activities"
            value={activityStats.totalActivities}
            subtitle={`${activityStats.last24Hours} in last 24h`}
            icon={<Activity className="w-5 h-5 text-blue-500" />}
            color="blue"
          />
          <StatCard
            title="Pending Tasks"
            value={taskStats.pending}
            subtitle={`${taskStats.overdue} overdue`}
            icon={<Clock className="w-5 h-5 text-yellow-500" />}
            color="yellow"
          />
          <StatCard
            title="Completed Tasks"
            value={taskStats.completed}
            subtitle={`${taskStats.total} total`}
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
            color="green"
          />
          <StatCard
            title="Running Tasks"
            value={taskStats.running}
            subtitle="Currently active"
            icon={<AlertCircle className="w-5 h-5 text-purple-500" />}
            color="purple"
          />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Activity Tracking</h2>
                <p className="text-sm text-gray-500">Monitor AI assistant actions</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Track file operations, tool calls, task executions, and memory searches in real-time.
            </p>
            <a 
              href="/activity" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              View Activity Log →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Task Scheduling</h2>
                <p className="text-sm text-gray-500">Schedule and manage tasks</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Create reminders, schedule cron jobs, and manage recurring tasks with calendar view.
            </p>
            <a 
              href="/calendar" 
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
            >
              Open Calendar →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Global Search</h2>
                <p className="text-sm text-gray-500">Search across all data</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Find memories, documents, activities, and tasks with advanced filtering and relevance scoring.
            </p>
            <a 
              href="/search" 
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
            >
              Search Everything →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
                <p className="text-sm text-gray-500">View detailed metrics</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Analyze activity patterns, task completion rates, and system performance over time.
            </p>
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </h2>
          <p className="text-blue-100 mb-4">
            Common tasks to manage your AI assistant
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
              Create Reminder
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
              Schedule Cron Job
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
              Index Memory Files
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
              Export Activity Log
            </button>
          </div>
        </div>

        {/* Setup Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Backend Setup Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                To enable full functionality, configure your Convex backend by running{' '}
                <code className="bg-yellow-100 px-1 py-0.5 rounded">npx convex dev</code> and following the setup instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: "blue" | "yellow" | "green" | "purple";
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      </div>
    </div>
  );
}
