"use client";

import { useState } from "react";
import { ActivityFeed } from "./ActivityFeed";
import { ActivityStats } from "./ActivityStats";
import { CalendarWeekView } from "./CalendarWeekView";
import { GlobalSearch } from "./GlobalSearch";
import { CreateTaskModal } from "./CreateTaskModal";
import { Activity, Calendar, Search, BarChart3 } from "lucide-react";

interface DashboardTabsProps {
  defaultTab?: "overview" | "activity" | "calendar" | "search" | "stats";
}

export function DashboardTabs({ defaultTab = "overview" }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "search", label: "Search", icon: Search },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <ActivityStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <ActivityFeed limit={5} />
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  This Week
                </h3>
                <CalendarWeekView />
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ActivityStats />
            <div className="mt-6">
              <ActivityFeed limit={50} autoRefresh={true} />
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CalendarWeekView
              onCreateTask={(date) => {
                setSelectedDate(date);
                setIsCreateTaskOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === "search" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <GlobalSearch />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Search Tips</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Use specific keywords for better results</li>
                  <li>Results are ranked by relevance and recency</li>
                  <li>Filter by content type using the chips</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Indexed Content</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Memory files (MEMORY.md, memory/*.md)</li>
                  <li>Workspace documents</li>
                  <li>Activity history and tasks</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        initialDate={selectedDate}
      />
    </div>
  );
}