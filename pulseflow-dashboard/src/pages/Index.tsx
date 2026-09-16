import { Link } from "react-router";
import { useDeleteResource, useFetchRoutines } from "../hooks/useRoutines";
import type { Habit, SubTask } from "../types/routines.types";
import { API_MESSAGES } from "../api/messages.api";

export default function Index() {
  const {
    data: routines,
    isFetching: isFetchingRoutines,
    error: routinesFetchingError,
  } = useFetchRoutines();

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
    return;
  }

  return (
    <>
      <Link to="/new-routine">+ Criar uma nova rotina</Link>
      {routines?.length === 0 ? (
        <p>Nenhuma rotina encontrada...</p>
      ) : (
        <ul>
          {routines?.map((routine) => (
            <li id={routine.id} key={routine.id}>
              <div>
                <h2>{routine.title}</h2>
                <DeletionButton
                  targetTitle={routine.title}
                  ids={{
                    routineId: routine.id!,
                  }}
                />
              </div>
              <ul>
                {routine.habits.map((habit: Habit) => (
                  <li id={habit.id} key={habit.id}>
                    <div>
                      <h3>{habit.title}</h3>
                      <DeletionButton
                        targetTitle={habit.title}
                        ids={{
                          routineId: routine.id!,
                          habitId: habit.id,
                        }}
                      />
                    </div>
                    <span>Categoria: {habit.category}</span>
                    <ul>
                      {habit.subTasks.map((subTask: SubTask) => (
                        <li id={subTask.id} key={subTask.id}>
                          <h4>{subTask.title}</h4>
                          <DeletionButton
                            targetTitle={subTask.title}
                            ids={{
                              routineId: routine.id!,
                              habitId: habit.id,
                              subTaskId: subTask.id,
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                {routine.habits.length < 15 && (
                  <li>
                    <Link to={`/${routine.id}/new-habit`}>
                      + Adicionar novo hábito
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function DeletionButton({
  targetTitle,
  ids,
}: {
  targetTitle: string;
  ids: { routineId: string; habitId?: string; subTaskId?: string };
}) {
  const { mutate: deleteResource } = useDeleteResource();

  return (
    <button
      onClick={() => {
        if (!confirm(`Confirmar exclusão de "${targetTitle}"?`)) {
          return;
        }

        deleteResource(
          { ...ids },
          {
            onSettled(data, error) {
              alert(API_MESSAGES.get((data?.code ?? error?.code)!));
            },
          },
        );
      }}
    >
      Excluir
    </button>
  );
}
