import * as Sentry from '@sentry/node'
import { env } from './env'
import { type LoggerMetaData } from './logger'

const isSentryEnabled = env.BACKEND_SENTRY_DSN

export const initSentry = () => {
  if (isSentryEnabled) {
    Sentry.init({
      dsn: env.BACKEND_SENTRY_DSN,
      environment: env.HOST_ENV,
      release: env.SOURCE_VERSION,
      normalizeDepth: 10,
    })
  }
}

export const sentryCaptureException = (error: Error, prettifiedMeta?: LoggerMetaData) => {
  if (isSentryEnabled) {
    Sentry.captureException(error, prettifiedMeta)
  }
}
