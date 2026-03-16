import winston from 'winston'
import path from 'path'

const { combine, timestamp, errors, json, printf } = winston.format

const consoleFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : ''
        return `[${timestamp}] ${level}: ${message} ${metaStr}`
    })
)

const fileFormat = combine(timestamp(), errors({ stack: true }), json())

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',

    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        new winston.transports.File({
            filename: path.join('logs', 'app.error.log'),
            format: fileFormat,
            level: 'error',
        }),
        new winston.transports.File({
            filename: path.join('logs', 'app.info.log'),
            format: fileFormat,
            level: 'info',
        }),
    ],
})

export default logger
