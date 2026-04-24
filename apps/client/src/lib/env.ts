export const env = {
  apiUrl: import.meta.env.CLIENT_API_URL ?? "http://localhost:3000/api",
} as const;
