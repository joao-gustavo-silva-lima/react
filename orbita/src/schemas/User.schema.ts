import * as z from "zod";
import { timestampSchema, usernameSchema } from "./common.schema.js";
import { linkSchema } from "./Link.schema.js";

const uuidSchema = z.uuid({
  error: "INVALID_UUID",
});

const nameSchema = z
  .string({
    error: "NAME_REQUIRED",
  })
  .trim()
  .min(2, {
    error: "NAME_TOO_SHORT",
  })
  .max(255, {
    error: "NAME_TOO_LONG",
  })
  .refine((value) => /\p{L}/u.test(value), {
    error: "NAME_MUST_CONTAIN_LETTERS",
  });

const emailSchema = z
  .string({
    error: "EMAIL_REQUIRED",
  })
  .trim()
  .toLowerCase()
  .max(255, {
    error: "EMAIL_TOO_LONG",
  })
  .pipe(
    z.email({
      error: "EMAIL_INVALID_FORMAT",
    }),
  );

const passwordSchema = z
  .string({
    error: "PASSWORD_REQUIRED",
  })
  .min(12, {
    error: "PASSWORD_TOO_SHORT",
  })
  .max(72, {
    error: "PASSWORD_TOO_LONG",
  })
  .regex(/[a-z]/, {
    error: "PASSWORD_MISSING_LOWERCASE",
  })
  .regex(/[A-Z]/, {
    error: "PASSWORD_MISSING_UPPERCASE",
  })
  .regex(/[0-9]/, {
    error: "PASSWORD_MISSING_NUMBER",
  })
  .regex(/[^A-Za-z0-9]/, {
    error: "PASSWORD_MISSING_SPECIAL_CHARACTER",
  })
  .refine((value) => !/\s/.test(value), {
    error: "PASSWORD_CONTAINS_WHITESPACE",
  });

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
    error: "USERNAME_REQUIRED",
  }),
  password: z.string({
    error: "PASSWORD_REQUIRED",
  }),
});

export const createUserSchema = userSchema.omit({
  id: true,
  links: true,
  createdAt: true,
  lastEdition: true,
});

export const updateUserSchema = createUserSchema.partial().extend({
  currentPassword: z.string({
    error: "PASSWORD_REQUIRED",
  }),
});

export const deleteUserSchema = z.object({
  password: z.string({
    error: "PASSWORD_REQUIRED",
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
