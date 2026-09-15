import type { Habit, Routine } from "../types/routines.types";
import { StatefulError } from "../utils/stateful-error.utils";

export type DetailedResponse<T = undefined> = {
  code: string;
  message: string;
  data?: T;
};

const BASE_URL = "http://localhost:3000";

export async function fetchRoutines() {
  return await request<Routine[]>(BASE_URL);
}

export async function fetchRoutineById(id: string) {
  return await request<Routine>(`${BASE_URL}/${id}`);
}

export async function createRoutine(routine: Routine) {
  return await request<DetailedResponse<Routine>>(BASE_URL, {
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
  return await request<DetailedResponse<Habit>>(
    `${BASE_URL}/${routineId}/habits`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(habit, null, 2),
    },
  );
}

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init).catch(() => {
    throw new StatefulError(
      "CONNECTION_ERROR",
      0,
      "Falha de conexão com a rede ou o servidor está fora do ar.",
    );
  });

  if (!response.ok) {
    const isJSON = response.headers
      .get("content-type")
      ?.includes("application/json");
    const errorData = isJSON ? await response.json().catch(null) : null;

    throw new StatefulError(
      errorData.code ?? "UNKNOWN_ERROR",
      response.status,
      errorData.message ??
        `Ocorreu um erro na requisição (Código: ${response.status}).`,
    );
  }

  return response.json();
}
