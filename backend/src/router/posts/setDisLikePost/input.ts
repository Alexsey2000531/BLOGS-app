import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/dist/zod.js'

export const zSetDisLikePostInput = z.object({
  postId: zStringRequired,
  isDisLikedByMe: z.boolean(),
})
