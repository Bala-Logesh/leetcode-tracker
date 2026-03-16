import { Request, Response } from 'express'
import logger from '../logger/logger'

export class APIError extends Error {
    statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

export const errorHandler = (err: APIError, req: Request, res: Response) => {
    const status = err.statusCode !== 200 ? err.statusCode : 500

    logger.error(
        `${status} - ${err.message} - ${req.originalUrl} - ${req.method}`
    )

    res.status(status).json({
        error: err.message,
        status,
    })
}
