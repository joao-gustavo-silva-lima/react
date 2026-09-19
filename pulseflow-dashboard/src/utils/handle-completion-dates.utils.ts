import type { Routine } from "../types/routines.types";

export function checkCompletionDates(routines: Routine[]) {
  const todayISOString = new Date().toISOString().split("T")[0]!;

  return routines.map(({ habits, completionDates, ...routine }) => ({
    ...routine,
    completionDates,
    streak: checkStreak(completionDates ?? []),
    habits: habits.map(({ subTasks, completionDates, ...habit }) => ({
      ...habit,
      completionDates,
      streak: checkStreak(completionDates ?? []),
      subTasks: subTasks.map(({ completionDates, ...subTask }) => ({
        ...subTask,
        completionDates,
        streak: checkStreak(completionDates ?? []),
        isComplete: completionDates?.includes(todayISOString),
      })),
      isComplete: completionDates.includes(todayISOString),
    })),
    isComplete: completionDates?.includes(todayISOString),
  }));
}

function checkStreak(completionDates: string[]) {
  if (!completionDates.length) return 0;

  const uniqueDates = [...new Set(completionDates)].sort();
  const todayISO = new Date().toISOString().split("T")[0];

  if (!uniqueDates.includes(todayISO)) return 0;

  let streak = 1;

  for (let i = uniqueDates.length - 1; i > 0; i--) {
    const current = new Date(uniqueDates[i] + "T00:00:00Z").getTime();
    const previous = new Date(uniqueDates[i - 1] + "T00:00:00Z").getTime();

    const diffInDays = (current - previous) / (1000 * 60 * 60 * 24);

    if (diffInDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
