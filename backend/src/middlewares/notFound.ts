import { NextFunction, Request, Response } from 'express'
import { APIError } from './errorHandler'
import logger from '../logger/logger'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  logger.error(`Requested URL not found - ${req.originalUrl} - ${req.method}`)
  const error = new APIError('Route not found', 404)
  next(error)
}
