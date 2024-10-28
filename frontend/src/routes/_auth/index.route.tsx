import { createFileRoute } from "@tanstack/react-router";
import { updateUserQueryOptions } from "../../utils/queryOptions";

export const Route = createFileRoute("/_auth/")({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    const user = await queryClient.ensureQueryData(updateUserQueryOptions());
    
    return { user };
  },
});
