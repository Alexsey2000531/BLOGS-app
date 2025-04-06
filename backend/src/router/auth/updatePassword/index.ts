import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { zUpdatePasswordInput } from './input'

export const updatePasswordTrpcRoute = trpcLoggedProcedure
  .input(zUpdatePasswordInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('Неавторизован')
    }

    if (ctx.me.password !== getPasswordHash(input.currentPassword)) {
      throw new Error('Неверный старый пароль!')
    }

    const updateMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        password: getPasswordHash(input.newPassword),
      },
    })

    ctx.me = updateMe
    return true
  })
