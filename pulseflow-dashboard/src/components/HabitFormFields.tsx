import {
  get,
  useFieldArray,
  type ArrayPath,
  type FieldErrors,
  type FieldPath,
  type UseFieldArrayProps,
  type UseFormTrigger,
  type UseFormRegister,
  type Control,
  type FieldValues,
} from "react-hook-form";
import {
  type SubTaskFormInput,
  CATEGORIES_TO_PT_BR,
} from "../types/routines.types";
import SubTasksFormFields from "./SubTasksFormFIelds";

export default function HabitFormFields<TForm extends FieldValues>({
  errors,
  trigger,
  register,
  fieldPrefix,
  subTaskFieldArrayProps,
}: {
  fieldPrefix: string;
  control: Control<TForm>;
  errors: FieldErrors<TForm>;
  trigger: UseFormTrigger<TForm>;
  register: UseFormRegister<TForm>;
  subTaskFieldArrayProps: UseFieldArrayProps<TForm, ArrayPath<TForm>>;
}) {
  const { fields, append, remove } = useFieldArray(subTaskFieldArrayProps);
  const appendSubTask = append as (value: SubTaskFormInput) => void;
  const fieldPath = (path: string) =>
    (fieldPrefix ? `${fieldPrefix}.${path}` : path) as FieldPath<TForm>;

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
      <SubTasksFormFields
        errors={errors}
        trigger={trigger}
        register={register}
        fieldPath={fieldPath}
        subTaskFieldArrayProps={subTaskFieldArrayProps}
      />
    </fieldset>
  );
}
