import type {
  APIJSONResponse,
  LoginUser,
  User,
  RegisterUser,
} from "../types/User.types";
import HttpError from "../utils/HttpError.utils";

const BASE_URL = "http://localhost:9876";

export function registerUser(user: RegisterUser) {
  return request("/users/auth/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(user, null, 2),
  });
}

export function loginUser(credentials: LoginUser) {
  return request("/users/auth/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials, null, 2),
  });
}

export function logoutUser() {
  return request("/users/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function fetchUser() {
  return request<User>("/users/auth/profile", {
    credentials: "include",
  });
}

async function request<T = APIJSONResponse>(
  path: string,
  requestInit: RequestInit = {},
): Promise<T> {
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
