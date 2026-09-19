import {
  get,
  type ArrayPath,
  type FieldErrors,
  type FieldPath,
  type UseFieldArrayProps,
  type UseFormTrigger,
  type UseFormRegister,
  type Control,
  type FieldValues,
  useFieldArray,
} from "react-hook-form";
import {
  CATEGORIES_TO_PT_BR,
  type SubTaskFormInput,
} from "../types/routines.types";

export default function HabitFormField<TForm extends FieldValues>({
  mode,
  errors,
  trigger,
  register,
  fieldPrefix,
  subTaskFieldArrayProps,
}: {
  fieldPrefix: string;
  control: Control<TForm>;
  mode: "create" | "patch";
  errors: FieldErrors<TForm>;
  trigger: UseFormTrigger<TForm>;
  register: UseFormRegister<TForm>;
  subTaskFieldArrayProps: UseFieldArrayProps<TForm, ArrayPath<TForm>>;
}) {
  const fieldPath = (path: string) =>
    (fieldPrefix ? `${fieldPrefix}.${path}` : path) as FieldPath<TForm>;

  const { fields, append, remove } = useFieldArray(subTaskFieldArrayProps);
  const appendSubTask = append as (value: SubTaskFormInput) => void;

  return (
    <fieldset>
      <div>
        <label htmlFor="title">Título do Hábito</label>
        <input
          type="text"
          id="title"
          placeholder="Correr 15 Km..."
          {...register(fieldPath("title"))}
        />
        {get(errors, fieldPath("title"))?.message && (
          <p>{get(errors, fieldPath("title")).message}</p>
        )}
      </div>
      <div>
        <label>Categoria</label>
        <select id="category" {...register(fieldPath("category"))}>
          <option value="">Selecione uma categoria</option>
          {[...CATEGORIES_TO_PT_BR].map(([category, label]) => (
            <option key={category} value={category}>
              {label}
            </option>
          ))}
        </select>
        {get(errors, fieldPath("category"))?.message && (
          <p>{get(errors, fieldPath("category")).message}</p>
        )}
      </div>
      {mode === "create" && (
        <div>
          <label>
            Subtarefas{" "}
            {fields.length > 0 && <span>{`(${fields.length} / 10)`}</span>}
          </label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div>
                <input {...register(fieldPath(`subTasks.${index}.title`))} />
                <input
                  onClick={() => remove(index)}
                  type="button"
                  value="excluir"
                />
              </div>
              {get(errors, fieldPath(`subTasks.${index}.title`))?.message && (
                <p>
                  {get(errors, fieldPath(`subTasks.${index}.title`)).message}
                </p>
              )}
            </div>
          ))}
          <div>
            <input
              disabled={fields.length >= 10}
              onClick={async () => {
                const subTasksAreValid = await trigger(fieldPath("subTasks"));

                if (subTasksAreValid) {
                  appendSubTask({ title: "" });
                }
              }}
              type="button"
              value="Adicionar Sub-tarefa"
            />
            {get(errors, fieldPath("subTasks.root"))?.message && (
              <p>{get(errors, fieldPath("subTasks.root")).message}</p>
            )}
          </div>
        </div>
      )}
    </fieldset>
  );
}
