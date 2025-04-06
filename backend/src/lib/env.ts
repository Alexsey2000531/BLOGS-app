import * as dotenv from 'dotenv'
import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@BLOGS/shared/src/zod'
import { z } from 'zod'

dotenv.config()

const zEnv = z.object({
  PORT: zEnvNonemptyTrimmed,
  HOST_ENV: zEnvHost,
  DATABASE_URL: zEnvNonemptyTrimmed,
  JWT_SECRET: zEnvNonemptyTrimmed,
  PASSWORD_SALT: zEnvNonemptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zEnvNonemptyTrimmed,
  WEBAPP_URL: zEnvNonemptyTrimmed,
  S3_ACCESS_KEY_ID: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_SECRET_ACCESS_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_BUCKET_NAME: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_REGION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_URL: zEnvNonemptyTrimmed,
  DEBUG: zEnvNonemptyTrimmed,
})

// eslint-disable-next-line no-undef
export const env = zEnv.parse(process.env)
