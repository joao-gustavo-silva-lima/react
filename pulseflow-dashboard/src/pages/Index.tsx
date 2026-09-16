import { Link } from "react-router";
import { useDeleteHabit, useFetchRoutines } from "../hooks/useRoutines";
import type { Habit, SubTask } from "../types/routines.types";
import { API_MESSAGES } from "../api/messages.api";

export default function Index() {
  const {
    data: routines,
    isFetching: isFetchingRoutines,
    error: routinesFetchingError,
  } = useFetchRoutines();

  const { mutate: deleteHabit } = useDeleteHabit();

  if (isFetchingRoutines) {
    return <p>Carregando rotinas...</p>;
  }

  if (routinesFetchingError !== null) {
    return (
      <p>
        {API_MESSAGES.get(routinesFetchingError.code) ??
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
                <div>
                  <h3>{habit.title}</h3>
                  <button
                    onClick={() =>
                      deleteHabit(
                        { routineId: routine.id!, habitId: habit.id! },
                        {
                          onSettled(data, error) {
                            console.log(data?.code ?? error?.code);

                            alert(
                              API_MESSAGES.get((data?.code ?? error?.code)!),
                            );
                          },
                        },
                      )
                    }
                  >
                    Excluir
                  </button>
                </div>
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
            {routine.habits.length < 15 && (
              <li>
                <Link to={`/new/${routine.id}`}>+ Adicionar novo hábito</Link>
              </li>
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
}
