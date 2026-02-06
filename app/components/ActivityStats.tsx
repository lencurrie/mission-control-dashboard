"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Calendar,
} from "lucide-react";

export function ActivityStats() {
  const stats = useQuery(api.activities.getActivityStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Activities",
      value: stats.totalActivities,
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      color: "blue",
    },
    {
      label: "Last 24 Hours",
      value: stats.last24Hours,
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      color: "purple",
    },
    {
      label: "Last 7 Days",
      value: stats.lastWeek,
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      color: "green",
    },
    {
      label: "Success Rate",
      value: stats.totalActivities > 0
        ? `${Math.round(
            ((stats.statusCounts.success || 0) / stats.totalActivities) * 100
          )}%`
        : "0%",
      icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Type Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Action Types
        </h3>
        <div className="space-y-2">
          {(Object.entries(stats.actionTypeCounts) as [string, number][]).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">
                {type.replace("_", " ")}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(count / stats.totalActivities) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Status Distribution</h3>
        <div className="flex gap-4">
          {(Object.entries(stats.statusCounts) as [string, number][]).map(([status, count]) => (
            <div
              key={status}
              className={`flex-1 p-3 rounded-lg ${
                status === "success"
                  ? "bg-green-50"
                  : status === "error"
                  ? "bg-red-50"
                  : "bg-yellow-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {status === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : status === "error" ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium capitalize text-gray-700">
                  {status}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}