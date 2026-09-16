import { Link } from "react-router";
import { useFetchRoutines } from "../hooks/useRoutines";
import type { Habit, SubTask } from "../types/routines.types";
import { API_MESSAGES } from "../api/messages.api";

export default function Index() {
  const { data: routines, isFetching, error } = useFetchRoutines();

  if (isFetching) {
    return <p>Carregando rotinas...</p>;
  }

  if (error !== null) {
    return (
      <p>
        {API_MESSAGES.get(error.code) ??
          "Algum erro ocorreu ao tentar buscar as rotinas..."}
      </p>
    );
  }

  if (routines?.length === 0) {
    return <p>Nenhuma rotina encontrada...</p>;
  }

  return (
    <ul>
      {routines?.map((routine) => (
        <li id={routine.id} key={routine.id}>
          <h2>{routine.title}</h2>
          <ul>
            {routine.habits.map((habit: Habit) => (
              <li id={habit.id} key={habit.id}>
                <h3>{habit.title}</h3>
                <span>Categoria: {habit.category}</span>
                <ul>
                  {habit.subTasks.map((subTask: SubTask) => (
                    <li id={subTask.id} key={subTask.id}>
                      <h4>{subTask.title}</h4>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <Link to={`/new/${routine.id}`}>+ Adicionar novo hábito</Link>
            </li>
          </ul>
        </li>
      ))}
    </ul>
  );
}
