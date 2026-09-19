import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DTO,
  Habit,
  PatchingDTO,
  Routine,
  SubTask,
} from "../types/routines.types";
import {
  fetchRoutines,
  fetchHabitById,
  fetchRoutineById,
  fetchSubTaskById,
  type DetailedResponse,
  deleteResource,
  createResource,
  patchResource,
  toggleResourcesDailyStatus,
} from "../api/api";
import { StatefulError } from "../utils/stateful-error.utils";

export function useFetchRoutines() {
  const queryClient = useQueryClient();

  return useQuery<Routine[], StatefulError>({
    queryKey: ["routines"],
    queryFn: fetchRoutines,
    initialData: () => {
      return queryClient.getQueryData<Routine[]>(["routines"]);
    },
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

export function useFetchHabitById(routineId?: string, habitId?: string) {
  const queryClient = useQueryClient();

  return useQuery<Habit, StatefulError>({
    queryKey: ["routines", routineId, "habits", habitId],
    queryFn: () => fetchHabitById(routineId!, habitId!),
    enabled: Boolean(routineId && habitId),
    retry: false,
    initialData: () => {
      return queryClient
        .getQueryData<Routine>(["routines", routineId])
        ?.habits.find((habit) => habit.id === habitId);
    },
    staleTime: 60000,
  });
}

export function useFetchSubTaskById(
  routineId?: string,
  habitId?: string,
  subTaskId?: string,
) {
  const queryClient = useQueryClient();

  return useQuery<SubTask, StatefulError>({
    queryKey: [
      "routines",
      routineId,
      "habits",
      habitId,
      "sub-tasks",
      subTaskId,
    ],
    queryFn: () => fetchSubTaskById(routineId!, habitId!, subTaskId!),
    enabled: Boolean(routineId && habitId && subTaskId),
    retry: false,
    initialData: () => {
      return queryClient
        .getQueryData<Routine>(["routines", routineId])
        ?.habits.find((habit) => habit.id === habitId)
        ?.subTasks.find((subTask) => subTask.id === subTaskId);
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

export function usePatchResource() {
  const queryClient = useQueryClient();

  return useMutation<
    DetailedResponse<DTO>,
    StatefulError,
    {
      DTO: PatchingDTO;
      routineId: string;
      habitId?: string;
      subTaskId?: string;
    }
  >({
    mutationFn: patchResource,
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

export function useToggleResourcesDailyStatus() {
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
    mutationFn: toggleResourcesDailyStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });
}
