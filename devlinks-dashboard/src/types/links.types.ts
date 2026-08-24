import { z } from "zod";

const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const tagItemRegex = /^[a-zA-Z0-9-]{2,20}$/;

export const linkSchema = z.object({
  id: z.union([z.string(), z.string().uuid()]).default(""),

  title: z
    .string({ error: "O título é obrigatório." })
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "O título é obrigatório."))
    .pipe(
      z.string().min(3, "O título deve ter pelo menos 3 caracteres visíveis."),
    )
    .pipe(
      z.string().max(50, "O título é muito longo (máximo de 50 caracteres)."),
    )
    .default(""),

  url: z
    .string({ error: "A URL de destino é obrigatória." })
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "A URL de destino é obrigatória."))
    .pipe(
      z
        .string()
        .regex(
          urlRegex,
          "Informe uma URL válida contendo http:// ou https:// (ex: https://github.com).",
        ),
    )
    .default(""),

  category: z
    .string({ error: "Selecione uma categoria válida para o link." })
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, { error: "Selecione uma categoria válida para o link." }),
    )
    .pipe(
      z.string().refine((val) => PREDEFINED_CATEGORIES.includes(val as any), {
        message: "A categoria selecionada não pertence à lista permitida.",
      }),
    )
    .default(""),

  tags: z
    .array(
      z
        .string()
        .transform((val) => val.trim())
        .pipe(
          z
            .string()
            .regex(
              tagItemRegex,
              "Cada tag deve ter de 2 a 20 caracteres (apenas letras, números e hífen).",
            ),
        ),
    )
    .pipe(z.array(z.string()).max(5, "Você pode adicionar no máximo 5 tags."))
    .default([]),

  clicks: z.number().int().default(0),

  createdAt: z.union([z.string(), z.date()]).default(""),
});

export type Link = z.infer<typeof linkSchema>;

const ProtoLinkSchema = linkSchema
  .omit({
    id: true,
    clicks: true,
    createdAt: true,
  })
  .partial({
    category: true,
    tags: true,
  });

export type ProtoLink = z.infer<typeof ProtoLinkSchema>;

export type Query = Partial<Pick<Link, "title" | "category"> & { tag: string }>;

export const PREDEFINED_CATEGORIES = [
  "desenvolvimento",
  "design",
  "documentação",
  "ferramentas",
  "carreira",
  "estudo",
  "pessoal",
] as const;

export const modalFormDataSchema = linkSchema
  .pick({
    title: true,
    url: true,
    category: true,
  })
  .extend({
    tags: z
      .custom<FormDataEntryValue>()
      .transform((val) => (typeof val === "string" ? val.trim() : ""))
      .pipe(
        z
          .string()
          .refine(
            (cleanTags) =>
              !cleanTags ||
              /^[a-zA-Z0-9-]{2,20}(?:,\s*[a-zA-Z0-9-]{2,20}){0,4}$/.test(
                cleanTags,
              ),
            {
              message:
                "Separe até 5 tags por vírgula (ex: react, typescript). Cada tag deve ter de 2 a 20 caracteres sem espaços.",
            },
          ),
      ),
  });

export type ModalFormData = z.infer<typeof modalFormDataSchema>;

export type FormInputNames = keyof ModalFormData;

export const EXPECTED_FORM_INPUT_IDS = Object.keys(modalFormDataSchema.shape);
