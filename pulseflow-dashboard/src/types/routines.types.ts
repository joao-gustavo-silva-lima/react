import { z } from "zod";
import { API_MESSAGES } from "../api/messages.api";

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
  .string(API_MESSAGES.get("INVALID_DATE_TYPE")!)
  .trim()
  .regex(
    /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
    API_MESSAGES.get("INVALID_DATE_FORMAT")!,
  );

export const subTaskSchema = z.object({
  id: z.string(API_MESSAGES.get("INVALID_SUB-TASK_ID")!).optional(),
  title: z
    .string({ error: API_MESSAGES.get("SUB-TASK_TITLE_REQUIRED")! })
    .trim()
    .min(1, API_MESSAGES.get("SUB-TASK_TITLE_EMPTY")!)
    .min(2, API_MESSAGES.get("SUB-TASK_TITLE_TOO_SHORT")!)
    .max(60, API_MESSAGES.get("SUB-TASK_TITLE_TOO_LONG")!),
  completionDates: z
    .array(isoDateStringSchema, {
      error: API_MESSAGES.get("INVALID_SUB-TASK_COMPLETION_DATES")!,
    })
    .optional()
    .default(() => [])
    .refine(
      (dates) => new Set(dates).size === dates.length,
      API_MESSAGES.get("DUPLICATE_SUB-TASK_COMPLETION_DATE")!,
    ),
});

export const habitSchema = z.object({
  id: z.string(API_MESSAGES.get("INVALID_HABIT_ID")!).optional(),
  title: z
    .string({ error: API_MESSAGES.get("HABIT_TITLE_REQUIRED")! })
    .trim()
    .min(1, API_MESSAGES.get("HABIT_TITLE_EMPTY")!)
    .min(3, API_MESSAGES.get("HABIT_TITLE_TOO_SHORT")!)
    .max(50, API_MESSAGES.get("HABIT_TITLE_TOO_LONG")!),

  category: z.enum(PREDEFINED_CATEGORIES, {
    error: API_MESSAGES.get("INVALID_HABIT_CATEGORY")!,
  }),

  subTasks: z
    .array(subTaskSchema, {
      error: API_MESSAGES.get("INVALID_HABIT_SUB-TASKS")!,
    })
    .max(10, API_MESSAGES.get("HABIT_SUBTASK_LIMIT_EXCEEDED")!)
    .refine(
      (subtasks) =>
        new Set(subtasks.map((subtask) => subtask.title)).size ===
        subtasks.map((subtask) => subtask.title).length,
      API_MESSAGES.get("DUPLICATE_HABIT_SUB-TASK_TITLE")!,
    )
    .optional()
    .default([]),

  completionDates: z
    .array(isoDateStringSchema, {
      error: API_MESSAGES.get("INVALID_HABIT_COMPLETION_DATES")!,
    })
    .optional()
    .default(() => [])
    .refine(
      (dates) => new Set(dates).size === dates.length,
      API_MESSAGES.get("DUPLICATE_HABIT_COMPLETION_DATE")!,
    ),
});

export const habitChildrenSchema = habitSchema.pick({ subTasks: true });

export const routineSchema = z.object({
  id: z.string(API_MESSAGES.get("INVALID_ROUTINE_ID")!).optional(),

  title: z
    .string({ error: API_MESSAGES.get("ROUTINE_TITLE_REQUIRED")! })
    .trim()
    .min(1, API_MESSAGES.get("ROUTINE_TITLE_EMPTY")!)
    .min(3, API_MESSAGES.get("ROUTINE_TITLE_TOO_SHORT")!)
    .max(40, API_MESSAGES.get("ROUTINE_TITLE_TOO_LONG")!),

  habits: z
    .array(habitSchema, {
      error: API_MESSAGES.get("INVALID_ROUTINE_HABITS")!,
    })
    .refine(
      (habits) => habits.length > 0,
      API_MESSAGES.get("ROUTINE_HABIT_REQUIRED")!,
    )
    .refine(
      (habits) => Object.keys(habits).length <= 15,
      API_MESSAGES.get("ROUTINE_HABIT_LIMIT_EXCEEDED")!,
    )
    .refine(
      (habits) =>
        new Set(habits.map((habit) => habit.title)).size ===
        habits.map((habit) => habit.title).length,
      API_MESSAGES.get("DUPLICATE_ROUTINE_HABIT_TITLE")!,
    ),

  completionDates: z
    .array(isoDateStringSchema, {
      error: API_MESSAGES.get("INVALID_ROUTINE_COMPLETION_DATES")!,
    })
    .optional(),
});

export const routineChildrenSchema = routineSchema.pick({ habits: true });

export const CreateHabitSchema = habitSchema.extend({
  routineTitle: routineSchema.shape.title,
});

export type CreateHabitDTO = z.infer<typeof CreateHabitSchema>;

export type SubTask = z.infer<typeof subTaskSchema>;
export type Habit = z.infer<typeof habitSchema>;
export type Routine = z.infer<typeof routineSchema>;
export type DTO = Routine | Habit | SubTask;
export type Category = (typeof PREDEFINED_CATEGORIES)[number];

export type Database = Routine[];
