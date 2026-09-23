import { useEffect } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  habitSchema,
  type Habit,
  type HabitFormInput,
} from "../types/routines.types";
import { useNavigate, useParams } from "react-router";
import {
  useCreateResource,
  useFetchHabitById,
  useFetchRoutineById,
  usePatchResource,
} from "../hooks/useRoutines";
import { API_MESSAGES } from "../api/messages.api";
import HabitFormField from "./HabitFormField";
import handleFormError from "../utils/handle-error.utils";

export default function HabitModal({ mode }: { mode: "create" | "patch" }) {
  const { routineId, habitId } = useParams();
  const navigate = useNavigate();

  const {
    data: routine,
    error: routineFetchingError,
    isFetching: isFetchingRoutine,
  } = useFetchRoutineById(routineId);
  const {
    data: habit,
    error: habitFetchingError,
    isFetching: isFetchingHabit,
  } = useFetchHabitById(routineId, habitId);

  const {
    reset,
    control,
    register,
    setError,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<HabitFormInput, unknown, Habit>({
    resolver: zodResolver(
      mode === "create"
        ? habitSchema
        : habitSchema.pick({ title: true, category: true }),
    ) as unknown as Resolver<HabitFormInput, unknown, Habit>,
    mode: "onChange",
    defaultValues:
      mode === "patch" && habit
        ? { title: habit.title, category: habit.category }
        : undefined,
  });

  useEffect(() => {
    if (mode === "patch" && habit) {
      reset({ title: habit.title, category: habit.category });
    }
  }, [habit, mode, reset]);

  const { mutate: createHabit, isPending: isCreatingHabit } =
    useCreateResource();
  const { mutate: patchHabit, isPending: isPatchingHabit } = usePatchResource();

  const onSubmitPatch: SubmitHandler<Habit> = ({ title, category }) => {
    patchHabit(
      { routineId: routineId!, habitId: habitId!, DTO: { title, category } },
      {
        onError: (error) =>
          handleFormError(
            error,
            setError,
            "Um erro ocorreu durante a edição do hábito. Tente novamente depois.",
          ),
        onSuccess(_) {
          alert(
            `O hábito ${title ? `"${title}"` : ""} foi criado com sucesso.`,
          );

          navigate(`/`);
        },
      },
    );
  };
  const onSubmit: SubmitHandler<Habit> = (habit) => {
    createHabit(
      { routineId: routineId!, DTO: habit },
      {
        onError: (error) =>
          handleFormError(
            error,
            setError,
            "Um erro ocorreu durante a criação do hábito. Tente novamente depois.",
          ),
        onSuccess(response) {
          const habitTitle = (response.data as Habit)?.title;

          alert(
            `O hábito ${habitTitle ? `"${habitTitle}"` : ""} foi criado com sucesso.`,
          );

          navigate(`/`);
        },
      },
    );
  };

  if (isFetchingRoutine || (mode === "patch" && isFetchingHabit)) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 p-screen-px">
        <p className="surface main-border w-full max-w-[560px] text-center text-text-secondary animate-pulse">
          Carregando hábito...
        </p>
      </div>
    );
  }

  if (
    routineFetchingError?.status === 404 ||
    habitFetchingError?.status === 404
  ) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 p-screen-px">
        <p className="surface main-border w-full max-w-[560px] text-center text-danger">
          404 - {habitFetchingError ? "Hábito" : "Rotina"} não encontrado.
        </p>
      </div>
    );
  }

  if (routineFetchingError || habitFetchingError) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 p-screen-px">
        <p className="surface main-border w-full max-w-[560px] text-center text-danger">
          {API_MESSAGES.get(
            (habitFetchingError ?? routineFetchingError)!.code,
          ) ?? "Não foi possível carregar o recurso."}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-background/80 p-screen-px">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
        className="surface main-border flex w-full max-w-[560px] flex-col gap-gap-lg"
      >
        <div className="flex flex-col gap-gap-xs border-b-[1px] border-border pb-gap-md">
          <p className="text-xs uppercase tracking-[0.12em] text-primary">
            Rotina: {routine?.title}
          </p>
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Novo hábito" : "Editar hábito"}
          </h2>
        </div>
        <HabitFormField
          mode={mode}
          fieldPrefix=""
          errors={errors}
          control={control}
          trigger={trigger}
          register={register}
          subTaskFieldArrayProps={{
            control,
            name: "subTasks",
          }}
        />
        <input
          className="w-full rounded-md bg-primary px-[1rem] py-[0.625rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={mode === "create" ? isCreatingHabit : isPatchingHabit}
          type="submit"
          value={mode === "create" ? "Criar novo hábito" : "Salvar alterações"}
        />
      </form>
    </div>
  );
}
