import { useState } from "react";
import { modalFormDataSchema, type ModalFormData } from "../types/links.types";
import { z } from "zod";

export default function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateInput(
    name: keyof ModalFormData,
    value: string,
    dismissErrors: boolean = false,
  ) {
    const validation = modalFormDataSchema.shape[name].safeParse(value);

    if (validation.success) {
      setErrors(({ [name]: _, ...remainingErrors }) => remainingErrors);
      return true;
    }

    if (dismissErrors) {
      return false;
    }

    const errorMessage = validation.error.issues[0]?.message;

    setErrors({ ...errors, [name]: errorMessage });

    return false;
  }

  function validateSubmission(form: HTMLFormElement) {
    const formDataRaw = Object.fromEntries(new FormData(form));
    const validation = modalFormDataSchema.safeParse(formDataRaw);

    if (!validation.success) {
      const errors = parseZodErrors(validation.error.issues);
      setErrors(errors);
      return { success: false };
    }

    return { success: true, validFormData: formDataRaw as ModalFormData };
  }

  return { inputErrors: errors, validateInput, validateSubmission };
}

function parseZodErrors(issues: z.core.$ZodIssue[]) {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const inputID = String(issue.path[0] ?? "");

    errors[inputID] = issue.message;
  }

  return errors;
}
