import type { FieldValues, FieldPath } from "react-hook-form";

export default function useFieldPathHandler<TForm extends FieldValues>(
  fieldPrefix: string,
) {
  return (path: string) =>
    (fieldPrefix ? `${fieldPrefix}.${path}` : path) as FieldPath<TForm>;
}
