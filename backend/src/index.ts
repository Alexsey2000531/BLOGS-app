import * as trcpExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { trpcRouter } from './trpc'

const expressApp = express()
expressApp.use(cors())

expressApp.use(
  '/trpc',
  trcpExpress.createExpressMiddleware({
    router: trpcRouter,
  })
)

expressApp.listen(3000, () => {
  console.info('Listen at http://localhost:3000')
})
