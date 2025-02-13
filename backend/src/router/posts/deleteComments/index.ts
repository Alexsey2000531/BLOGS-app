import { connect } from 'http2'
import { trpc } from '../../../lib/trpc'
import { zDeleteCommentsTrpcInput } from './input'

export const zDeleteCommentsTrpcRoute = trpc.procedure
  .input(zDeleteCommentsTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { commentId, authorId } = input

    const comments = await ctx.prisma.comments.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!comments) {
      throw new Error('Комментарий не найден!')
    }

    const post = await ctx.prisma.post.findUnique({
      where: {
        id: comments.postId,
      },
    })

    if (comments.authorId !== authorId && post?.authorId !== authorId) {
      throw new Error('Вы не можете удалить этот комментарий!')
    }

    return await ctx.prisma.comments.delete({
      where: {
        id: commentId,
      },
    })
  })
