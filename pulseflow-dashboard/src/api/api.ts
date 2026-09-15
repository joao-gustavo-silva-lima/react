import type { Habit, Routine } from "../types/routines.types";
import { StatefulError } from "../utils/stateful-error.utils";

const BASE_URL = "http://localhost:3000";

export async function fetchRoutines() {
  return await request<Routine[]>(BASE_URL);
}

export async function fetchRoutineById(id: string) {
  return await request<Routine>(`${BASE_URL}/${id}`);
}

export async function createRoutine(routine: Routine) {
  return await request<{
    message: string;
    data: Routine;
  }>(BASE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(routine, null, 2),
  });
}

export async function createHabit({
  routineId,
  habit,
}: {
  routineId: string;
  habit: Habit;
}) {
  return await request<{
    message: string;
    data: Habit;
  }>(`${BASE_URL}/${routineId}/habits`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(habit, null, 2),
  });
}

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init).catch(() => {
    throw new StatefulError(
      0,
      "Falha de conexão com a rede ou o servidor está fora do ar.",
    );
  });

  if (!response.ok) {
    throw new StatefulError(
      response.status,
      `Ocorreu um erro na requisição (Código: ${response.status}).`,
    );
  }

  return response.json();
}
