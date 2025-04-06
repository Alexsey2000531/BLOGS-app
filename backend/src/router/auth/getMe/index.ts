import { toClientMe } from '../../../lib/clientMe'
import { trpcLoggedProcedure } from '../../../lib/trpc'

export const getMeTrpcRoute = trpcLoggedProcedure.query(({ ctx }) => {
  return { me: toClientMe(ctx.me) }
})
