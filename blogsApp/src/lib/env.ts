import { zEnvNonemptyTrimmed } from '@BLOGS/shared/src/zod'
import { z } from 'zod'

const zEnv = z.object({
  VITE_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_S3_URL: zEnvNonemptyTrimmed,
  VITE_S3_ACCESS_KEY_ID: zEnvNonemptyTrimmed,
  VITE_S3_BUCKET_NAME: zEnvNonemptyTrimmed,
})

// eslint-disable-next-line no-undef
export const env = zEnv.parse(process.env)
