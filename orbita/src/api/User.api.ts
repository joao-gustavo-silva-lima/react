import type {
  DeleteUserInput,
  LoginUserInput,
  UpdateUserInput,
  UserInput,
} from "../schemas/User.schema";
import request from "./request.api";

export function createUser(payload: UserInput) {
  return request("/user/auth", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
}

export function loginUser(payload: LoginUserInput) {
  return request("/user/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
}

export function logoutUser() {
  return request("/user/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function fetchUserProfile() {
  return request("/user/auth/profile", {
    credentials: "include",
  });
}

export function fetchUserByUsername(username: string) {
  return request(`/user/${encodeURIComponent(username)}`);
}

export function updateUser(payload: UpdateUserInput) {
  return request("/user/auth", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
}

export function deleteUser(payload: DeleteUserInput) {
  return request("/user/auth", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
}
