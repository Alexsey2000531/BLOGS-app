import cors from 'cors'
import express from 'express'
import https from 'https'
import fs from 'fs'
import { SecureContextOptions } from 'tls';
import { type AppContext, createAppContext } from './lib/ctx'
import { env } from './lib/env'
import { applyPassportToExpressApp } from './lib/passport'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { presetDb } from './scripts/presetDb'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    await presetDb(ctx)
    const expressApp = express()
    expressApp.use(cors({
      origin: ['https://localhost:8000', 'http://localhost:8000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))

    applyPassportToExpressApp(expressApp, ctx)
    await applyTrpcToExpressApp(expressApp, ctx, trpcRouter)

    const httpsOptions: SecureContextOptions = {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
      minVersion: 'TLSv1.2',
      ciphers: [
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
      ].join(':'),
      honorCipherOrder: true,
    };

    https.createServer(httpsOptions, expressApp).listen(env.PORT, () => {
      console.info(`Server running on https://localhost:${env.PORT}`)
    })

  } catch (error) {
    console.error(error)
    await ctx?.stop()
  }
})()
