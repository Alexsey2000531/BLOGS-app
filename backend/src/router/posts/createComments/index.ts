import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateCommentsTrpcInput } from './input'

export const zCreateCommentsTrpcRoute = trpcLoggedProcedure
  .input(zCreateCommentsTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { postId, authorId, content } = input

    if (!ctx.me) {
      throw new Error('Не авторизован!')
    }

    const post = await ctx.prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!post) {
      throw new Error('Не найдено!')
    }

    const addComments = await ctx.prisma.comments.create({
      data: {
        content,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    })

    return addComments
  })
