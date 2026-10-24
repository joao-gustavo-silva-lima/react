import HttpError from "../common/classes/HttpError";

interface APIJSONResponse {
  code: string;
  message: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default async function request<T = APIJSONResponse>(
  path: string,
  requestInit: RequestInit = {},
): Promise<T> {
  if (BASE_URL === undefined) {
    throw new HttpError(
      0,
      "MISSING_SERVER_ADDRESS",
      "O endereço do servidor não foi definido. Contate o suporte.",
    );
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...requestInit,
    headers: {
      ...requestInit.headers,
      Accept: "application/json",
    },
  }).catch(() => {
    throw new HttpError(
      0,
      "SERVER_CONNECTION_ERROR",
      "A comunicação com o servidor falhou. Verifique a conexão e tente novamente.",
    );
  });

  const resJSON = await response.json().catch(() => null);

  if (resJSON === null) {
    throw new HttpError(
      502,
      "RESPONSE_IS_NOT_JSON",
      "A resposta do servidor não foi reconhecida. Se o problema persistir, contate o suporte.",
    );
  }

  if (!response.ok) {
    throw new HttpError(
      response.status || 500,
      resJSON.code || "UNEXPECTED_ERROR",
      resJSON.message ||
        "Um erro inesperado ocorreu. Tente novamente mais tarde.",
    );
  }

  return resJSON;
}
