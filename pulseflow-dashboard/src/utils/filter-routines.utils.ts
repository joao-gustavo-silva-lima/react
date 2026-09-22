import { type Query } from "../types/routines.types";
import type { MarkedRoutines } from "./handle-completion-dates.utils";

export default function filterRoutines(query: Query, routines: MarkedRoutines) {
  return routines
    .map(({ habits, ...routine }) => ({
      ...routine,
      habits: habits.filter((habit) => {
        return (
          (query.title
            ? habit.title.trim().toLowerCase().includes(query.title) ||
              habit.subTasks.some(({ title }) =>
                title.trim().toLowerCase().includes(query.title),
              )
            : true) &&
          (query.category === "All"
            ? true
            : (query.category === "Complete" && habit.isComplete) ||
              (query.category === "Pending" && !habit.isComplete) ||
              query.category === habit.category)
        );
      }),
    }))
    .filter((routine) => routine.habits.length > 0);
}
