import { type AxiosResponse } from "axios";
import apiClient from "@/api-client";

export const fetchWithToken =
  <TData>(url: string) =>
  async () => {
    const response = await apiClient.get<TData>(url);

    return response.data;
  };

export const postWithToken =
  <TRequest, TData>(url: string) =>
  async (data: TRequest) => {
    const response = await apiClient.post<TRequest, AxiosResponse<TData>>(
      url,
      data,
    );

    return response.data;
  };

export const putWithToken =
  <TData>(url: string) =>
  async (data: TData) => {
    const response = await apiClient.put<TData>(url, data);

    return response.data;
  };

export const deleteWithToken =
  <TData>(url: string) =>
  async (row: TData) => {
    const response = await apiClient.delete<TData>(
      url + "/" + (row && typeof row === "object" && "id" in row && row.id),
    );

    return response.data;
  };
