import { Link, Outlet, useOutlet } from "react-router";
import {
  useDeleteResource,
  useFetchRoutines,
  useToggleResourcesDailyStatus,
} from "../hooks/useRoutines";
import {
  CATEGORIES_TO_PT_BR,
  type DTO,
  type Query,
} from "../types/routines.types";
import { API_MESSAGES } from "../api/messages.api";
import {
  checkCompletionDates,
  type MarkedRoutines,
} from "../utils/handle-completion-dates.utils";
import SearchBar from "../components/SearchBar";
import { formatDate } from "../utils/date-conversion.utils";
import { useEffect, useState } from "react";
import filterRoutines from "../utils/filter-routines.utils";
import Fallback from "./Fallback";
import ActionButton from "../components/ActionButton";
import {
  ChevronDown,
  Flame,
  Hourglass,
  Pencil,
  Square,
  SquareCheckBig,
  Trash2,
  Undo,
} from "lucide-react";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

export default function Index() {
  const outlet = useOutlet();

  const [query, setQuery] = useState<Query>({
    title: "",
    category: "All",
  });

  const {
    data: routines,
    isFetching: isFetchingRoutines,
    error: routinesFetchingError,
  } = useFetchRoutines();

  const filteredRoutines = filterRoutines(
    query,
    checkCompletionDates(routines ?? []),
  );

  if (routinesFetchingError !== null) {
    return (
      <Fallback
        message={
          API_MESSAGES.get(routinesFetchingError.code) ??
          "Não foi possível carregar suas rotinas."
        }
      />
    );
  }

  const {} = useBodyScrollLock(outlet !== null);

  return (
    <main className={`contained flex flex-col gap-gap-lg`}>
      <h1 className="font-bold text-xl capitalize">{formatDate(new Date())}</h1>
      <SearchBar query={query} setQuery={setQuery} />
      <h3 className="text-lg font-semibold">Rotinas, Hábitos & Tarefas</h3>
      {isFetchingRoutines ? (
        Array.from({ length: 3 }, (_, index) => (
          <RoutineSkeleton key={`routine-skeleton-${index}`} />
        ))
      ) : (
        <>
          <ActionButton to="/new-routine">+ Criar uma nova rotina</ActionButton>
          {filteredRoutines.length === 0 ? (
            query.title === "" && query.category === "All" ? (
              <p className="w-full text-center text-text-secondary">
                Nenhuma rotina foi registrada.{" "}
                <Link
                  className="text-primary font-semibold hover:cursor-pointer hover:underline"
                  to={""}
                >
                  Comece aqui!
                </Link>
              </p>
            ) : (
              <p className="w-full text-center text-text-secondary">
                Nenhum hábito ou tarefa satisfaz a filtragem.{" "}
                <button
                  className="text-primary font-semibold hover:cursor-pointer hover:underline"
                  onClick={() => setQuery({ title: "", category: "All" })}
                >
                  Limpar a busca?
                </button>
              </p>
            )
          ) : (
            <ul className="flex flex-col flex-nowrap gap-gap-lg">
              {filteredRoutines.map((routine) => (
                <li
                  className="flex flex-col gap-gap-sm"
                  id={routine.id}
                  key={routine.id}
                >
                  <div className="flex flex-row flex-nowrap justify-between items-center gap-gap-sm">
                    <h2 className="text-center text-wrap uppercase font-medium text-text-secondary">
                      {routine.title}
                    </h2>
                    <div className="flex flex-row flex-nowrap gap-gap-sm items-center">
                      <EditionButton border={true} to={`${routine.id}/edit`} />
                      <DeletionButton
                        border={true}
                        targetTitle={routine.title}
                        ids={{
                          routineId: routine.id!,
                        }}
                      />
                    </div>
                  </div>
                  <hr className="main-border" />
                  <div className="flex flex-row text-nowrap gap-gap-md items-center">
                    <AncestralConclusionStatus
                      isComplete={routine.isComplete ?? false}
                    />
                    <StreakBadge streak={routine.streak} />
                  </div>
                  <ul className="flex flex-col gap-gap-md">
                    {routine.habits.map((habit) => (
                      <li
                        className="flex flex-col gap-gap-sm bg-surface p-card-p rounded-sm main-border"
                        id={habit.id}
                        key={habit.id}
                      >
                        <div className="flex flex-row flex-nowrap gap-gap-sm">
                          {habit.subTasks.length === 0 ? (
                            <DailyStatusToggleButton
                              ids={{
                                routineId: routine.id!,
                                habitId: habit.id,
                              }}
                              DTO={habit}
                            />
                          ) : (
                            <AncestralConclusionStatus
                              noText={true}
                              isComplete={habit.isComplete}
                            />
                          )}
                          <h3 className="capitalize font-medium">
                            {habit.title}
                          </h3>
                        </div>
                        <div className="flex flex-row flex-wrap justify-between items-center gap-gap-sm">
                          <div className="flex flex-row flex-nowrap items-center gap-gap-sm">
                            <span className="text-text-secondary text-nowrap">
                              {CATEGORIES_TO_PT_BR.get(habit.category)}
                            </span>
                            <StreakBadge streak={habit.streak} />
                          </div>
                          <div className="flex flex-row flex-nowrap items-center gap-gap-sm">
                            <EditionButton
                              border={true}
                              to={`${routine.id}/${habit.id}/edit`}
                            />
                            <DeletionButton
                              border={true}
                              targetTitle={habit.title}
                              ids={{
                                routineId: routine.id!,
                                habitId: habit.id,
                              }}
                            />
                          </div>
                        </div>
                        {habit.subTasks.length > 0 && (
                          <SubTasksDrawer
                            habitId={habit.id!}
                            routineId={routine.id!}
                            subTasks={habit.subTasks}
                          />
                        )}
                      </li>
                    ))}
                    {routine.habits.length < 15 && (
                      <li className="self-center">
                        <ActionButton to={`/${routine.id}/new-habit`}>
                          + Adicionar Novo Hábito
                        </ActionButton>
                      </li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {outlet && (
        <div className="fixed left-0 top-0 flex items-center justify-center w-full min-h-dvh bg-[#00000080] z-10">
          <Outlet />
        </div>
      )}
    </main>
  );
}

function RoutineSkeleton() {
  return (
    <div
      aria-label="Carregando rotina"
      className="surface main-border flex flex-col gap-gap-md animate-pulse"
    >
      <div className="flex flex-row items-center gap-gap-sm">
        <span className="h-5 w-5 rounded-sm bg-surface-hover" />
        <span className="h-4 w-52 max-w-full rounded-sm bg-surface-hover" />
      </div>
      <div className="flex flex-row items-center justify-between gap-gap-sm">
        <span className="h-4 w-28 rounded-sm bg-surface-hover" />
        <div className="flex flex-row gap-gap-sm">
          <span className="h-9 w-9 rounded-sm main-border bg-surface-hover" />
          <span className="h-9 w-9 rounded-sm main-border bg-surface-hover" />
        </div>
      </div>
    </div>
  );
}

function AncestralConclusionStatus({
  noText = false,
  isComplete,
}: {
  noText?: boolean;
  isComplete: boolean;
}) {
  return (
    <div className="flex flex-row flex-nowrap items-center gap-gap-xs">
      {isComplete ? (
        <SquareCheckBig color="#4ade80" size={20} />
      ) : (
        <Hourglass color="#eab308" size={20} />
      )}
      {!noText && (
        <p className={`text-${isComplete ? "primary" : "pendent"} text-nowrap`}>
          {isComplete ? "Concluído" : "Pendente"}
        </p>
      )}
    </div>
  );
}

function SubTasksDrawer({
  habitId,
  subTasks,
  routineId,
}: {
  habitId: string;
  routineId: string;
  subTasks: MarkedRoutines[number]["habits"][number]["subTasks"];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <hr className="my-gap-sm main-border" />
      <div className="flex flex-row flex-nowrap justify-between items-center">
        <span className="text-text-secondary">
          Sub-tarefas: {subTasks.filter((subTask) => subTask.isComplete).length}
          /{subTasks.length}
        </span>
        <button
          onClick={() => setIsOpen((i) => !i)}
          className={`button-basics p-[5px] rounded-lg aspect-square ${isOpen && "rotate-z-[180deg]"}`}
        >
          <ChevronDown size={20} />
        </button>
      </div>
      <ul
        className={`transition-all duration-[.25s] grid ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} overflow-y-hidden`}
      >
        <div className="flex flex-col gap-gap-md overflow-hidden">
          {subTasks.map((subTask) => (
            <li
              className="flex flex-col flex-nowrap gap-gap-md border-b-[1px] border-solid border-border pb-gap-lg"
              id={subTask.id}
              key={subTask.id}
            >
              <div className="flex flex-row flex-nowrap items-center gap-gap-md">
                <DailyStatusToggleButton
                  ids={{
                    routineId: routineId,
                    habitId: habitId,
                    subTaskId: subTask.id,
                  }}
                  DTO={subTask}
                />
                <h4 className="text-base w-full">- {subTask.title}</h4>
              </div>
              <div className="flex flex-row flex-wrap justify-between items-center">
                <StreakBadge streak={subTask.streak} />
                <div className="flex flex-row flex-nowrap gap-gap-sm items-center">
                  <EditionButton
                    border={true}
                    to={`${routineId}/${habitId}/${subTask.id}/edit`}
                  />
                  <DeletionButton
                    border={true}
                    targetTitle={subTask.title}
                    ids={{
                      routineId,
                      habitId,
                      subTaskId: subTask.id,
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
          {subTasks.length < 10 && (
            <li className="self-center py-gap-sm">
              <ActionButton to={`/${routineId}/${habitId}/new-sub-task`}>
                + Adicionar nova sub-tarefa
              </ActionButton>
            </li>
          )}
        </div>
      </ul>
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

  const onClick = () => {
    if (
      isPending ||
      !confirm(
        `Confirmar ${DTO.isComplete ? "desfazimento" : "conclusão"} de "${DTO.title}"`,
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
  };

  if (DTO.isComplete) {
    return (
      <button
        onClick={onClick}
        className="group flex flex-row flex-nowrap gap-gap-sm items-center hover:cursor-pointer"
      >
        <SquareCheckBig
          className="transition-all duration-[.25s] group-hover:rotate-z-[-25deg] group-active:rotate-z-[5deg] group-hover:cursor-pointer"
          size={22.5}
          color="#4ade80"
        />
        <Undo className="button-basics-group" size={22.5} color="#ffffff" />
      </button>
    );
  }

  return (
    <button onClick={onClick} className="button-basics">
      <Square size={22.5} color="#ffffff" />
    </button>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    streak > 0 && (
      <div className="flex flex-row flex-nowrap items-center gap-gap-xs px-[5px] py-[2.5px]">
        <Flame color="#f97316" size={22} />
        <p className="text-nowrap text-streak">
          {streak} Dia{streak > 1 ? "s" : ""}
        </p>
      </div>
    )
  );
}

function EditionButton({
  to,
  border = false,
}: {
  to: string;
  border?: boolean;
}) {
  return (
    <Link
      className={`button-basics bg-surface bg-[red] p-[7.5px] rounded-sm ${border && "main-border"}`}
      to={to}
    >
      <Pencil size={20} />
    </Link>
  );
}

function DeletionButton({
  ids,
  targetTitle,
  border = false,
}: {
  border?: boolean;
  targetTitle: string;
  ids: { routineId: string; habitId?: string; subTaskId?: string };
}) {
  const { mutate: deleteResource, isPending } = useDeleteResource();

  const handleClick = () => {
    if (!confirm(`Confirmar exclusão de "${targetTitle}"?`)) {
      return;
    }

    deleteResource(ids, {
      onSettled(data, error) {
        alert(API_MESSAGES.get((data?.code ?? error?.code)!));
      },
    });
  };

  return (
    <button
      className={`button-basics bg-surface bg-[red] p-[7.5px] rounded-sm active:bg-danger-foreground ${border && "main-border border-danger"}`}
      disabled={isPending}
      onClick={handleClick}
    >
      <Trash2 color="#ef4444" size={20} />
    </button>
  );
}
