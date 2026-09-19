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
    return <p>Carregando rotina...</p>;
  }

  if (
    routineFetchingError?.status === 404 ||
    habitFetchingError?.status === 404
  ) {
    return (
      <p>404 - {habitFetchingError ? "Hábito" : "Rotina"} não encontrado.</p>
    );
  }

  if (routineFetchingError || habitFetchingError) {
    return (
      <p>
        {API_MESSAGES.get((habitFetchingError ?? routineFetchingError)!.code) ??
          "Não foi possível carregar o recurso."}
      </p>
    );
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
    >
      <h2>{mode === "create" ? "NOVO HÁBITO" : "EDITAR HÁBITO"}</h2>
      <p>Rotina: {routine?.title}</p>
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
        disabled={mode === "create" ? isCreatingHabit : isPatchingHabit}
        type="submit"
        value={mode === "create" ? "Criar Novo Hábito" : "Editar Hábito"}
      />
    </form>
  );
}
