import { z } from "zod";
import type { FastifyTypedInstance } from "./types.ts";

const users = []

export async function routes(app: FastifyTypedInstance) {
  app.get('/users', () => ([  ]))

  app.post('/users', {
    schema: {
      description: 'Ai papai',
      tags: ['users'],
      body: z.object({
        name: z.string(),
        email: z.string().email(),
      })
    }
  }, (request, reply) => {
    const { email, name } = request.body

    users.push({
      name, email
    })

    return reply.status(200).send(users)
  })
}