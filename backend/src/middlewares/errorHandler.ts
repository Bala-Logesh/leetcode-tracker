import { NextFunction, Request, Response } from 'express'
import logger from '../logger/logger'

export class APIError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number, LOG_PREFIX?: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorHandler = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode !== 200 ? err.statusCode : 500

  logger.error(
    `${req.method.toUpperCase()} ${req.originalUrl} [${status}] - ${err.message}\nError track: ${err.stack}`
  )

  res.status(status).json({
    error: err.message,
    status,
  })
}
