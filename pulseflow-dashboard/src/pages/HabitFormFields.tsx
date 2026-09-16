import {
  type FieldPath,
  type FieldErrors,
  type UseFieldArrayReturn,
  type UseFormRegisterReturn,
} from "react-hook-form";
import {
  type Habit,
  type HabitFormInput,
  CATEGORIES_TO_PT_BR,
} from "../types/routines.types";

export default function HabitFormFields({
  errors,
  trigger,
  register,
  fieldsArrayReturn,
}: {
  errors: FieldErrors<Habit>;
  fieldsArrayReturn: UseFieldArrayReturn<HabitFormInput>;
  trigger: (k: FieldPath<Habit>) => Promise<boolean>;
  register: (k: FieldPath<Habit>) => UseFormRegisterReturn;
}) {
  const { fields, append, remove } = fieldsArrayReturn;

  return (
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
            onClick={async () => {
              const subTasksAreValid = await trigger("subTasks");

              if (subTasksAreValid) {
                append({ title: "" });
              }
            }}
            type="button"
            value="Adicionar Sub-tarefa"
          />
          {errors.subTasks?.root && <p>{errors.subTasks!.root.message}</p>}
        </div>
      </div>
    </fieldset>
  );
}
