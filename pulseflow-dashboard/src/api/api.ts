import type { DTO, PatchingDTO, Routine } from "../types/routines.types";
import { StatefulError } from "../utils/stateful-error.utils";

export type DetailedResponse<T = undefined> = {
  code: string;
  message: string;
  data?: T;
};

const BASE_URL = "http://localhost:3000";

function concatPath(
  isSingleResource: boolean,
  routineId?: string,
  habitId?: string,
  subTaskId?: string,
) {
  let path = `/`;

  if (routineId === undefined) {
    return path;
  }

  path += isSingleResource ? routineId : `${routineId}/habits`;

  if (habitId === undefined) {
    return path;
  }

  path += isSingleResource ? `/habits/${habitId}` : `/${habitId}/sub-tasks`;

  if (subTaskId === undefined) {
    return path;
  }

  path += isSingleResource ? `/sub-tasks/${subTaskId}` : `/${subTaskId}`;

  return path;
}

export async function fetchRoutines() {
  return await request<Routine[]>(BASE_URL);
}

export async function fetchRoutineById(id: string) {
  return await request<Routine>(`${BASE_URL}/${id}`);
}

export async function createResource({
  DTO,
  routineId,
  habitId,
}: {
  DTO: DTO;
  routineId?: string;
  habitId?: string;
}) {
  return await request<DetailedResponse<DTO>>(
    `${BASE_URL}${concatPath(false, routineId, habitId)}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(DTO, null, 2),
    },
  );
}

export async function patchResource({
  DTO,
  routineId,
  habitId,
  subTaskId,
}: {
  DTO: PatchingDTO;
  routineId: string;
  habitId?: string;
  subTaskId?: string;
}) {
  return await request<DetailedResponse<DTO>>(
    `${BASE_URL}${concatPath(true, routineId, habitId, subTaskId)}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(DTO, null, 2),
    },
  );
}

export async function deleteResource({
  routineId,
  habitId,
  subTaskId,
}: {
  routineId: string;
  habitId?: string;
  subTaskId?: string;
}) {
  return await request<DetailedResponse>(
    `${BASE_URL}${concatPath(true, routineId, habitId, subTaskId)}`,
    {
      method: "DELETE",
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
      errorData.appendix,
    );
  }

  return response.json();
}
