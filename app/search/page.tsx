"use client";

import { DashboardLayout } from "../components/DashboardLayout";
import { Search, FileText, Calendar, Activity } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Search</h1>
          <p className="text-gray-600 mt-1">
            Search across memories, documents, activities, and tasks
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search everything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content Types */}
        <div className="flex flex-wrap gap-2">
          <FilterButton icon={<FileText className="w-4 h-4" />} label="Documents" />
          <FilterButton icon={<Activity className="w-4 h-4" />} label="Activities" />
          <FilterButton icon={<Calendar className="w-4 h-4" />} label="Tasks" />
        </div>

        {/* Results Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Full-text search across all your data will be available once the Convex backend is configured.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FilterButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
      {icon}
      {label}
    </button>
  );
}
