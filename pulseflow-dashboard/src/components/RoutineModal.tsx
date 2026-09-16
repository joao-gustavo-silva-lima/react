import {
  routineSchema,
  type Routine,
  type HabitFormInput,
  type RoutineFormInput,
} from "../types/routines.types";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HabitFormFields from "./HabitFormFields";

export default function RoutineModal() {
  const {
    control,
    trigger,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoutineFormInput, unknown, Routine>({
    resolver: zodResolver(routineSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "habits",
  });

  const onSubmit: SubmitHandler<Routine> = (data) => {
    console.log(data);
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
              <button type="button" onClick={() => remove(index)}>
                Remover hábito
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: "" } as HabitFormInput)}
          >
            Criar Novo Hábito
          </button>
        </fieldset>
        <input
          disabled={fields.length === 0 || errors.habits !== undefined}
          type="submit"
          value="Criar"
        />
      </form>
    </>
  );
}
