import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/src/zod'

export const zUpdatePasswordInput = z.object({
  currentPassword: zStringRequired,
  newPassword: zStringRequired,
})
