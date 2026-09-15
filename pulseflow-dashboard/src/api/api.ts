import { StatefulError } from "../utils/stateful-error.utils";

const BASE_URL = "http://localhost:3000";

export async function fetchRoutines() {
  const response = await safeFetch(BASE_URL);

  if (response.ok) {
    return await response.json();
  }

  throw new StatefulError(
    response.status,
    `Ocorreu um erro na requisição (Código: ${response.status}).`,
  );
}

export async function fetchRoutineById(id: string) {
  const response = await safeFetch(`${BASE_URL}/${id}`);

  if (response.ok) {
    return await response.json();
  }

  const errorMessage =
    response.status === 404
      ? "A rotina não foi encontrada."
      : `Ocorreu um erro na requisição (Código: ${response.status}).`;

  throw new StatefulError(response.status, errorMessage);
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  return await fetch(input, init).catch(() => {
    throw new StatefulError(
      0,
      "Falha de conexão com a rede ou o servidor está fora do ar.",
    );
  });
}
