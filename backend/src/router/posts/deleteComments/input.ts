import { z } from 'zod'

export const zDeleteCommentsTrpcInput = z.object({
  commentId: z.string(),
  authorId: z.string(),
})
