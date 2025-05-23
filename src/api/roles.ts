import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { z } from "zod";
import {
  deleteWithToken,
  fetchWithToken,
  postWithToken,
  putWithToken,
} from "@/lib/utils/fetch-with-token";
import { handleSettledMutation } from "@/lib/utils/handle-optimistic-mutation";
import { insertRoleSchema, selectRoleSchema } from "@/schemas/roles";
import type { QueryOptions } from "../../types/query-options";

type Role = z.infer<typeof insertRoleSchema>;
type SelectRole = z.infer<typeof selectRoleSchema>;
type Roles = SelectRole[];

const route = "/api/roles";

export function useRoles() {
  return useQuery({
    queryKey: queryKeyFactory.roles(),
    queryFn: fetchWithToken<Roles>(route),
    initialData: [],
  });
}

export function useCreateRole(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.roles(),
    mutationFn: postWithToken<Role, Role>(route),
    ...handleSettledMutation(queryKeyFactory.roles()),
    ...options,
  });
}

export function useUpdateRole(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.roles(),
    mutationFn: putWithToken<SelectRole>(route),
    ...handleSettledMutation(queryKeyFactory.roles()),
    ...options,
  });
}

export function useDeleteRole(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.roles(),
    mutationFn: deleteWithToken(route),
    ...handleSettledMutation(queryKeyFactory.roles()),
    ...options,
  });
}
