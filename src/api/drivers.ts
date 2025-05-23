import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken, putWithToken } from "@/lib/utils/fetch-with-token";
import type { DriverList, SelectDriverPosition } from "@/schemas/routes";
import type { QueryOptions } from "../../types/query-options";

const route = "/api/drivers";

export function useDriversPositions() {
  return useQuery({
    queryKey: queryKeyFactory.driversPositions(),
    queryFn: fetchWithToken<SelectDriverPosition[]>(route),
    initialData: [],
  });
}
