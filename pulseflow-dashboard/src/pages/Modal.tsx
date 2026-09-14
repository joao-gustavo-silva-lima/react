import {
  useForm,
  useFieldArray,
  type SubmitHandler,
  type FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORIES_TO_PT_BR,
  habitSchema,
  type Habit,
} from "../types/routines.types";

export default function Modal() {
  const {
    control,
    trigger,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(habitSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "subTasks",
    control,
  });

  const onSubmit: SubmitHandler<Habit> = (data) => {
    console.log(data);
  };

  return (
    <>
      <h2>NOVO HÁBITO</h2>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
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
              <option value=""></option>
              {Array.from(CATEGORIES_TO_PT_BR).map(([category, label]) => (
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
