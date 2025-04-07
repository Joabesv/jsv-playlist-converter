import type { FastifyTypedInstance } from "../types.ts";
import type { OAuth2Namespace, Token } from "@fastify/oauth2";
import { spotifyAuthRoutes } from "./providers/spotify.ts";

declare module 'fastify' {
  interface FastifyInstance {
    spotify: OAuth2Namespace;
  }
  interface Session {
    token?: {
      access_token: string;
      refresh_token?: string;
      expires_at?: string;
      spotifyToken: Token
    };
    isAuthenticated: boolean;
    userId?: string;
    metadata: Record<string, any>
  }
}

export async function authRoutes(app: FastifyTypedInstance) {
  app.register(spotifyAuthRoutes, {
    prefix: '/spotify'
  })
  
  app.get('/logout', async (request, reply) => {
    try {
      await request.session.destroy();
      return reply.redirect('/')
    } catch(error) {
      app.log.error(error, 'Error during logout')
      throw error;
    }
  })
}