import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  habitSchema,
  type Habit,
  type HabitFormInput,
} from "../types/routines.types";
import { useNavigate, useParams } from "react-router";
import {
  useCreateResource,
  useFetchRoutineById,
  usePatchResource,
} from "../hooks/useRoutines";
import { API_MESSAGES } from "../api/messages.api";
import HabitFormField from "./HabitFormField";
import handleFormError from "../utils/handle-error.utils";

export default function HabitModal({ mode }: { mode: "create" | "patch" }) {
  const {
    control,
    register,
    setError,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<HabitFormInput, unknown, Habit>({
    resolver: zodResolver<HabitFormInput, unknown, Habit>(habitSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { routineId, habitId } = useParams();
  const {
    data: routine,
    error: routineFetchingError,
    isFetching: isFetchingRoutine,
  } = useFetchRoutineById(routineId);

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

  if (isFetchingRoutine) {
    return <p>Carregando rotina...</p>;
  }

  if (routineFetchingError) {
    //Return 404 or broken page
    return (
      <p>
        Oops...{" "}
        {API_MESSAGES.get(routineFetchingError.code) ??
          "Um erro inesperado ocorreu. Tente novamente mais tarde."}
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
        mode="patch"
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
