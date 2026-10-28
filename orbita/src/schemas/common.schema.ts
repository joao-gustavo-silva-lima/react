import * as z from "zod";
import { API_MESSAGES } from "../api/messages.api";

export const usernameSchema = z
  .string({
    error: API_MESSAGES.get("USERNAME_REQUIRED") ?? "Dado inválido.",
  })
  .trim()
  .toLowerCase()
  .min(3, {
    error: API_MESSAGES.get("USERNAME_TOO_SHORT") ?? "Dado inválido.",
  })
  .max(30, {
    error: API_MESSAGES.get("USERNAME_TOO_LONG") ?? "Dado inválido.",
  })
  .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, {
    error: API_MESSAGES.get("USERNAME_INVALID_FORMAT") ?? "Dado inválido.",
  });

export const timestampSchema = z.iso.datetime({
  offset: true,
  error: API_MESSAGES.get("INVALID_TIMESTAMP") ?? "Dado inválido.",
});
