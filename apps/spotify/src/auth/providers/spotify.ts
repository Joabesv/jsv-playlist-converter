import { z } from "zod";
import { withAuthentication } from "../with-authentication.ts";
import type { FastifyTypedInstance } from "../../types.ts";
import { FetchError, ofetch } from "ofetch";

declare module 'fastify' {
  interface FastifyRequest {
    userinfo: (token: string) => Promise<any>
  }
}

export async function spotifyAuthRoutes(app: FastifyTypedInstance) {
  app.decorateRequest('userinfo', async function (token: string) {
    try {
      const headers = new Headers()
      headers.set('Authorization', `Bearer ${token}`)
      const response = await ofetch('https://api.spotify.com/v1/me', {
        headers,
      })
      return response;
    } catch (error) {
      if (error instanceof FetchError) {
        this.log.error(error, 'Unknown error fetching spotify api')
      }
      this.log.error(error, 'unmapped error')
      throw error;
    }
  })

  app.get('/', async function (request,reply) {
    try {
      const authEndpoint = await this.spotify.generateAuthorizationUri(request, reply)
      const redirectURL = new URL(authEndpoint)
      const params = redirectURL.searchParams
      request.log.info({
        permissions: params.get('scope'),
        redirect: params.get('redirect_uri'),
      }, 'constructed URL')

      if (request.headers.accept?.includes('application/json')) {
        return { url: redirectURL.href }
      }

      return reply.redirect(redirectURL.href)
    } catch(error) {
      app.log.error(error, 'Error starting user oauth')
      throw error
    }
  })

  app.get('/callback', {
    schema: {
      querystring: z.object({
        code: z.string().nullish(),
        state: z.string().nullish(),
        error: z.string().nullish()
      }),
    },
  },
  async function (request, reply) {
    const { error } = request.query;

    if (error) {
      this.log.error(error, 'Provider related error')
    }

    try {
      const { token } =  await this.spotify.getAccessTokenFromAuthorizationCodeFlow(request, reply)

      request.session.set('token', {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: token.expires_at.toISOString(),
        spotifyToken: token,
      })

      request.session.isAuthenticated = true;

      const profile = await request.userinfo(token.access_token)
      this.log.info(profile)
      request.session.userId = profile.id

      this.log.info('Successfully authenticated user with session')

      return reply.redirect('http://localhost:3035/callback')
    } catch(error) {
      this.log.error(error, 'Unknown error')
      return reply.redirect('http://localhost:3035/error?message=AuthFailed')
    }

  })  

  app.get('/refresh', async function (request, reply) {
    try {
      const currentToken = request.session.get('token');
      
      if (!currentToken) {
        return reply.status(401).send({ error: 'No token available' });
      }
      
      const { token: newToken } = await this.spotify.getNewAccessTokenUsingRefreshToken(currentToken.spotifyToken, {});
      
      // Update token in session
      request.session.set('token', {
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token || currentToken.refresh_token,
        expires_at: newToken.expires_at.toISOString(),
        spotifyToken: newToken
      });
      
      return reply.send({ success: true });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Token refresh failed' });
    }
  });

  app.get('/validate', (request, reply) => {
    const token = request.session.get('token')
    request.log.info({ token, host: request.host });
    return {valid: !!token};
  })

  app.get('/me', { preHandler: withAuthentication }, async function (request, reply) {
    const token = request.session.get('token')
    request.log.info(token)

    const profile = await request.userinfo(token.spotifyToken.access_token)

    return profile
  }) 
}