import { toClientMe } from '../../../lib/clientMe'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zUpdateProfileInput } from './input'
import { ExpectedError } from '../../../lib/error'
export const updateProfileTprcRoute = trpcLoggedProcedure
  .input(zUpdateProfileInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('Неавторизован!')
    }

    if (ctx.me.nick !== input.nick) {
      const exUser = await ctx.prisma.user.findUnique({
        where: {
          nick: input.nick,
        },
      })
      if (exUser) {
        throw new ExpectedError('Никнейм уже существует!')
      }
    }

    const updateMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        nick: input.nick,
        name: input.name,
        avatar: input.avatar,
      },
    })

    ctx.me = updateMe
    return toClientMe(updateMe)
  })
