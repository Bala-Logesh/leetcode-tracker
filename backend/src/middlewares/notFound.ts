import { Request, Response } from 'express'
import { APIError } from './errorHandler'
import logger from '../logger/logger'

export const notFound = (req: Request, res: Response) => {
    logger.error(`Requested URL not found - ${req.originalUrl} - ${req.method}`)
    throw new APIError('Route not found', 404)
}
