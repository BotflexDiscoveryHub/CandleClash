import api from "../api";
import { queryOptions } from "@tanstack/react-query";

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => api.loadCurrentUser(),
  });

export const updateUserQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => api.loadCurrentUser(),
  });

export const rewardsQueryOptions = () => ({
  queryKey: ["rewards"],
  queryFn: async () => api.getRewards(),
});
