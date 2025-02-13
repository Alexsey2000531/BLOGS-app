import { trpc } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJwt } from '../../../utils/signJwt'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpc.procedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUserWithEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })

  if (exUserWithEmail) {
    throw Error('Пользователь с таким Email уже существует!')
  }

  const exUserWithNick = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (exUserWithNick) {
    throw Error('Пользователь с таким Никнеймом уже существует!')
  }

  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: getPasswordHash(input.password),
    },
  })

  const token = signJwt(user.id)
  return { token }
})
