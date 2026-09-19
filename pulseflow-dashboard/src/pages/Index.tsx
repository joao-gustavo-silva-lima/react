import { Link } from "react-router";
import {
  useDeleteResource,
  useFetchRoutines,
  useToggleResourcesDailyStatus,
} from "../hooks/useRoutines";
import { CATEGORIES_TO_PT_BR, type DTO } from "../types/routines.types";
import { API_MESSAGES } from "../api/messages.api";
import { checkCompletionDates } from "../utils/handle-completion-dates.utils";

export default function Index() {
  const {
    data: routines,
    isFetching: isFetchingRoutines,
    error: routinesFetchingError,
  } = useFetchRoutines();

  const statefulRoutines = checkCompletionDates(routines ?? []);

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

  return (
    <>
      <Link to="/new-routine">+ Criar uma nova rotina</Link>
      {statefulRoutines.length === 0 ? (
        <p>Nenhuma rotina encontrada...</p>
      ) : (
        <ul>
          {statefulRoutines.map((routine) => (
            <li id={routine.id} key={routine.id}>
              <div>
                <h2>{routine.title}</h2>
                {routine.streak > 0 && (
                  <p>
                    🔥 {routine.streak} Dia{routine.streak > 1 ? "s" : ""}
                  </p>
                )}
                <p>Status: {routine.isComplete ? "✅" : "⏳"}</p>
                <Link to={`${routine.id}/edit`}>Editar</Link>
                <DeletionButton
                  targetTitle={routine.title}
                  ids={{
                    routineId: routine.id!,
                  }}
                />
              </div>
              <ul>
                {routine.habits.map((habit) => (
                  <li id={habit.id} key={habit.id}>
                    <div>
                      <h3>{habit.title}</h3>
                      {habit.streak > 0 && (
                        <p>
                          🔥 {habit.streak} Dia{habit.streak > 1 ? "s" : ""}
                        </p>
                      )}
                      <p>Status: {habit.isComplete ? "✅" : "⏳"}</p>
                      {habit.subTasks.length === 0 && (
                        <DailyStatusToggleButton
                          ids={{
                            routineId: routine.id!,
                            habitId: habit.id,
                          }}
                          DTO={habit}
                        />
                      )}
                      <Link to={`${routine.id}/${habit.id}/edit`}>Editar</Link>
                      <DeletionButton
                        targetTitle={habit.title}
                        ids={{
                          routineId: routine.id!,
                          habitId: habit.id,
                        }}
                      />
                    </div>
                    <span>
                      Categoria: {CATEGORIES_TO_PT_BR.get(habit.category)}
                    </span>
                    <ul>
                      {habit.subTasks.map((subTask) => (
                        <li id={subTask.id} key={subTask.id}>
                          <h4>{subTask.title}</h4>
                          {subTask.streak > 0 && (
                            <p>
                              🔥 {subTask.streak} Dia
                              {subTask.streak > 1 ? "s" : ""}
                            </p>
                          )}
                          <p>Status: {subTask.isComplete ? "✅" : "⏳"}</p>
                          <DailyStatusToggleButton
                            ids={{
                              routineId: routine.id!,
                              habitId: habit.id,
                              subTaskId: subTask.id,
                            }}
                            DTO={subTask}
                          />
                          <Link
                            to={`${routine.id}/${habit.id}/${subTask.id}/edit`}
                          >
                            Editar
                          </Link>

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
                      {habit.subTasks.length < 10 && (
                        <li>
                          <Link to={`/${routine.id}/${habit.id}/new-sub-task`}>
                            + Adicionar nova sub-tarefa
                          </Link>
                        </li>
                      )}
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

function DailyStatusToggleButton({
  ids,
  DTO,
}: {
  ids: { routineId: string; habitId?: string; subTaskId?: string };
  DTO: DTO & { isComplete: boolean | undefined };
}) {
  const { mutate: toggleDailyStatus, isPending } =
    useToggleResourcesDailyStatus();

  const DTOType = (() => {
    if (Object.hasOwn(DTO, "habits")) {
      return "Rotina";
    }

    if (Object.hasOwn(DTO, "subTasks")) {
      return "Hábito";
    }

    return "Sub-Tarefa";
  })();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (
          !confirm(
            `Confirmar ${DTO.isComplete ? "desfazimento" : "conclusão"} de ${DTOType}`,
          )
        ) {
          return;
        }

        toggleDailyStatus(
          { ...ids },
          {
            onSettled(data, error) {
              alert(API_MESSAGES.get((data?.code ?? error?.code)!));
            },
          },
        );
      }}
    >
      {DTO.isComplete ? "Desfazer" : "Concluir"} {DTOType}
    </button>
  );
}

function DeletionButton({
  targetTitle,
  ids,
}: {
  targetTitle: string;
  ids: { routineId: string; habitId?: string; subTaskId?: string };
}) {
  const { mutate: deleteResource, isPending } = useDeleteResource();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Confirmar exclusão de "${targetTitle}"?`)) {
          return;
        }

        deleteResource(ids, {
          onSettled(data, error) {
            alert(API_MESSAGES.get((data?.code ?? error?.code)!));
          },
        });
      }}
    >
      Excluir
    </button>
  );
}
