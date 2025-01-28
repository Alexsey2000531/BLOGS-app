import { trpc } from '../../lib/trpc'
import { zEditPostTrpcInput } from './input'

export const getEditPostTrpcRoute = trpc.procedure.input(zEditPostTrpcInput).mutation(async ({ ctx, input }) => {
  const { PostId, ...postInput } = input
  if (!ctx.me) {
    throw new Error('Не авторизирован')
  }

  const post = await ctx.prisma.post.findUnique({
    where: {
      id: input.PostId,
    },
  })

  if (!post) {
    throw Error('NOT_FOUND!')
  }

  if (ctx.me.id !== post.authorId) {
    throw new Error('NOT_YOUR_POST')
  }

  if (post.nick !== input.nick) {
    const exPost = await ctx.prisma.post.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exPost) {
      throw new Error('Пост с таким ником уже есть!')
    }
  }

  await ctx.prisma.post.update({
    where: {
      id: PostId,
    },
    data: {
      ...postInput,
    },
  })
})
