/**
 * Helper function to get API URL with correct /api prefix for nginx routing
 * @param path - The API path (e.g., "/auth/verify")
 * @returns Complete API URL with correct base and /api prefix
 */
export const getApiUrl = (path: string): string => {
  const apiDomain = import.meta.env.VITE_API_DOMAIN || "";
  const baseUrl = apiDomain.endsWith("/api") ? apiDomain : `${apiDomain}/api`;
  return `${baseUrl}${path}`;
};
