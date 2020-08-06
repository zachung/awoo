import { createLogger, format, transports } from 'winston'
import colors from 'colors'

const { timestamp, printf } = format
const Types = {
  // 系統訊息
  SYSTEM: Symbol('system'),
  // 聊天訊息
  CHAT: Symbol('chat'),
}

const myFormat = printf(({ level, message, timestamp, ...meta }) => {
  const { type = Types.SYSTEM } = meta
  switch (type) {
    case Types.SYSTEM:
      let types = {
        info: colors.green,
        error: colors.red
      }
      return types[level](`${timestamp} [${level}] ${message}`)
    case Types.CHAT:
      const { name } = meta
      return `${name}: ${message}`
    default:
      return message
  }
})

const transportConsole = new transports.Console({
  level: 'debug',
  format: format.combine(
    format.splat(),
    format.simple(),
    timestamp({ format: 'HH:mm:ss' }),
    myFormat
  )
})
const logger = createLogger({
  transports: [
    transportConsole
  ]
})

export default {
  info (...args) {
    logger.info(...args)
  },
  error (...args) {
    logger.error(...args)
  },
  onLogging (cb) {
    return logger.on('data', cb)
  }
}
export { Types }
