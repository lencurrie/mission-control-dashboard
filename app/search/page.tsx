import { DashboardLayout } from "../components/DashboardLayout";
import { GlobalSearch } from "../components/GlobalSearch";

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Search</h1>
          <p className="text-gray-600 mt-1">
            Search across memory files, workspace documents, activity history, and scheduled tasks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <GlobalSearch />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Use specific keywords for better results</li>
              <li>• Search includes full content of memory files</li>
              <li>• Results are ranked by relevance and recency</li>
              <li>• Filter by content type using the chips above</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Indexed Content</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Memory files (MEMORY.md, memory/*.md)</li>
              <li>• Workspace documents</li>
              <li>• Activity history</li>
              <li>• Scheduled tasks and cron jobs</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}