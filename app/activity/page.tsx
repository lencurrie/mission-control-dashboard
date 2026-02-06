"use client";

import { DashboardLayout } from "../components/DashboardLayout";
import { Activity, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ActivityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">
            View and track all AI assistant activities
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Activity className="w-5 h-5 text-blue-500" />} label="Total" value={0} />
          <StatCard icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Success" value={0} />
          <StatCard icon={<XCircle className="w-5 h-5 text-red-500" />} label="Errors" value={0} />
          <StatCard icon={<Clock className="w-5 h-5 text-yellow-500" />} label="Pending" value={0} />
        </div>

        {/* Activity List Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-8 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No activities recorded yet</p>
            <p className="text-sm mt-2">
              Activities will appear here once the Convex backend is configured
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
