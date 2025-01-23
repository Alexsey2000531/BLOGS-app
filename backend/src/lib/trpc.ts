import { initTRPC } from '@trpc/server'
import * as trcpExpress from '@trpc/server/adapters/express'
import { type Express } from 'express'
import { type TrpcRouter } from '../router'

export const trpc = initTRPC.create()

export const applyTrpcToExpressApp = (expressApp: Express, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trcpExpress.createExpressMiddleware({
      router: trpcRouter,
    })
  )
}
