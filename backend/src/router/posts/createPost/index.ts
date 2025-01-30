import { trpc } from '../../../lib/trpc'
import { zCreatePostTrpcInput } from './input'

export const createPostTrpcRoute = trpc.procedure.input(zCreatePostTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw Error('Не авторизирован!')
  }
  const exPost = await ctx.prisma.post.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (exPost) {
    throw Error('Пост с таким Никнеймом уже существует!')
  }

  await ctx.prisma.post.create({
    data: { ...input, authorId: ctx.me.id },
  })
})
