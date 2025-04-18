import winston from 'winston'
import _ from 'lodash'
import { EOL } from 'os'
import { MESSAGE } from 'triple-beam'
import * as yaml from 'yaml'
import { serializeError } from 'serialize-error'
import pc from 'picocolors'
import { env } from './env'
import debug from 'debug'
import { deepMap } from '../utils/deepMap'

export const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format:
        env.HOST_ENV !== 'local'
          ? winston.format.json()
          : winston.format((logData) => {
              const setColor = {
                info: (str: string) => pc.blue(str),
                error: (str: string) => pc.red(str),
                debug: (str: string) => pc.cyan(str),
              }[logData.level as 'info' | 'error' | 'debug']
              const levelAndType = `${logData.level} ${logData.logType}`
              const topMessage = `${setColor(levelAndType)} ${EOL}${logData.message}`

              const visibleMessageTags = _.omit(logData, [
                'level',
                'logType',
                'timestamp',
                'message',
                'service',
                'hostEnv',
              ])

              const stringifyedLogData = _.trim(
                yaml.stringify(visibleMessageTags, (k, v) => (_.isFunction(v) ? 'Function' : v))
              )

              const resultLogData = {
                ...logData,
                [MESSAGE]:
                  [topMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifyedLogData}` : '']
                    .filter(Boolean)
                    .join('') + EOL,
              }

              return resultLogData
            })(),
    }),
  ],
})

type Meta = Record<string, any> | undefined

const prettifyMeta = (meta: Meta): Meta => {
  return deepMap(meta, ({ key, value }) => {
    if (['email', 'password', 'newPassword', 'oldPassword', 'token', 'text', 'description'].includes(key)) {
      return '🙈'
    }

    return value
  })
}

export const logger = {
  info: (props: { logType: string; message: string; meta?: Meta }) => {
    if (!debug.enabled(`postnick:${props.logType}`)) {
      return
    }
    {
      winstonLogger.info(props.message, { logType: props.logType, ...prettifyMeta(props.meta) })
    }
  },
  error: (props: { logType: string; error: any; meta?: Meta }) => {
    if (!debug.enabled(`postnick:${props.logType}`)) {
      return
    }
    const serializedError = serializeError(props.error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType: props.logType,
      error: props.error,
      errorStack: serializedError.stack,
      ...prettifyMeta(props.meta),
    })
  },
}
