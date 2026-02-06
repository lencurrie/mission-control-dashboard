"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow, format } from "date-fns";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Wrench,
  RefreshCw,
  Filter
} from "lucide-react";

interface ActivityItem {
  _id: string;
  timestamp: number;
  actionType: string;
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
}

interface ActivityFeedProps {
  limit?: number;
  filter?: {
    actionType?: string;
    status?: string;
  };
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const actionTypeIcons: Record<string, React.ReactNode> = {
  tool_call: <Wrench className="w-4 h-4" />,
  file_operation: <FileText className="w-4 h-4" />,
  message_sent: <MessageSquare className="w-4 h-4" />,
  task_completed: <CheckCircle className="w-4 h-4" />,
  default: <Activity className="w-4 h-4" />,
};

const statusIcons = {
  success: <CheckCircle className="w-4 h-4 text-green-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
};

const statusColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  pending: "bg-yellow-50 border-yellow-200",
};

export function ActivityFeed({
  limit = 50,
  filter,
  autoRefresh = true,
  refreshInterval = 5000,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const queryResult = useQuery(
    api.activities.getActivities,
    { limit, ...filter }
  );

  useEffect(() => {
    if (queryResult?.activities) {
      setActivities(queryResult.activities as ActivityItem[]);
    }
  }, [queryResult]);

  const handleRefresh = () => {
    // Force re-fetch by invalidating cache
    window.location.reload();
  };

  const getIcon = (actionType: string) => {
    return actionTypeIcons[actionType] || actionTypeIcons.default;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity Feed
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Action Type</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">All</option>
                <option value="tool_call">Tool Call</option>
                <option value="file_operation">File Operation</option>
                <option value="message_sent">Message Sent</option>
                <option value="task_completed">Task Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">All</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No activities found
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity._id}
              className={`p-4 rounded-lg border ${statusColors[activity.status]} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(activity.actionType)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 capitalize">
                      {activity.actionType.replace("_", " ")}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-400">
                      {format(activity.timestamp, "MMM d, yyyy HH:mm:ss")}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{activity.description}</p>
                  
                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-2">
                      {activity.metadata.toolName && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Tool: {activity.metadata.toolName}
                        </span>
                      )}
                      {activity.metadata.filePath && (
                        <span className="bg-gray-100 px-2 py-1 rounded truncate max-w-xs">
                          File: {activity.metadata.filePath}
                        </span>
                      )}
                      {activity.metadata.channel && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Channel: {activity.metadata.channel}
                        </span>
                      )}
                      {activity.metadata.duration && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Duration: {activity.metadata.duration}ms
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {activity.metadata?.errorMessage && (
                    <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
                      Error: {activity.metadata.errorMessage}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {statusIcons[activity.status]}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {queryResult?.nextCursor && (
        <div className="mt-4 text-center">
          <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}