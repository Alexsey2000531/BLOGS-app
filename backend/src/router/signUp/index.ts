import crypto from 'crypto'
import { trpc } from '../../lib/trpc'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpc.procedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUser = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (exUser) {
    throw Error('Пользователь с таким Никнеймом уже существует!')
  }

  await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      password: crypto.createHash('sha256').update(input.password).digest('hex'),
    },
  })
})
