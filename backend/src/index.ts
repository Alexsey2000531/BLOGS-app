import cors from 'cors'
import express from 'express'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'

const expressApp = express()
expressApp.use(cors())

applyTrpcToExpressApp(expressApp, trpcRouter)

expressApp.listen(3000, () => {
  console.info('Listen at http://localhost:3000')
})
