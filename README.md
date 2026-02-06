# Mission Control Dashboard

A comprehensive dashboard for monitoring and managing an AI assistant's activities, scheduled tasks, and searchable content.

## Features

### 1. Activity Feed
- Real-time feed of all AI assistant actions
- Records tool calls, file operations, messages sent, tasks completed
- Includes timestamps, action types, descriptions, and status
- Filter by action type and status
- Auto-refresh capability

### 2. Calendar View
- Weekly calendar view showing scheduled tasks
- Displays task names, scheduled times, and recurrence patterns
- Color-coded by priority (low, medium, high)
- Visual indicators for recurring tasks
- Navigate between weeks

### 3. Global Search
- Full-text search across:
  - Memory files (MEMORY.md, memory/*.md)
  - Workspace documents
  - Activity history
  - Scheduled tasks
- Relevance scoring
- Filter by content type
- Real-time search results

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **Convex** - Backend database and real-time sync
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **date-fns** - Date manipulation
- **lucide-react** - Icon library

## Project Structure

```
mission-control/
├── app/
│   ├── api/                  # API routes
│   │   ├── activities/       # Activity logging endpoints
│   │   ├── tasks/           # Task management endpoints
│   │   └── search/          # Search endpoints
│   ├── components/          # React components
│   │   ├── ActivityFeed.tsx
│   │   ├── CalendarWeekView.tsx
│   │   ├── GlobalSearch.tsx
│   │   └── DashboardLayout.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useActivityLogger.ts
│   │   ├── useTaskManager.ts
│   │   └── useSearchIndex.ts
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── page.tsx             # Dashboard home
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema
│   ├── activities.ts        # Activity queries/mutations
│   ├── tasks.ts             # Task queries/mutations
│   └── search.ts            # Search queries/mutations
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd mission-control
npm install
```

### 2. Set Up Convex

1. Install the Convex CLI globally:
```bash
npm install -g convex
```

2. Initialize Convex in your project:
```bash
npx convex dev
```

This will:
- Create a Convex project
- Deploy the schema and functions
- Generate the client code in `convex/_generated/`

3. Copy the Convex URL from the output and add it to your environment variables.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

Replace `your_convex_deployment_url` with the URL provided by Convex during setup (e.g., `https://happy-animal-123.convex.cloud`).

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Usage

### Logging Activities

Use the `useActivityLogger` hook in your application code to log AI assistant actions:

```typescript
import { useActivityLogger } from "./hooks/useActivityLogger";

function MyComponent() {
  const { logToolCall, logFileOperation, logError } = useActivityLogger();

  const handleToolCall = async () => {
    // Log a tool call
    await logToolCall("web_search", "Searching for information", {
      status: "pending",
    });

    try {
      // Perform the tool call...
      
      // Log success
      await logToolCall("web_search", "Search completed", {
        status: "success",
        metadata: { duration: 150 },
      });
    } catch (error) {
      // Log error
      await logError("Search failed", error.message);
    }
  };

  return <button onClick={handleToolCall}>Search</button>;
}
```

### Managing Tasks

Use the `useTaskManager` hook to create and manage scheduled tasks:

```typescript
import { useTaskManager } from "./hooks/useTaskManager";

function TaskComponent() {
  const { createTask, createCronJob, createReminder } = useTaskManager();

  const scheduleReminder = async () => {
    const scheduledTime = Date.now() + 24 * 60 * 60 * 1000; // Tomorrow
    
    await createReminder(
      "Daily Standup",
      scheduledTime,
      "telegram",
      {
        metadata: { payload: "Don't forget the daily standup!" },
      }
    );
  };

  const scheduleCronJob = async () => {
    await createCronJob(
      "Heartbeat Check",
      "0 */6 * * *", // Every 6 hours
      "check_heartbeat",
      {
        description: "Periodic heartbeat check",
      }
    );
  };

  return (
    <div>
      <button onClick={scheduleReminder}>Set Reminder</button>
      <button onClick={scheduleCronJob}>Create Cron Job</button>
    </div>
  );
}
```

### Indexing Content for Search

Use the `useSearchIndex` hook to add content to the global search:

```typescript
import { useSearchIndex } from "./hooks/useSearchIndex";

function IndexComponent() {
  const { indexMemoryFile, indexWorkspaceDoc } = useSearchIndex();

  const indexMemory = async () => {
    await indexMemoryFile({
      title: "Project Notes",
      content: "Important project information...",
      path: "memory/2024-01-15.md",
      tags: ["project", "notes"],
    });
  };

  return <button onClick={indexMemory}>Index Memory</button>;
}
```

## API Routes

### Activities

- `GET /api/activities` - Get activities (supports filtering)
- `POST /api/activities` - Log a new activity

### Tasks

- `GET /api/tasks` - Get tasks (supports date range filtering)
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks` - Update a task
- `DELETE /api/tasks` - Delete a task

### Search

- `GET /api/search?q=query` - Search indexed content
- `POST /api/search` - Index or remove content

## Database Schema

### activities
- `timestamp` - Unix timestamp
- `actionType` - Type of action (tool_call, file_operation, etc.)
- `description` - Human-readable description
- `status` - success, error, or pending
- `metadata` - Additional context (tool name, file path, etc.)
- `sessionId` - Optional session identifier
- `agentId` - Agent identifier

### tasks
- `name` - Task name
- `description` - Task description
- `scheduledTime` - Unix timestamp
- `recurrencePattern` - Cron expression or frequency
- `status` - pending, running, completed, cancelled
- `priority` - low, medium, high
- `metadata` - Additional context (command, target channel, etc.)

### searchIndex
- `content` - Searchable content
- `contentType` - memory_file, workspace_doc, activity, task
- `title` - Item title
- `path` - File path or reference
- `tags` - Searchable tags
- `lastModified` - Last update timestamp

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the `NEXT_PUBLIC_CONVEX_URL` environment variable in Vercel dashboard
4. Deploy!

### Update Convex Production Deployment

```bash
npx convex deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT