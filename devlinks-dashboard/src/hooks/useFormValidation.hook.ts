import { useState } from "react";
import { modalFormDataSchema, type ModalFormData } from "../types/links.types";
import { z } from "zod";

export default function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateInput(
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const inputName = e.target.name as keyof ModalFormData;
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
