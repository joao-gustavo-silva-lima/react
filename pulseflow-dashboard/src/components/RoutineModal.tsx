import {
  routineSchema,
  type Routine,
  type HabitFormInput,
  type RoutineFormInput,
} from "../types/routines.types";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HabitFormFields from "./HabitFormFields";
import { useCreateResource } from "../hooks/useRoutines";
import handleFormError from "../utils/handle-error.utils";
import { useNavigate } from "react-router";

export default function RoutineModal() {
  const {
    control,
    trigger,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<RoutineFormInput, unknown, Routine>({
    resolver: zodResolver(routineSchema),
    mode: "onChange",
    defaultValues: {
      habits: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "habits",
  });

  const { mutate: createRoutine, isPending: isCreatingRoutine } =
    useCreateResource();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Routine> = (data) => {
    createRoutine(
      { DTO: data },
      {
        onError: (error) =>
          handleFormError(
            error,
            setError,
            "Um erro ocorreu durante a criação da rotina. Tente novamente depois.",
          ),
        onSuccess(response) {
          const habitTitle = (response.data as Routine)?.title;

          alert(
            `A rotina ${habitTitle ? `"${habitTitle}"` : ""} foi criada com sucesso.`,
          );

          navigate(`/`);
        },
      },
    );
  };

  return (
    <>
      <h2>NOVA ROTINA</h2>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div>
            <label htmlFor="routine-title">Título da Rotina</label>
            <input type="text" id="routine-title" {...register("title")} />
            {errors.title?.message && <p>{errors.title.message}</p>}
          </div>
          <p>Hábitos</p>
          {fields.map((field, index) => (
            <div key={field.id}>
              <HabitFormFields
                errors={errors}
                trigger={trigger}
                control={control}
                register={register}
                fieldPrefix={`habits.${index}`}
                subTaskFieldArrayProps={{
                  control,
                  name: `habits.${index}.subTasks`,
                }}
              />
              {index > 0 && (
                <button type="button" onClick={() => remove(index)}>
                  Remover hábito
                </button>
              )}
            </div>
          ))}
          <button
            disabled={fields.length >= 15 || errors.habits !== undefined}
            type="button"
            onClick={async () => {
              const habitsAreValid = await trigger("habits");

              if (habitsAreValid) {
                append({ title: "" } as HabitFormInput);
              }
            }}
          >
            Criar Novo Hábito
          </button>
        </fieldset>
        <input
          disabled={
            isCreatingRoutine ||
            fields.length === 0 ||
            errors.habits !== undefined
          }
          type="submit"
          value="Criar"
        />
      </form>
    </>
  );
}
