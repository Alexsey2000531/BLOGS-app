import { toClientMe } from '../../../lib/clientMe'
import { trpc } from '../../../lib/trpc'
import { zUpdateProfileInput } from './input'

export const updateProfileTprcRoute = trpc.procedure.input(zUpdateProfileInput).mutation(async ({ ctx, input }) => {
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
      throw Error('Никнейм уже существует!')
    }
  }
  const updateMe = await ctx.prisma.user.update({
    where: {
      id: ctx.me.id,
    },
    data: input,
  })
  ctx.me = updateMe
  return toClientMe(updateMe)
})
