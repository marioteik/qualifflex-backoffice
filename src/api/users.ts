import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import {
  deleteWithToken,
  fetchWithToken,
  postWithToken,
  putWithToken,
} from "@/lib/utils/fetch-with-token";
import { handleSettledMutation } from "@/lib/utils/handle-optimistic-mutation";
import { Users } from "@/schemas/auth";
import type { QueryOptions } from "../../types/query-options";
import type { InsertUsersToRoles } from "@/schemas/roles";

const route = "/api/users";

export function useUsers() {
  return useQuery({
    queryKey: queryKeyFactory.users(),
    queryFn: fetchWithToken<Users>(route),
    initialData: [],
  });
}

export function useCreateUser(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.users(),
    mutationFn: postWithToken(route),
    ...handleSettledMutation(queryKeyFactory.users()),
    ...options,
  });
}

export function useUpdateUser(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.users(),
    mutationFn: putWithToken(route),
    ...handleSettledMutation(queryKeyFactory.users()),
    ...options,
  });
}

export function useDeleteUser(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.users(),
    mutationFn: deleteWithToken<{ id: string }>(route),
    ...handleSettledMutation(queryKeyFactory.users()),
    ...options,
  });
}

export function useDeactivateUser(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.users(),
    mutationFn: putWithToken<{ id: string }>(route + "/block"),
    ...handleSettledMutation(queryKeyFactory.users()),
    ...options,
  });
}

export function useActivateUser(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.users(),
    mutationFn: putWithToken<{ id: string }>(route + "/unblock"),
    ...handleSettledMutation(queryKeyFactory.users()),
    ...options,
  });
}

export function useAssignRoleToUser(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.roleByUserId(),
    mutationFn: putWithToken<InsertUsersToRoles>(route + "/set-role"),
    ...handleSettledMutation(queryKeyFactory.users()),
    ...options,
  });
}
