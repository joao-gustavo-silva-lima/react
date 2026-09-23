import type { Routine } from "../types/routines.types";
import { getLocalDateISO } from "./date-conversion.utils";

export type MarkedRoutines = ReturnType<typeof checkCompletionDates>;

export function checkCompletionDates(routines: Routine[]) {
  const todayISO = getLocalDateISO();

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
        isComplete: completionDates?.includes(todayISO),
      })),
      isComplete: completionDates.includes(todayISO),
    })),
    isComplete: completionDates?.includes(todayISO),
  }));
}

function checkStreak(completionDates: string[]) {
  if (!completionDates.length) return 0;

  const uniqueDates = [...new Set(completionDates)].sort();
  const todayISO = getLocalDateISO();

  if (!uniqueDates.includes(todayISO)) return 0;

  let streak = 1;

  for (let i = uniqueDates.length - 1; i > 0; i--) {
    const current = dateToDayNumber(uniqueDates[i]);
    const previous = dateToDayNumber(uniqueDates[i - 1]);

    const diffInDays = (current - previous) / (1000 * 60 * 60 * 24);

    if (diffInDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function dateToDayNumber(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return Math.floor(Date.UTC(year, month - 1, day) / (1000 * 60 * 60 * 24));
}
