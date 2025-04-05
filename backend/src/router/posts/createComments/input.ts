import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/src/zod'

export const zCreateCommentsTrpcInput = z.object({
  postId: z.string(),
  authorId: z.string(),
  content: zStringRequired,
})
