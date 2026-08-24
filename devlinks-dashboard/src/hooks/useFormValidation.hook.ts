import { useState } from "react";
import {
  EXPECTED_FORM_INPUT_IDS,
  modalFormDataSchema,
  type FormInputNames,
} from "../types/links.types";
import { z } from "zod";

type SomeFormInput = HTMLInputElement | HTMLSelectElement;
type SomeInputEvent<T> = React.ChangeEvent<T> | React.FocusEvent<T>;

export default function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateInput(e: SomeInputEvent<SomeFormInput>) {
    const inputName = e.target.name as FormInputNames;
    const validation = modalFormDataSchema.shape[inputName].safeParse(
      e.target.value,
    );

    if (validation.success) {
      setErrors(({ [inputName]: _, ...remainingErrors }) => remainingErrors);
      return true;
    }

    if (e.type === "change") {
      return false;
    }

    const errorMessage = validation.error.issues[0]?.message;

    setErrors({ ...errors, [inputName]: errorMessage });

    return false;
  }

  function validateSubmission(form: HTMLFormElement) {
    const formDataRaw = Object.fromEntries(new FormData(form));
    const validation = modalFormDataSchema.safeParse(formDataRaw);

    if (!validation.success) {
      const errors = parseZodErrors(validation.error.issues);
      setErrors(errors);
      return false;
    }

    return true;
  }

  return { inputErrors: errors, validateInput, validateSubmission };
}

function parseZodErrors(issues: z.core.$ZodIssue[]) {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const inputID = String(issue.path[0] ?? "");

    if (EXPECTED_FORM_INPUT_IDS.includes(inputID as any)) {
      errors[inputID] = issue.message;
    }
  }

  return errors;
}
