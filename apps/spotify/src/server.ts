import { fastify } from 'fastify'
import { fastifyOauth2 as oauth2 } from '@fastify/oauth2'
import { fastifyCookie as cookie, type FastifyCookieOptions } from '@fastify/cookie'
import { fastifySession as session } from '@fastify/session'
import { fastifyCors as cors } from '@fastify/cors'
import { fastifyEnv as env } from '@fastify/env'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { configJsonSchema, configSchema } from './config.ts'
import type { z } from 'zod'
import { routes } from './routes.ts'

declare module 'fastify' {
  export interface FastifyInstance {
    config: z.infer<typeof configSchema>;
  }
}

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

await app.register(env, {
  confKey: 'config',
  schema: configJsonSchema
})

await app.register(cors, { origin: ['http://localhost:3035', 'http://localhost:5005'], credentials: true })
await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Playlist converter',
      version: '0.0.1'
    }
  },
  transform: jsonSchemaTransform
})

await app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

const cookieOpts = {
  secret: app.config.COOKIE_SECRET,
  parseOptions: {
    httpOnly: true,
    secure: app.config.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 7
  }
} satisfies FastifyCookieOptions;

await app.register(cookie, cookieOpts);
await app.register(session, {
  ...cookieOpts,
  cookieName: 'session',
  saveUninitialized: false,
})

await app.register(oauth2, {
  name: 'spotify',
  userAgent: 'playlist converter (2.0.0)',
  credentials: {
    client: {
      id: app.config.OAUTH_SPOTIFY_CLIENT_ID,
      secret: app.config.OAUTH_SPOTIFY_CLIENT_SECRET,
    },
    auth: oauth2.SPOTIFY_CONFIGURATION,
  },
  scope: [
    'user-read-private', 
    'user-read-email', 
    'playlist-read-private',
    'playlist-read-collaborative'
  ],
  callbackUri: (req) => {
    const callbackHost = app.config.NODE_ENV === 'production' 
    ? req.hostname 
    : req.host
    
    return `${app.config.PROTOCOL}://${callbackHost}/api/auth/spotify/callback`
  },
  pkce: 'S256',
  cookie: {
    secure: app.config.NODE_ENV === 'production',
    sameSite: 'lax'
  }
});

await app.register(routes, {
 prefix: '/api' 
})

await app.listen({ port: 5005 })
app.log.info(app.printRoutes())