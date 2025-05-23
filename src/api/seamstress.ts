import { useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken } from "@/lib/utils/fetch-with-token";
import type { SelectSeamstress } from "@/schemas/seamstress";

const route = "/api/seamstress";

export function useSeamstress({ enabled = true }: { enabled: boolean }) {
  return useQuery({
    queryKey: queryKeyFactory.seamstress(),
    queryFn: fetchWithToken<SelectSeamstress[]>(route),
    initialData: [],
    enabled,
  });
}
