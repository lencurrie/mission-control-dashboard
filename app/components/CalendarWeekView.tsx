"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  startOfDay,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Repeat,
  CheckCircle,
  Circle,
  AlertCircle,
} from "lucide-react";

interface Task {
  _id: string;
  name: string;
  description?: string;
  scheduledTime: number;
  recurrencePattern?: string;
  status: "pending" | "running" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high";
}

interface CalendarWeekViewProps {
  onTaskClick?: (task: Task) => void;
  onCreateTask?: (date: Date) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  pending: <Circle className="w-3 h-3" />,
  running: <Clock className="w-3 h-3 text-blue-500" />,
  completed: <CheckCircle className="w-3 h-3 text-green-500" />,
  cancelled: <AlertCircle className="w-3 h-3 text-gray-400" />,
};

export function CalendarWeekView({ onTaskClick, onCreateTask }: CalendarWeekViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const tasks = useQuery(api.tasks.getWeekTasks, {
    weekStart: weekStart.getTime(),
  }) || [];

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task: Task) => {
      const taskDate = new Date(task.scheduledTime);
      return isSameDay(taskDate, day);
    });
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    if (onCreateTask) {
      onCreateTask(day);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Calendar
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-gray-100 rounded-lg">
            <button
              onClick={goToPreviousWeek}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-l-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 text-sm font-medium text-gray-700 min-w-[180px] text-center">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </span>
            <button
              onClick={goToNextWeek}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-r-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`bg-gray-50 px-3 py-2 text-center ${
              isToday(day) ? "bg-blue-50" : ""
            }`}
          >
            <div className="text-xs font-medium text-gray-500 uppercase">
              {format(day, "EEE")}
            </div>
            <div
              className={`text-lg font-semibold ${
                isToday(day) ? "text-blue-600" : "text-gray-900"
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Day Cells */}
        {weekDays.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`bg-white min-h-[200px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? "ring-2 ring-blue-500" : ""
              } ${isTodayDate ? "bg-blue-50/30" : ""}`}
            >
              <div className="space-y-1">
                {dayTasks.map((task: Task) => (
                  <div
                    key={task._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    className={`p-2 rounded text-sm cursor-pointer transition-all hover:shadow-md ${
                      priorityColors[task.priority || "low"]
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {statusIcons[task.status]}
                      <span className="font-medium truncate">{task.name}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                      <Clock className="w-3 h-3" />
                      {format(task.scheduledTime, "HH:mm")}
                      {task.recurrencePattern && (
                        <>
                          <span className="mx-1">•</span>
                          <Repeat className="w-3 h-3" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {dayTasks.length === 0 && (
                  <div className="text-center text-gray-300 text-sm py-4">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
          <span className="text-gray-600">Low Priority</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></div>
          <span className="text-gray-600">Medium Priority</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
          <span className="text-gray-600">High Priority</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Repeat className="w-3 h-3 text-gray-400" />
          <span className="text-gray-600">Recurring</span>
        </div>
      </div>
    </div>
  );
}