import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/dist/zod.js'

export const zUpdatePasswordInput = z.object({
  currentPassword: zStringRequired,
  newPassword: zStringRequired,
})
