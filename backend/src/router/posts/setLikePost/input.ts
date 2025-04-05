import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/src/zod'

export const zSetLikePostInput = z.object({
  postId: zStringRequired,
  isLikedByMe: z.boolean(),
})
