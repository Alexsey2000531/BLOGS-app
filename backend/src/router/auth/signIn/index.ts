import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJwt } from '../../../utils/signJwt'
import { zSignInTrpcRoute } from './Input'

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcRoute).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  })

  if (!user) {
    throw new ExpectedError('Неправильный никнейм или пароль!')
  }

  const token = signJwt(user.id)
  return { token, userId: user.id }
})
