import { trpc } from '../../../lib/trpc'
import { canBlockedPost } from '../../../utils/canBlockedPost'
import { zBlockedPostInput } from './input'

export const blockedPostTrpcRoute = trpc.procedure.input(zBlockedPostInput).mutation(async ({ ctx, input }) => {
  const { postId } = input

  if (!canBlockedPost(ctx.me)) {
    throw new Error('PERMISSION_DENIED')
  }

  const post = await ctx.prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
    },
  })

  if (!post) {
    throw new Error('Не найден!')
  }

  await ctx.prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      blockedAt: new Date(),
    },
  })

  return true
})
