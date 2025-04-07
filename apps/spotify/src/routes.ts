import type { FastifyTypedInstance } from "./types.ts";
import { authRoutes } from "./auth/auth.ts";

export async function routes(app: FastifyTypedInstance) {
  await app.register(authRoutes, {
    prefix: 'auth'
  })
}