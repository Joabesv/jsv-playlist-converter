import { z } from "zod"

export const spotifyUserSchema = z.object({
  country: z.string().toLowerCase(),
  display_name: z.string(),
  email: z.string().email(),
  explicit_content: z.object({
    filter_enabled: z.boolean(),
    filter_locked: z.boolean(),
  }),
  external_urls: z.object({
    spotify: z.string().url().transform(val => new URL(val)),
  }),
  followers: z.object({
    href: z.string().url().nullable().transform(val => {
      if (val != null) {
        return new URL(val)
      }
    }),
    total: z.number().int()
  }),
  href: z.string().url().transform(val => new URL(val)),
  id: z.string(),
  images: z.object({
    height: z.number().int(),
    url: z.string().url().transform(val => new URL(val)),
    width: z.number().int(),
  }).array(),
  product: z.enum(['premium', 'free', 'open']),
  type: z.string().default('user'),
  uri: z.string(),
})

export type SpotifyUser = z.infer<typeof spotifyUserSchema>