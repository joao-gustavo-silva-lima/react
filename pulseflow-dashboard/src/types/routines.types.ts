import { z } from "zod";

export const PREDEFINED_CATEGORIES = [
  "Health",
  "Studies",
  "Work",
  "Finance",
  "Personal",
  "Productivity",
] as const;

export const CATEGORIES_TO_PT_BR = new Map([
  ["Health", "🩺 Saúde"],
  ["Studies", "📚 Estudos"],
  ["Work", "💼 Trabalho"],
  ["Finance", "💰 Finanças"],
  ["Personal", "👤 Pessoal"],
  ["Productivity", "⚡ Produtividade"],
]);

const isoDateStringSchema = z
  .string()
  .trim()
  .regex(
    /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
    "A data deve estar no formato 'AAAA-MM-DD'.",
  );

export const subTaskSchema = z.object({
  id: z
    .string("ID da sub-tarefa inválido.")
    .optional()
    .default(() => `sub-task-${crypto.randomUUID()}`),
  title: z
    .string({ error: "O título da sub-tarefa é obrigatório." })
    .trim()
    .min(1, "O título da sub-tarefa não pode estar vazio.")
    .min(2, "A sub-tarefa deve ter pelo menos 2 caracteres.")
    .max(60, "A sub-tarefa deve ter no máximo 60 caracteres."),
  completionDates: z
    .array(isoDateStringSchema, {
      error: "As datas de conclusão da sub-tarefa devem estar em um array.",
    })
    .optional()
    .default(() => [])
    .refine(
      (dates) => new Set(dates).size === dates.length,
      "O histórico de conclusão não pode conter datas duplicadas.",
    ),
});

export const habitSchema = z.object({
  id: z
    .string("ID do hábito inválido.")
    .optional()
    .default(() => `habit-${crypto.randomUUID()}`),

  title: z
    .string({ error: "O título do hábito é obrigatório." })
    .trim()
    .min(1, "O título do hábito é obrigatório.")
    .min(3, "O título deve ter pelo menos 3 caracteres visíveis.")
    .max(50, "O título é muito longo (máximo de 50 caracteres)."),

  category: z.enum(PREDEFINED_CATEGORIES, {
    error: "A categoria do hábito é inválida.",
  }),

  subTasks: z
    .array(subTaskSchema, {
      error: "As sub-tarefas do hábito devem ser um array ou um objeto.",
    })
    .refine(
      (subTasks) => subTasks.length <= 10,
      "Você pode adicionar no máximo 10 sub-tarefas por hábito.",
    )
    .refine(
      (subtasks) =>
        new Set(subtasks.map((subtask) => subtask.title)).size ===
        subtasks.map((subtask) => subtask.title).length,
      "Um hábito não pode conter sub-tarefas duplicadas.",
    )
    .optional()
    .default([])
    .transform(
      (subTasks) =>
        subTasks.reduce(
          (acc, subTask) => ({ ...acc, [subTask.id]: subTask }),
          {},
        ) as Record<string, SubTask>,
    ),

  completionDates: z
    .array(isoDateStringSchema, {
      error: "As datas de conclusão do hábito devem estar em um array.",
    })
    .optional()
    .default(() => [])
    .refine(
      (dates) => new Set(dates).size === dates.length,
      "O histórico de conclusão não pode conter datas duplicadas.",
    ),
});

export const habitChildrenSchema = habitSchema.pick({ subTasks: true });

export const routineSchema = z.object({
  id: z
    .string("ID da rotina inválido.")
    .optional()
    .default(() => `routine-${crypto.randomUUID()}`),

  title: z
    .string({ error: "O título da rotina é obrigatório." })
    .trim()
    .min(1, "O título da rotina é obrigatório.")
    .min(3, "O título da rotina deve ter pelo menos 3 caracteres.")
    .max(40, "O título da rotina é muito longo (máximo de 40 caracteres)."),

  habits: z
    .preprocess(
      (val) => {
        if (Array.isArray(val)) return val;
        if (val && typeof val === "object") return Object.values(val);
        return val;
      },
      z.array(habitSchema, {
        error: "Os hábitos da rotina devem ser um array ou um objeto.",
      }),
    )
    .refine(
      (habits) => Object.keys(habits).length > 0,
      "A rotina deve conter pelo menos 1 hábito cadastrado.",
    )
    .refine(
      (habits) => Object.keys(habits).length <= 15,
      "A rotina pode conter no máximo 15 hábitos.",
    )
    .refine(
      (habits) =>
        new Set(Object.values(habits).map((habit) => habit.title)).size ===
        Object.values(habits).map((habit) => habit.title).length,
      "Uma rotina não pode conter hábitos duplicados.",
    )
    .transform(
      (habits) =>
        habits.reduce(
          (acc, habit) => ({ ...acc, [habit.id]: habit }),
          {},
        ) as Record<string, Habit>,
    ),

  completionDates: z
    .array(isoDateStringSchema, {
      error: "As datas de conclusão da rotina devem estar em um array.",
    })
    .optional()
    .default(() => [])
    .refine(
      (dates) => new Set(dates).size === dates.length,
      "O histórico de conclusão não pode conter datas duplicadas.",
    ),
});

export const routineChildrenSchema = routineSchema.pick({ habits: true });

export type SubTask = z.infer<typeof subTaskSchema>;
export type Habit = z.infer<typeof habitSchema>;
export type Routine = z.infer<typeof routineSchema>;
export type Category = (typeof PREDEFINED_CATEGORIES)[number];
