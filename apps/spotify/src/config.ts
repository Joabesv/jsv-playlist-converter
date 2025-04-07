import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const configSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']).default('dev'),
  PROTOCOL: z.enum(['http', 'https']).default('http'),
  OAUTH_SPOTIFY_CLIENT_ID: z.string(),
  OAUTH_SPOTIFY_CLIENT_SECRET: z.string(),
  COOKIE_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32)
})


export const configJsonSchema = zodToJsonSchema(configSchema);
export const config = configSchema.parse(process.env);
