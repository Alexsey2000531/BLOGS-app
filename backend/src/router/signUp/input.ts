import { z } from 'zod'

export const zSignUpTrpcInput = z.object({
  nick: z
    .string()
    .min(5)
    .regex(/^[a-z0-9-]+$/, 'Никнейм может содержать строчные буквы, цифры и тире'),
  password: z.string().min(8),
})
