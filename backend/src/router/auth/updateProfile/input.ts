import { z } from 'zod'
import { zNickRequired } from '@BLOGS/shared/dist/zod.js'

export const zUpdateProfileInput = z.object({
  nick: zNickRequired,
  name: z.string().max(50).default(''),
  avatar: z.string().nullable(),
})
