import type { Routine } from "../types/routines.types";

export function checkCompletionDates(routines: Routine[]) {
  const todayISOString = new Date().toISOString().split("T")[0]!;

  return routines.map(({ habits, ...routine }) => ({
    ...routine,
    habits: habits.map(({ subTasks, ...habit }) => ({
      ...habit,
      subTasks: subTasks.map((subTask) => ({
        ...subTask,
        isComplete: subTask.completionDates?.includes(todayISOString),
      })),
      isComplete: habit.completionDates?.includes(todayISOString),
    })),
    isComplete: routine.completionDates?.includes(todayISOString),
  }));
}
