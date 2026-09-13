import { useQuery } from "@tanstack/react-query";
import type { Routine } from "../types/routines.types";
import { fetchRoutines } from "../api/api";

export function useFetchRoutines() {
  return useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: fetchRoutines,
    staleTime: 60000,
  });
}
