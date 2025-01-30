import { z } from 'zod'

export const zUpdateProfileInput = z.object({
  nick: z
    .string()
    .min(4)
    .regex(/^[a-z0-9-]+$/, 'Никнейм должен содержать сточные буквы, цифры и тире'),
  name: z.string().max(50).default(''),
})
