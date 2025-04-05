import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/src/zod'

export const zSetDisLikePostInput = z.object({
  postId: zStringRequired,
  isDisLikedByMe: z.boolean(),
})
