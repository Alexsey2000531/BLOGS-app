import { z } from 'zod'

export const zSignInTrpcRoute = z.object({
  nick: z.string().min(1),
  email: z.string().min(1).email(),
  password: z.string().min(1),
})
