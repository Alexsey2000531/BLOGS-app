import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@BLOGS/shared/src/zod'
import { z } from 'zod'

const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  HOST_ENV: zEnvHost,
  VITE_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_S3_URL: zEnvNonemptyTrimmed,
  VITE_S3_ACCESS_KEY_ID: zEnvNonemptyTrimmed,
  VITE_S3_BUCKET_NAME: zEnvNonemptyTrimmed,
  VITE_WEBAPP_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
})

// eslint-disable-next-line no-undef
export const env = zEnv.parse(process.env)
