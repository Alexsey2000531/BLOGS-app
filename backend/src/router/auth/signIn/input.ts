import { z } from 'zod'

export const zSignInTrpcRoute = z.object({
  nick: z.string().min(1, 'Никнейм должен содержать хотя бы 1 символ!'),
  email: z.string().min(1).email(),
  password: z.string().min(1, 'Пароль должен содержать хотя бы 1 символ!'),
})
