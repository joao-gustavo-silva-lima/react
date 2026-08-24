import { useState } from "react";
import {
  EXPECTED_FORM_INPUT_IDS,
  modalFormDataSchema,
} from "../types/links.types";
import { z } from "zod";

export default function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(e: React.SubmitEvent<HTMLFormElement>) {
    const formDataRaw = Object.fromEntries(new FormData(e.currentTarget));
    const validation = modalFormDataSchema.safeParse(formDataRaw);

    if (!validation.success) {
      const errors = parseZodErrors(validation.error.issues);
      setErrors(errors);
      return false;
    }

    return true;
  }

  return { inputErrors: errors, validate };
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
