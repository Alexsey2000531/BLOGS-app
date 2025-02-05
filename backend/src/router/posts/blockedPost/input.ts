import { z } from 'zod'

export const zBlockedPostInput = z.object({
  postId: z.string().min(1),
})
