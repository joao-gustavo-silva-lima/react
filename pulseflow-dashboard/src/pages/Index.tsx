import { useFetchRoutines } from "../hooks/useRoutines";
import type { Habit, SubTask } from "../types/routines.types";

export default function Index() {
  const { data: routines, isFetching } = useFetchRoutines();

  if (isFetching) {
    return <p>Carregando rotinas...</p>;
  }

  if (routines === undefined) {
    return <p>Rotinas não encontradas...</p>;
  }

  return (
    <ul>
      {routines.map((routine) => (
        <li key={routine.id}>
          <h2>{routine.title}</h2>
          <ul>
            {routine.habits.map((habit: Habit) => (
              <li key={habit.id}>
                <h3>{habit.title}</h3>
                <span>Categoria: {habit.category}</span>
                <ul>
                  {habit.subTasks.map((subTask: SubTask) => (
                    <li key={subTask.id}>
                      <h4>{subTask.title}</h4>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
