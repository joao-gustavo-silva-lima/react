import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as userAPI from "../api/User.api";
import {
  type UpdateUserInput,
  type LoginUserInput,
  type User,
  type UserInput,
  type DeleteUserInput,
} from "../schemas/User.schema";
import HttpError from "../common/classes/HttpError";
import { type APIJSONResponse } from "../common/types/api.types";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, HttpError, UserInput>({
    mutationKey: ["user", "create"],
    mutationFn: userAPI.createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user", "profile"], user);
    },
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();

  return useMutation<User, HttpError, LoginUserInput>({
    mutationKey: ["user", "login"],
    mutationFn: userAPI.loginUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user", "profile"], user);
    },
  });
}

export function useLogoutUser() {
  const queryClient = useQueryClient();

  return useMutation<APIJSONResponse, HttpError>({
    mutationKey: ["user", "logout"],
    mutationFn: userAPI.logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["user", "profile"],
      });
      queryClient.clear();
    },
  });
}

export function useFetchUserProfile() {
  return useQuery<User, HttpError>({
    queryKey: ["user", "profile"],
    queryFn: userAPI.fetchUserProfile,
  });
}

export function useFetchUserByUsername(username: string) {
  return useQuery<User, HttpError>({
    queryKey: ["user", "username", username],
    queryFn: () => userAPI.fetchUserByUsername(username),
    enabled: Boolean(username),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, HttpError, UpdateUserInput>({
    mutationKey: ["user", "update"],
    mutationFn: userAPI.updateUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user", "profile"], user);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<APIJSONResponse, HttpError, DeleteUserInput>({
    mutationKey: ["user", "delete"],
    mutationFn: userAPI.deleteUser,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["user", "profile"],
      });
      queryClient.clear();
    },
  });
}
