import { trpcLoggedProcedure } from '../../../lib/trpc'
import { z } from 'zod'
import { env } from '../../../lib/env'
const zUpdateFileUrlTrpcInput = z.object({
  fileKey: z.string(),
  type: z.enum(['avatar', 'image']),
})

export const updateFileUrlTrpcRoute = trpcLoggedProcedure
  .input(zUpdateFileUrlTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.me?.id
    const fileUrl = `http://${env.S3_BUCKET_NAME}.r2.cloudflarestorage.com/${input.fileKey}`

    await ctx.prisma.user.update({
      where: { id: userId },
      data: { 
        avatar: input.fileKey
      },
    })

    return { fileUrl }
  })