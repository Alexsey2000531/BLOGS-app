import { z } from 'zod'

export const zSetDisLikePostInput = z.object({
  postId: z.string().min(1),
  isDisLikedByMe: z.boolean(),
})
