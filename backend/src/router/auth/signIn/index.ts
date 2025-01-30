import { trpc } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJwt } from '../../../utils/signJwt'
import { zSignInTrpcRoute } from './input'

export const signInTrpcRoute = trpc.procedure.input(zSignInTrpcRoute).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  })

  if (!user) {
    throw Error('Неправильный никнейм или пароль!')
  }

  const token = signJwt(user.id)
  return { token }
})
