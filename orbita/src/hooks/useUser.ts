import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as userAPI from "../api/User.api";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user", "create"],
    mutationFn: userAPI.createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user", "profile"], user);
    },
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user", "login"],
    mutationFn: userAPI.loginUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user", "profile"], user);
    },
  });
}

export function useLogoutUser() {
  const queryClient = useQueryClient();

  return useMutation({
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
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: userAPI.fetchUserProfile,
  });
}

export function useFetchUserByUsername(username: string) {
  return useQuery({
    queryKey: ["user", "username", username],
    queryFn: () => userAPI.fetchUserByUsername(username),
    enabled: Boolean(username),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user", "update"],
    mutationFn: userAPI.updateUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user", "profile"], user);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
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
