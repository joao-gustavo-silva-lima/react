import { useForm, type FieldPath, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  habitSchema,
  type Habit,
  type HabitFormInput,
} from "../types/routines.types";
import { useNavigate, useParams } from "react-router";
import { useCreateHabit, useFetchRoutineById } from "../hooks/useRoutines";
import { API_MESSAGES } from "../api/messages.api";
import HabitFormFields from "./HabitFormFields";

export default function HabitModal() {
  const {
    control,
    register,
    setError,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver<HabitFormInput, unknown, Habit>(habitSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { routineId } = useParams();
  const {
    data: routine,
    error: routineFetchingError,
    isFetching: isFetchingRoutine,
  } = useFetchRoutineById(routineId);
  const { mutate: createHabit, isPending: isCreatingHabit } = useCreateHabit();

  const onSubmit: SubmitHandler<Habit> = async (habit) => {
    createHabit(
      { routineId: routineId!, habit },
      {
        onError(error) {
          if (error.appendix?.zodErrors) {
            Object.entries(error.appendix.zodErrors).forEach(
              ([field, message]) => {
                setError(field as FieldPath<Habit>, {
                  type: "server",
                  message: API_MESSAGES.get(message),
                });
              },
            );
          } else {
            alert(
              API_MESSAGES.get(error.code) ??
                "Um erro ocorreu durante a criação do hábito. Tente novamente depois.",
            );
          }
        },
        onSuccess(response) {
          const habitTitle = response.data?.title;

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
    <>
      <h2>NOVO HÁBITO</h2>
      <p>Rotina: {routine?.title}</p>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <HabitFormFields
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
        <input disabled={isCreatingHabit} type="submit" value="Criar" />
      </form>
      {/* Display existent habits here */}
    </>
  );
}
