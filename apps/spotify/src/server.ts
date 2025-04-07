import { fastify } from 'fastify'
import { fastifyCors as cors } from '@fastify/cors'
import { fastifyOauth2 as oauth2 } from '@fastify/oauth2'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { routes } from './routes.ts'

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, { origin: '*' })
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Playlist converter',
      version: '0.0.1'
    }
  },
  transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(routes)

await app.listen({ port: 5005 })