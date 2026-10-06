import { z } from "zod";

export const userSchema = z.object({
  id: z
    .string({ error: "INVALID_ID_TYPE" })
    .optional()
    .transform(() => crypto.randomUUID()),

  name: z
    .string({ error: "INVALID_NAME_TYPE" })
    .min(1, { error: "NAME_REQUIRED" })
    .max(255, { error: "NAME_TOO_LONG" }),

  email: z.email({ error: "INVALID_EMAIL_FORMAT" }).max(255),

  password: z
    .string({
      error: "PASSWORD_MUST_BE_STRING",
    })
    .min(8, { error: "PASSWORD_TOO_SHORT" })
    .max(100, { error: "PASSWORD_TOO_LONG" })
    .regex(/[A-Z]/, { error: "PASSWORD_MISSING_UPPERCASE" })
    .regex(/[a-z]/, { error: "PASSWORD_MISSING_LOWERCASE" })
    .regex(/[0-9]/, { error: "PASSWORD_MISSING_NUMBER" })
    .regex(/[^a-zA-Z0-9]/, { error: "PASSWORD_MISSING_SPECIAL_CHARACTER" }),

  createdAt: z.iso
    .datetime({ error: "INVALID_ISO_DATE_FORMAT" })
    .optional()
    .transform(() => new Date().toISOString()),
});

export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});

export const registerUserSchema = userSchema
  .extend({
    confirmPassword: z.string({ error: "CONFIRM_PASSWORD_MUST_BE_STRING" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    error: "PASSWORDS_DONT_MATCH",
    path: ["confirmPassword"],
  });

const modalUserSchema = userSchema
  .extend({
    confirmPassword: z
      .string({ error: "CONFIRM_PASSWORD_MUST_BE_STRING" })
      .optional(),
  })
  .exactPartial({ name: true });

export type User = Omit<z.infer<typeof userSchema>, "password">;
export type RegisterUser = z.input<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type ModalUserInputs = z.input<typeof modalUserSchema>;

export type APIJSONResponse<DataType = undefined> = {
  code: string;
  message: string;
  data?: DataType;
};
