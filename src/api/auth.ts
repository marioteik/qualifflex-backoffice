import { useMutation } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { postWithToken } from "@/lib/utils/fetch-with-token";
import { AuthResponse } from "@supabase/supabase-js";
import type { AxiosError } from "axios";
import type { QueryOptions } from "../../types/query-options";
import { Auth } from "@/schemas/auth";

const route = "/api/auth";

export function useSighIn(
  options: {
    onError?: (err: Error) => void;
    onSuccess?: (data: AuthResponse["data"]["session"]) => void;
  } = {}
) {
  return useMutation<AuthResponse["data"]["session"], AxiosError, Auth>({
    mutationKey: queryKeyFactory.roles(),
    mutationFn: postWithToken(route + "/sign-in"),
    ...options,
  });
}

export function useSignUp(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.roles(),
    mutationFn: postWithToken(route + "/sign-up"),
    ...options,
  });
}

export function useForgotPassword(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.roles(),
    mutationFn: postWithToken(route + "/forgot-password"),
    ...options,
  });
}

export function useChangePassword(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.roles(),
    mutationFn: postWithToken(route + "/change-password"),
    ...options,
  });
}
