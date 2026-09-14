import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Routine } from "../types/routines.types";
import { fetchRoutineById, fetchRoutines } from "../api/api";
import type { StatefulError } from "../utils/stateful-error.utils";

export function useFetchRoutines() {
  return useQuery<Routine[], StatefulError>({
    queryKey: ["routines"],
    queryFn: fetchRoutines,
    staleTime: 60000,
  });
}

export function useFetchRoutineById(id: string) {
  const queryClient = useQueryClient();

  return useQuery<Routine, StatefulError>({
    queryKey: ["routines"],
    queryFn: () => fetchRoutineById(id),
    retry: false,
    initialData: () => {
      const routines = queryClient.getQueryData<Routine[]>(["routines"]);

      return routines?.find((routine) => routine.id === id);
    },
    staleTime: 60000,
  });
}
