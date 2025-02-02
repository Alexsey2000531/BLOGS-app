import { z } from 'zod'

export const zSetLikePostInput = z.object({
  postId: z.string().min(1),
  isLikedByMe: z.boolean(),
})
