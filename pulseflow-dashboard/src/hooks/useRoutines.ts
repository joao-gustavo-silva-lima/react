import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DTO, Routine } from "../types/routines.types";
import {
  fetchRoutines,
  fetchRoutineById,
  type DetailedResponse,
  deleteResource,
  createResource,
} from "../api/api";
import { StatefulError } from "../utils/stateful-error.utils";

export function useFetchRoutines() {
  return useQuery<Routine[], StatefulError>({
    queryKey: ["routines"],
    queryFn: fetchRoutines,
    staleTime: 60000,
  });
}

export function useFetchRoutineById(id?: string) {
  const queryClient = useQueryClient();

  return useQuery<Routine, StatefulError>({
    queryKey: ["routines", id],
    queryFn: () => fetchRoutineById(id!),
    enabled: Boolean(id),
    retry: false,
    initialData: () => {
      return queryClient
        .getQueryData<Routine[]>(["routines"])
        ?.find((routine) => routine.id === id);
    },
    staleTime: 60000,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation<
    DetailedResponse<DTO>,
    StatefulError,
    {
      DTO: DTO;
      routineId?: string;
      habitId?: string;
    }
  >({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation<
    DetailedResponse,
    StatefulError,
    {
      routineId: string;
      habitId?: string;
      subTaskId?: string;
    }
  >({
    mutationFn: deleteResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });
}
