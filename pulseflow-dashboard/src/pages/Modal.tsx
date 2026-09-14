import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORIES_TO_PT_BR,
  CreateHabitSchema,
  type CreateHabitDTO,
} from "../types/routines.types";
import { useParams } from "react-router";
import { useFetchRoutineById } from "../hooks/useRoutines";

export default function Modal() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateHabitSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "subTasks",
    control,
  });

  const onSubmit: SubmitHandler<CreateHabitDTO> = (data) => {
    console.log(data);
  };

  const { routineId } = useParams();
  const isMutatingRoutine = routineId !== undefined;
  const {
    data: routine,
    isFetching,
    isError,
    error: fetchingError,
  } = isMutatingRoutine ? useFetchRoutineById(routineId) : {};

  if (isMutatingRoutine && isFetching) {
    return <p>Carregando dados da rotina...</p>;
  }

  if (isMutatingRoutine && isError) {
    return <p>{fetchingError!.message}</p>;
  }

  return (
    <>
      <h2>NOVO HÁBITO</h2>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div>
            <label htmlFor="routineId">Título da Rotina</label>
            <input
              placeholder="Rotina de Saúde..."
              defaultValue={routine?.title}
              readOnly={isMutatingRoutine}
              {...register("routineId")}
            />

            {errors.routineId && <p>{errors.routineId.message}</p>}
          </div>
          <div>
            <label htmlFor="title">Título do Hábito</label>
            <input
              type="text"
              id="title"
              placeholder="Correr 15 Km..."
              {...register("title")}
            />
            {errors.title && <p>{errors.title.message}</p>}
          </div>
          <div>
            <label>Categoria</label>
            <select id="category" {...register("category")}>
              <option value="">Selecione uma categoria</option>
              {[...CATEGORIES_TO_PT_BR].map(([category, label]) => (
                <option key={category} value={category}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && <p>{errors.category.message}</p>}
          </div>
          <div>
            <label>
              Subtarefas{" "}
              {fields.length > 0 && <span>{`(${fields.length} / 10)`}</span>}
            </label>
            {fields.map((field, index) => (
              <div key={field.id}>
                <div>
                  <input {...register(`subTasks.${index}.title`)} />
                  <input
                    onClick={() => remove(index)}
                    type="button"
                    value="excluir"
                  />
                </div>
                {errors.subTasks && errors.subTasks[index] && (
                  <p>{errors.subTasks[index]?.title?.message}</p>
                )}
              </div>
            ))}
            <div>
              <input
                disabled={fields.length >= 10}
                onClick={() => {
                  if (errors.subTasks === undefined) {
                    append({ title: "" });
                  }
                }}
                type="button"
                value="Adicionar Sub-tarefa"
              />
              {errors.subTasks?.root && <p>{errors.subTasks!.root.message}</p>}
            </div>
          </div>
          <input type="submit" value="Criar" />
        </fieldset>
      </form>
    </>
  );
}
