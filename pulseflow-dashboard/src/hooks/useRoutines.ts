import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Habit, Routine } from "../types/routines.types";
import {
  createHabit,
  fetchRoutines,
  fetchRoutineById,
  type DetailedResponse,
  deleteHabit,
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

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation<
    DetailedResponse<Habit>,
    StatefulError,
    {
      routineId: string;
      habit: Habit;
    }
  >({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation<
    DetailedResponse,
    StatefulError,
    { routineId: string; habitId: string }
  >({
    mutationFn: deleteHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });
}
