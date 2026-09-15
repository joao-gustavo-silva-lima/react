import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Habit, Routine } from "../types/routines.types";
import {
  createHabit,
  createRoutine,
  fetchRoutineById,
  fetchRoutines,
} from "../api/api";
import type { StatefulError } from "../utils/stateful-error.utils";

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
    queryKey: ["routines"],
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

export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation<
    {
      message: string;
      data: Routine;
    },
    StatefulError,
    Routine
  >({
    mutationKey: ["routines"],
    mutationFn: createRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; data: Habit },
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
