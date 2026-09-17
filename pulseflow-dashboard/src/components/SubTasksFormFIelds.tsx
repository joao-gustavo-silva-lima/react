import {
  type UseFieldArrayProps,
  type ArrayPath,
  useFieldArray,
  get,
  type FieldValues,
  type UseFormTrigger,
  type FieldPath,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { SubTaskFormInput } from "../types/routines.types";

export default function SubTasksFormFields<TForm extends FieldValues>({
  errors,
  trigger,
  register,
  fieldPath,
  subTaskFieldArrayProps,
}: {
  errors: FieldErrors<TForm>;
  trigger: UseFormTrigger<TForm>;
  register: UseFormRegister<TForm>;
  fieldPath: (path: string) => FieldPath<TForm>;
  subTaskFieldArrayProps: UseFieldArrayProps<TForm, ArrayPath<TForm>>;
}) {
  const { fields, append, remove } = useFieldArray(subTaskFieldArrayProps);
  const appendSubTask = append as (value: SubTaskFormInput) => void;

  return (
    <fieldset>
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
            <p>{get(errors, fieldPath(`subTasks.${index}.title`)).message}</p>
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
    </fieldset>
  );
}
