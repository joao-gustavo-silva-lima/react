import { z } from "zod";

const linkSchema = z.object({
  id: z.union([z.string(), z.uuid()]).default(""),
  title: z.string().default(""),
  url: z.url().default(""),
  category: z.string().default(""),
  tags: z.array(z.string()).default([]),
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

export type LinkCategories = (typeof PREDEFINED_CATEGORIES)[number];

export type ModalFormData = Partial<
  Omit<ProtoLink, "tags"> & { tags?: string }
>;
