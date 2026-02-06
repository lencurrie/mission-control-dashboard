import { DashboardLayout } from "./components/DashboardLayout";
import { ActivityFeed } from "./components/ActivityFeed";
import { CalendarWeekView } from "./components/CalendarWeekView";
import { GlobalSearch } from "./components/GlobalSearch";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  Activity,
  Calendar,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const activityStats = useQuery(api.activities.getActivityStats);
  const taskStats = useQuery(api.tasks.getTaskStats);

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

        {/* Global Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <GlobalSearch />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Activities"
            value={activityStats?.totalActivities || 0}
            subtitle={`${activityStats?.last24Hours || 0} in last 24h`}
            icon={<Activity className="w-5 h-5 text-blue-500" />}
            color="blue"
          />
          <StatCard
            title="Pending Tasks"
            value={taskStats?.pending || 0}
            subtitle={`${taskStats?.overdue || 0} overdue`}
            icon={<Clock className="w-5 h-5 text-yellow-500" />}
            color="yellow"
          />
          <StatCard
            title="Completed Tasks"
            value={taskStats?.completed || 0}
            subtitle={`${taskStats?.total || 0} total`}
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
            color="green"
          />
          <StatCard
            title="Running Tasks"
            value={taskStats?.running || 0}
            subtitle="Currently active"
            icon={<AlertCircle className="w-5 h-5 text-purple-500" />}
            color="purple"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500" />
                Recent Activity
              </h2>
              <a
                href="/activity"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </a>
            </div>
            <ActivityFeed limit={5} />
          </div>

          {/* Calendar Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                This Week
              </h2>
              <a
                href="/calendar"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Full Calendar
              </a>
            </div>
            <CalendarWeekView />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
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