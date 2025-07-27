/**
 * Helper function to get API URL
 * @param path - The API path (e.g., "/auth/verify")
 * @returns Complete API URL
 */
export const getApiUrl = (path: string): string => {
  const apiDomain = import.meta.env.VITE_API_DOMAIN || "";
  return `${apiDomain}/api/${path}`;
};
