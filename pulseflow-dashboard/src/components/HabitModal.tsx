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
import ActionButton from "./ActionButton";
import Fallback from "../pages/Fallback";
import { toast } from "react-toastify";

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
        onSuccess() {
          toast.success(
            `Hábito ${title ? `"${title}"` : ""} atualizado com sucesso.`,
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
            "Não foi possível criar o hábito. Verifique os dados e tente novamente.",
          ),
        onSuccess(response) {
          const habitTitle = (response.data as Habit)?.title;

          toast.success(
            `Hábito ${habitTitle ? `"${habitTitle}"` : ""} criado com sucesso.`,
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
          Carregando {isFetchingHabit ? "Hábito" : "Rotina"}...
        </p>
      </div>
    );
  }

  if (
    routineFetchingError?.status === 404 ||
    habitFetchingError?.status === 404
  ) {
    return (
      <Fallback
        message={
          habitFetchingError
            ? "O hábito não foi encontrado."
            : "A rotina não foi encontrada."
        }
      />
    );
  }

  if (routineFetchingError || habitFetchingError) {
    return (
      <Fallback
        message={
          API_MESSAGES.get(
            (habitFetchingError ?? routineFetchingError)?.code ?? "",
          ) ?? "Não foi possível carregar os dados para este formulário."
        }
      />
    );
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
      className="surface rounded-[0] bp-sm:rounded-lg main-border flex w-full max-w-[450px] h-dvh bp-sm:h-fit max-h-dvh overflow-y-auto flex-col gap-gap-lg"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-primary">
        Rotina: {routine?.title}
      </p>
      <h2 className="text-lg font-semibold">
        {mode === "create" ? "Novo hábito" : "Editar hábito"}
      </h2>
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
      <div className="flex flex-row flex-wrap justify-end gap-gap-sm">
        <ActionButton additionalClassName="flex-1" to="/">
          Cancelar
        </ActionButton>
        <ActionButton
          additionalClassName="flex-1"
          type="submit"
          disabled={mode === "create" ? isCreatingHabit : isPatchingHabit}
        >
          {mode === "create" ? "Criar novo hábito" : "Salvar alterações"}
        </ActionButton>
      </div>
    </form>
  );
}
