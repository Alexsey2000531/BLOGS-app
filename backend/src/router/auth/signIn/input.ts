import { z } from 'zod'

export const zSignInTrpcRoute = z.object({
  nick: z.string().min(8),
  password: z.string().min(8),
})
