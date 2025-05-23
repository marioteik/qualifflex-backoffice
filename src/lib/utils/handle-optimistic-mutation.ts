import { queryClient } from "@/query-client";

export function handleSettledMutation(key: unknown[]) {
  return {
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: key });
    },
  };
}
