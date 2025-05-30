import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/dist/zod.js'

export const zSetLikePostInput = z.object({
  postId: zStringRequired,
  isLikedByMe: z.boolean(),
})
