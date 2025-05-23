import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken, putWithToken } from "@/lib/utils/fetch-with-token";
import type { DriverList } from "@/schemas/routes";
import type { QueryOptions } from "../../types/query-options";

const route = "/api/routes";

export function useRoutes() {
  return useQuery({
    queryKey: queryKeyFactory.routes(),
    queryFn: fetchWithToken<DriverList>(route),
    initialData: [],
  });
}

export function useUpdateRoutes(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.routes(),
    mutationFn: putWithToken(route),
    ...options,
  });
}
