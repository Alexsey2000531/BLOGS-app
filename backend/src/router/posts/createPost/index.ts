import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreatePostTrpcInput } from './input'

export const createPostTrpcRoute = trpcLoggedProcedure.input(zCreatePostTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw Error('Не авторизирован!')
  }
  const exPost = await ctx.prisma.post.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (exPost) {
    throw new ExpectedError('Пост с таким Никнеймом уже существует!')
  }

  await ctx.prisma.post.create({
    data: { ...input, authorId: ctx.me.id },
  })
})
