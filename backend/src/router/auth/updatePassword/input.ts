import { z } from 'zod'

export const zUpdatePasswordInput = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
})
