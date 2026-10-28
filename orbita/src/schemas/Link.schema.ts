import * as z from "zod";

import { timestampSchema, usernameSchema } from "./common.schema.js";
import { API_MESSAGES } from "../api/messages.api.js";

const titleSchema = z
  .string({
    error: API_MESSAGES.get("TITLE_REQUIRED") ?? "Dado inválido.",
  })
  .trim()
  .min(1, {
    error: API_MESSAGES.get("TITLE_REQUIRED") ?? "Dado inválido.",
  })
  .max(255, {
    error: API_MESSAGES.get("TITLE_TOO_LONG") ?? "Dado inválido.",
  });

const refSchema = z
  .string({
    error: API_MESSAGES.get("REFERENCE_REQUIRED") ?? "Dado inválido.",
  })
  .trim()
  .min(1, {
    error: API_MESSAGES.get("REFERENCE_REQUIRED") ?? "Dado inválido.",
  })
  .max(255, {
    error: API_MESSAGES.get("REFERENCE_TOO_LONG") ?? "Dado inválido.",
  });

const visibilitySchema = z
  .string({
    error: API_MESSAGES.get("VISIBILITY_REQUIRED") ?? "Dado inválido.",
  })
  .pipe(
    z.enum(["PUBLIC", "PRIVATE"], {
      error: API_MESSAGES.get("INVALID_VISIBILITY") ?? "Dado inválido.",
    }),
  );

export const linkSchema = z.object({
  id: z.number().int().positive(),
  authorUsername: usernameSchema,

  ref: refSchema,
  title: titleSchema,
  visibility: visibilitySchema,

  createdAt: timestampSchema,
  lastEdition: timestampSchema,
});

export const createLinkSchema = linkSchema.omit({
  id: true,
  authorUsername: true,
  createdAt: true,
  lastEdition: true,
});

export const updateLinkSchema = createLinkSchema.partial();
export const linkIdSchema = z.coerce.number().int().positive();

export type Link = z.infer<typeof linkSchema>;
export type LinkInput = z.infer<typeof createLinkSchema>;
export type LinkUpdateInput = z.infer<typeof updateLinkSchema>;
