import api from "../api";
import { queryOptions } from "@tanstack/react-query";

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => api.loadCurrentUser(),
    staleTime: 60_000,
  });

export const updateUserQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => api.loadCurrentUser(),
  });
