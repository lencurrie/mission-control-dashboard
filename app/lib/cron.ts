// Utility functions for parsing and working with cron expressions

/**
 * Parse a cron expression and return human-readable description
 */
export function parseCronExpression(cron: string): string {
  const parts = cron.split(" ");
  if (parts.length !== 5) return "Invalid cron expression";

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Common patterns
  if (cron === "0 * * * *") return "Every hour";
  if (cron === "0 */6 * * *") return "Every 6 hours";
  if (cron === "0 0 * * *") return "Daily at midnight";
  if (cron === "0 0 * * 0") return "Weekly on Sunday";
  if (cron === "0 0 * * 1") return "Weekly on Monday";
  if (cron === "0 0 1 * *") return "Monthly on the 1st";
  if (cron === "*/5 * * * *") return "Every 5 minutes";
  if (cron === "0 9 * * 1-5") return "Every weekday at 9 AM";

  // Build description
  const descriptions: string[] = [];

  // Minute
  if (minute === "0") descriptions.push("At the start of the hour");
  else if (minute.startsWith("*/")) {
    const interval = minute.replace("*/", "");
    descriptions.push(`Every ${interval} minutes`);
  }

  // Hour
  if (hour !== "*") {
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    descriptions.push(`at ${displayHour}:00 ${ampm}`);
  }

  // Day of week
  if (dayOfWeek !== "*") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (dayOfWeek.includes("-")) {
      const [start, end] = dayOfWeek.split("-").map(Number);
      descriptions.push(`from ${days[start]} to ${days[end]}`);
    } else if (dayOfWeek.includes(",")) {
      const dayList = dayOfWeek.split(",").map(Number);
      descriptions.push(`on ${dayList.map((d) => days[d]).join(", ")}`);
    } else {
      descriptions.push(`on ${days[parseInt(dayOfWeek)]}`);
    }
  }

  return descriptions.join(" ") || "Custom schedule";
}

/**
 * Get the next execution time for a cron expression
 */
export function getNextExecutionTime(cron: string, fromDate: Date = new Date()): Date {
  // This is a simplified implementation
  // For production, use a library like node-cron or cron-parser
  
  const parts = cron.split(" ");
  if (parts.length !== 5) return new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);

  const [minute, hour] = parts;
  const nextDate = new Date(fromDate);

  if (hour === "*" && minute === "0") {
    // Every hour
    nextDate.setHours(nextDate.getHours() + 1, 0, 0, 0);
  } else if (hour.startsWith("*/")) {
    // Every N hours
    const interval = parseInt(hour.replace("*/", ""));
    nextDate.setHours(nextDate.getHours() + interval, 0, 0, 0);
  } else if (hour !== "*" && minute === "0") {
    // Specific hour
    const targetHour = parseInt(hour);
    if (nextDate.getHours() >= targetHour) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    nextDate.setHours(targetHour, 0, 0, 0);
  } else {
    // Default: tomorrow at the same time
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate;
}

/**
 * Validate a cron expression
 */
export function isValidCron(cron: string): boolean {
  const parts = cron.split(" ");
  if (parts.length !== 5) return false;

  // Basic validation - each part should be a valid cron field
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const isValidField = (field: string, min: number, max: number): boolean => {
    if (field === "*") return true;
    if (field.startsWith("*/")) {
      const num = parseInt(field.replace("*/", ""));
      return !isNaN(num) && num >= min && num <= max;
    }
    if (field.includes("-")) {
      const [start, end] = field.split("-").map(Number);
      return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end;
    }
    if (field.includes(",")) {
      return field.split(",").every((f) => isValidField(f, min, max));
    }
    const num = parseInt(field);
    return !isNaN(num) && num >= min && num <= max;
  };

  return (
    isValidField(minute, 0, 59) &&
    isValidField(hour, 0, 23) &&
    isValidField(dayOfMonth, 1, 31) &&
    isValidField(month, 1, 12) &&
    isValidField(dayOfWeek, 0, 6)
  );
}

/**
 * Common cron presets
 */
export const cronPresets = {
  EVERY_MINUTE: "* * * * *",
  EVERY_5_MINUTES: "*/5 * * * *",
  EVERY_15_MINUTES: "*/15 * * * *",
  EVERY_30_MINUTES: "*/30 * * * *",
  EVERY_HOUR: "0 * * * *",
  EVERY_6_HOURS: "0 */6 * * *",
  EVERY_12_HOURS: "0 */12 * * *",
  DAILY: "0 0 * * *",
  DAILY_9AM: "0 9 * * *",
  WEEKLY_MONDAY: "0 0 * * 1",
  WEEKLY_SUNDAY: "0 0 * * 0",
  MONTHLY: "0 0 1 * *",
  WEEKDAYS_9AM: "0 9 * * 1-5",
  WEEKENDS: "0 0 * * 0,6",
} as const;