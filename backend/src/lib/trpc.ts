import { initTRPC } from '@trpc/server'
import * as trcpExpress from '@trpc/server/adapters/express'
import { type Express } from 'express'
import { type TrpcRouter } from '../router'
import { type AppContext } from './ctx'

export const trpc = initTRPC.context<AppContext>().create()

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trcpExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: () => appContext,
    })
  )
}
