import { DashboardLayout } from "../components/DashboardLayout";
import { CalendarWeekView } from "../components/CalendarWeekView";

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">
            View and manage scheduled tasks, cron jobs, and reminders.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CalendarWeekView />
        </div>
      </div>
    </DashboardLayout>
  );
}