import { useMutation, useQuery } from "@tanstack/react-query";
import * as UsersAPI from "../api/Users.api";
import type {
  APIJSONResponse,
  LoginUser,
  User,
  RegisterUser,
} from "../types/User.types";
import type HttpError from "../utils/HttpError.utils";

export function useRegisterUser() {
  return useMutation<APIJSONResponse, HttpError, RegisterUser>({
    mutationFn: UsersAPI.registerUser,
  });
}

export function useLoginUser() {
  return useMutation<APIJSONResponse, HttpError, LoginUser>({
    mutationFn: UsersAPI.loginUser,
  });
}

export function useLogoutUser() {
  return useMutation<APIJSONResponse, HttpError>({
    mutationFn: UsersAPI.logoutUser,
  });
}

export function useFetchUser(userId: string) {
  return useQuery<User, HttpError>({
    queryKey: ["user"],
    enabled: Boolean(userId),
  });
}
