import * as z from "zod";
import { timestampSchema, usernameSchema } from "./common.schema.js";
import { linkSchema } from "./Link.schema.js";
import { API_MESSAGES } from "../api/messages.api.js";

const uuidSchema = z.uuid({
  error: API_MESSAGES.get("INVALID_UUID") ?? "Dado inválido.",
});

const nameSchema = z
  .string({
    error: API_MESSAGES.get("NAME_REQUIRED") ?? "Dado inválido.",
  })
  .trim()
  .min(2, {
    error: API_MESSAGES.get("NAME_TOO_SHORT") ?? "Dado inválido.",
  })
  .max(255, {
    error: API_MESSAGES.get("NAME_TOO_LONG") ?? "Dado inválido.",
  })
  .refine((value) => /\p{L}/u.test(value), {
    error: API_MESSAGES.get("NAME_MUST_CONTAIN_LETTERS") ?? "Dado inválido.",
  });

const emailSchema = z
  .string({
    error: API_MESSAGES.get("EMAIL_REQUIRED") ?? "Dado inválido.",
  })
  .trim()
  .toLowerCase()
  .max(255, {
    error: API_MESSAGES.get("EMAIL_TOO_LONG") ?? "Dado inválido.",
  })
  .pipe(
    z.email({
      error: API_MESSAGES.get("EMAIL_INVALID_FORMAT") ?? "Dado inválido.",
    }),
  );

const passwordSchema = z
  .string({
    error: API_MESSAGES.get("PASSWORD_REQUIRED") ?? "Dado inválido.",
  })
  .min(12, {
    error: API_MESSAGES.get("PASSWORD_TOO_SHORT") ?? "Dado inválido.",
  })
  .max(72, {
    error: API_MESSAGES.get("PASSWORD_TOO_LONG") ?? "Dado inválido.",
  })
  .regex(/[a-z]/, {
    error: API_MESSAGES.get("PASSWORD_MISSING_LOWERCASE") ?? "Dado inválido.",
  })
  .regex(/[A-Z]/, {
    error: API_MESSAGES.get("PASSWORD_MISSING_UPPERCASE") ?? "Dado inválido.",
  })
  .regex(/[0-9]/, {
    error: API_MESSAGES.get("PASSWORD_MISSING_NUMBER") ?? "Dado inválido.",
  })
  .regex(/[^A-Za-z0-9]/, {
    error:
      API_MESSAGES.get("PASSWORD_MISSING_SPECIAL_CHARACTER") ??
      "Dado inválido.",
  })
  .refine((value) => !/\s/.test(value), {
    error: API_MESSAGES.get("PASSWORD_CONTAINS_WHITESPACE") ?? "Dado inválido.",
  });

const optionalPasswordSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  passwordSchema.optional(),
);

export const userSchema = z.object({
  id: uuidSchema,

  name: nameSchema,
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,

  links: z.array(linkSchema),

  createdAt: timestampSchema,
  lastEdition: timestampSchema,
});

export const userWithoutPasswordSchema = userSchema.omit({ password: true });

export const loginUserSchema = z.object({
  username: z.string({
    error: API_MESSAGES.get("USERNAME_REQUIRED") ?? "Dado inválido.",
  }),
  password: z.string({
    error: API_MESSAGES.get("PASSWORD_REQUIRED") ?? "Dado inválido.",
  }),
});

export const createUserSchema = userSchema.omit({
  id: true,
  links: true,
  createdAt: true,
  lastEdition: true,
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: optionalPasswordSchema,
  currentPassword: z.string({
    error: API_MESSAGES.get("PASSWORD_REQUIRED") ?? "Dado inválido.",
  }),
});

export const deleteUserSchema = z.object({
  password: z.string({
    error: API_MESSAGES.get("PASSWORD_REQUIRED") ?? "Dado inválido.",
  }),
});

const userModalSchema = z
  .object({
    ...createUserSchema.shape,
    ...loginUserSchema.shape,
    ...updateUserSchema.shape,
    ...deleteUserSchema.shape,
  })
  .partial();

export type User = z.infer<typeof userWithoutPasswordSchema>;
export type UserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export type UserModalInputs = z.infer<typeof userModalSchema>;
