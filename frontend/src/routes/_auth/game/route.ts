import { createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "../../../utils/queryOptions";

export const Route = createFileRoute("/_auth/game")({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;

    const user = await queryClient.ensureQueryData(userQueryOptions());

    return {
      user,
    };
  },
});
