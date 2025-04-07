import type { preHandlerAsyncHookHandler } from "fastify"

export const withAuthentication: preHandlerAsyncHookHandler = async ({ session }, reply) => {
  if (!session.isAuthenticated) {
    return reply.redirect('/api/auth/spotify') 
  }
}