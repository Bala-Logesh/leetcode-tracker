import { NextFunction, Request, Response } from 'express'
import { getTags } from '../../controllers/tags.controller'
import logger from '../../logger/logger'

jest.mock('../../logger/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

const mockReq = {} as Request

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response

const mockNext = jest.fn() as jest.MockedFunction<NextFunction>

describe('Tags Controller - getTags', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return tags with status 200', async () => {
    await getTags(mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith([])
  })

  it('should call next with an APIError when an error occurs', async () => {
    ;(logger.info as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Database connection failed')
    })

    await getTags(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Failed to get tags',
        statusCode: 500,
      })
    )

    expect(mockRes.json).not.toHaveBeenCalled()
  })
})
