import { toClientMe } from '../../../lib/clientMe'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zUpdateProfileInput } from './input'
import { env } from '../../../lib/env'
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
        throw Error('Никнейм уже существует!')
      }
    }

    let fileUrl: string | undefined
    if (input.fileKey) {
      fileUrl = `https://${env.S3_BUCKET_NAME}.r2.cloudflarestorage.com/${input.fileKey}`
    }

    const updateMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        nick: input.nick,
        name: input.name,
        ...(fileUrl && { avatar: fileUrl }),
      },
    })
    ctx.me = updateMe
    return toClientMe(updateMe)
  })
