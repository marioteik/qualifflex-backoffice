import { useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken } from "@/lib/utils/fetch-with-token";
import type { SelectProduct } from "@/schemas/products";

const route = "/api/products";

export function useProducts() {
  return useQuery({
    queryKey: queryKeyFactory.products(),
    queryFn: fetchWithToken<SelectProduct[]>(route),
    initialData: [],
  });
}
