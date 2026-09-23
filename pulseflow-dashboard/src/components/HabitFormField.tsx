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
    <fieldset className="flex flex-col gap-gap-md">
      <div className="flex flex-col gap-gap-xs">
        <label className="text-sm font-medium" htmlFor="title">
          Título do hábito
        </label>
        <input
          className="w-full rounded-sm main-border bg-surface px-[0.75rem] py-[0.625rem] text-sm placeholder:text-text-muted focus:border-primary"
          type="text"
          id="title"
          placeholder="Correr 15 Km..."
          {...register(fieldPath("title"))}
        />
        {get(errors, fieldPath("title"))?.message && (
          <p className="text-xs text-danger">
            {get(errors, fieldPath("title")).message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-gap-xs">
        <label className="text-sm font-medium" htmlFor="category">
          Categoria
        </label>
        <select
          className="w-full rounded-sm main-border bg-surface px-[0.75rem] py-[0.625rem] text-sm focus:border-primary"
          id="category"
          {...register(fieldPath("category"))}
        >
          <option value="">Selecione uma categoria</option>
          {[...CATEGORIES_TO_PT_BR].map(([category, label]) => (
            <option key={category} value={category}>
              {label}
            </option>
          ))}
        </select>
        {get(errors, fieldPath("category"))?.message && (
          <p className="text-xs text-danger">
            {get(errors, fieldPath("category")).message}
          </p>
        )}
      </div>
      {mode === "create" && (
        <div className="flex flex-col gap-gap-sm border-t-[1px] border-border pt-gap-md">
          <label className="text-sm font-medium">
            Subtarefas{" "}
            {fields.length > 0 && <span>{`(${fields.length} / 10)`}</span>}
          </label>
          <div className="flex flex-col gap-gap-sm">
            {fields.map((field, index) => (
              <div className="flex flex-col gap-gap-xs" key={field.id}>
                <div className="flex gap-gap-sm">
                  <input
                    className="min-w-0 flex-1 rounded-sm main-border bg-surface px-[0.75rem] py-[0.5rem] text-sm focus:border-primary"
                    placeholder="Ex.: Beber 500ml de água"
                    {...register(fieldPath(`subTasks.${index}.title`))}
                  />
                  <input
                    className="rounded-sm main-border border-danger px-[0.625rem] py-[0.5rem] text-xs text-danger hover:bg-danger-foreground hover:cursor-pointer"
                    onClick={() => remove(index)}
                    type="button"
                    value="Excluir"
                  />
                </div>
                {get(errors, fieldPath(`subTasks.${index}.title`))?.message && (
                  <p className="text-xs text-danger">
                    {get(errors, fieldPath(`subTasks.${index}.title`)).message}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div>
            <input
              className="w-full rounded-md main-border border-primary px-[0.75rem] py-[0.5rem] text-sm font-medium text-primary hover:bg-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              disabled={fields.length >= 10}
              onClick={async () => {
                const subTasksAreValid = await trigger(fieldPath("subTasks"));

                if (subTasksAreValid) {
                  appendSubTask({ title: "" });
                }
              }}
              type="button"
              value="+ Adicionar sub-tarefa"
            />
            {get(errors, fieldPath("subTasks.root"))?.message && (
              <p className="mt-gap-xs text-xs text-danger">
                {get(errors, fieldPath("subTasks.root")).message}
              </p>
            )}
          </div>
        </div>
      )}
    </fieldset>
  );
}
