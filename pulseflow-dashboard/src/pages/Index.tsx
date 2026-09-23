import { Link } from "react-router";
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
import { useState } from "react";
import filterRoutines from "../utils/filter-routines.utils";
import Fallback from "./Fallback";
import ActionButton from "../components/ActionButton";
import {
  ChevronDown,
  Pencil,
  Square,
  SquareCheckBig,
  Trash2,
} from "lucide-react";

export default function Index() {
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

  if (isFetchingRoutines) {
    return <p>Carregando rotinas...</p>;
  }

  if (routinesFetchingError !== null) {
    <Fallback
      message={
        API_MESSAGES.get(routinesFetchingError.code) ??
        "Algum erro ocorreu ao tentar buscar as rotinas..."
      }
    />;
  }

  return (
    <main className="contained flex flex-col gap-gap-lg">
      <h1 className="font-bold text-xl capitalize">{formatDate(new Date())}</h1>
      <SearchBar query={query} setQuery={setQuery} />
      <h3 className="text-lg font-semibold">Rotinas, Hábitos & Tarefas</h3>
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
        <ul className="flex flex-col gap-gap-lg">
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
                  <EditionButton to={`${routine.id}/edit`} />
                  <DeletionButton
                    targetTitle={routine.title}
                    ids={{
                      routineId: routine.id!,
                    }}
                  />
                </div>
              </div>
              <hr className="main-border" />
              <div className="flex flex-row text-nowrap gap-gap-sm items-center">
                <p
                  className={
                    routine.isComplete ? "text-primary" : "text-pendent"
                  }
                >
                  {routine.isComplete ? "✅ Concluído" : "⏳ Pendente"}
                </p>
                <StreakBadge streak={routine.streak} />
              </div>
              <ul className="flex flex-col gap-gap-md">
                {routine.habits.map((habit) => (
                  <li
                    className="flex flex-col gap-gap-sm bg-surface p-card-p rounded-sm main-border"
                    id={habit.id}
                    key={habit.id}
                  >
                    <div className="flex flex-row flex-nowrap gap-gap-md">
                      {habit.subTasks.length === 0 && (
                        <DailyStatusToggleButton
                          ids={{
                            routineId: routine.id!,
                            habitId: habit.id,
                          }}
                          DTO={habit}
                        />
                      )}
                      <h3 className="capitalize font-medium">{habit.title}</h3>
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
                  <li>
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
    </main>
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
          <ChevronDown width={20} />
        </button>
      </div>
      <ul
        className={`transition-all duration-[.25s] ${isOpen ? "max-h-[none] p-card-p" : "max-h-0 p-0"} overflow-y-hidden`}
      >
        {subTasks.map((subTask) => (
          <li id={subTask.id} key={subTask.id}>
            <h4>{subTask.title}</h4>
            <StreakBadge streak={subTask.streak} />
            <p>{subTask.isComplete ? "✅" : "⏳"}</p>
            <DailyStatusToggleButton
              ids={{
                routineId: routineId,
                habitId: habitId,
                subTaskId: subTask.id,
              }}
              DTO={subTask}
            />
            <EditionButton to={`${routineId}/${habitId}/${subTask.id}/edit`} />
            <DeletionButton
              targetTitle={subTask.title}
              ids={{
                routineId: routineId,
                habitId: habitId,
                subTaskId: subTask.id,
              }}
            />
          </li>
        ))}
        {subTasks.length < 10 && (
          <li>
            <Link to={`/${routineId}/${habitId}/new-sub-task`}>
              + Adicionar nova sub-tarefa
            </Link>
          </li>
        )}
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

  return (
    <button onClick={onClick} className="button-basics">
      {DTO.isComplete ? (
        <SquareCheckBig width={20} color="#4ade80" />
      ) : (
        <Square width={20} color="#ffffff" />
      )}
    </button>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    streak > 0 && (
      <p className="text-nowrap text-streak px-[5px] py-[2.5px]">
        🔥 {streak} Dia{streak > 1 ? "s" : ""}
      </p>
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
      <Pencil width={20} />
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
      <Trash2 color="#ef4444" width={20} />
    </button>
  );
}
