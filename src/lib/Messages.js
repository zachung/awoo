import { createLogger, format, transports } from 'winston'
import colors from 'colors'

const { timestamp, printf } = format

const myFormat = printf(({ level, message, timestamp }) => {
  let types = {
    'info': colors.green,
    'error': colors.red
  }
  return types[level](`${timestamp} [${level}] ${message}`)
})

const transportConsole = new transports.Console({
  level: 'debug',
  format: format.combine(
    format.splat(),
    format.simple(),
    timestamp({ format: 'HH:mm:ss' }),
    myFormat
  ),
})
const logger = createLogger({
  transports: [
    transportConsole
  ]
})

export default {
  info (msg) {
    logger.info(msg)
  },
  error (msg) {
    logger.error(msg)
  },
  onLogging (cb) {
    return logger.on('data', cb)
  }
}
