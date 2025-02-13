import { z } from 'zod'

export const zCreateCommentsTrpcInput = z.object({
  postId: z.string(),
  authorId: z.string(),
  content: z.string().min(1, 'Комментарий не может быть пустым!'),
})
