import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/dist/zod.js'

export const zCreateCommentsTrpcInput = z.object({
  postId: z.string(),
  authorId: z.string(),
  content: zStringRequired,
})
