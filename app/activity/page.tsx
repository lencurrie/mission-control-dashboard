import { DashboardLayout } from "../components/DashboardLayout";
import { ActivityFeed } from "../components/ActivityFeed";

export default function ActivityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
          <p className="text-gray-600 mt-1">
            Real-time feed of all AI assistant actions and operations.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ActivityFeed limit={100} autoRefresh={true} refreshInterval={5000} />
        </div>
      </div>
    </DashboardLayout>
  );
}