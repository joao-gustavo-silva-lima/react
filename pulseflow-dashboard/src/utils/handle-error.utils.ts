import type { FieldPath, UseFormSetError } from "react-hook-form";
import { API_MESSAGES } from "../api/messages.api";
import type { DTO } from "../types/routines.types";
import { StatefulError } from "./stateful-error.utils";
import { toast } from "react-toastify";

export default function handleFormError<TDTO extends DTO>(
  error: StatefulError,
  setFormError: UseFormSetError<TDTO>,
  unexpectedErrorMessage: string,
) {
  toast.error(
    API_MESSAGES.get(error.code) ??
      unexpectedErrorMessage ??
      "Não foi possível salvar os dados. Tente novamente.",
  );

  if (error.appendix?.zodErrors) {
    Object.entries(error.appendix.zodErrors).forEach(([field, message]) => {
      setFormError(field as FieldPath<TDTO>, {
        type: "server",
        message: API_MESSAGES.get(message),
      });
    });
  }
}
