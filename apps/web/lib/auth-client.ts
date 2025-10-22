import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  basePath: "/api/auth",
});

export const authClientSession: ReturnType<typeof createAuthClient> = createAuthClient({
  basePath: "/api/auth",
  baseURL: process.env.API_URL,
});
