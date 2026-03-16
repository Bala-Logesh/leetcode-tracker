import { NextFunction, Request, Response } from 'express'
import Tag from '../../models/tag'
import { getTags } from '../../controllers/tags.controller'
import { APIError } from '../../middlewares/errorHandler'

jest.mock('../../logger/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

jest.mock('../../models/tag')

const mockReq = {} as Request
const mockReqParams = {
  query: { page: '1', limit: '10' },
} as unknown as Request
const mockReqEmptyParams = { query: {} } as unknown as Request

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response

const mockNext = jest.fn() as jest.MockedFunction<NextFunction>

const mockTags = [{ name: 'React JS', slug: 'react_js' }]
const mockTotal = 1

describe('Tags Controller - getTags', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return paginated tags with status 200', async () => {
    ;(Tag.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockTags),
    })
    ;(Tag.countDocuments as jest.Mock).mockResolvedValue(mockTotal)

    await getTags(mockReqParams, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockTags,
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    })
  })

  it('should use default values when query params are missing', async () => {
    ;(Tag.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    })
    ;(Tag.countDocuments as jest.Mock).mockResolvedValue(0)

    await getTags(mockReqEmptyParams, mockRes, mockNext)

    expect(Tag.find).toHaveBeenCalled()
    const paginationResult = (mockRes.json as jest.Mock).mock.calls[0][0]
      .pagination
    expect(paginationResult.page).toBe(1)
    expect(paginationResult.limit).toBe(10)
  })

  it('should call next with an APIError when an error occurs', async () => {
    ;(Tag.find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Database Error')
    })

    await getTags(mockReqEmptyParams, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalledWith(expect.any(APIError))

    expect(mockRes.json).not.toHaveBeenCalled()
  })
})
