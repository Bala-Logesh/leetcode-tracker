import type { Pagination } from './common'
import type { ITag } from './tags'

export type ISolution = {
  _id: string
  problemId: string
  solutions: string[]
  __v?: number
}

export type IProblem = {
  _id: string
  problemNo: number
  name: string
  tags: ITag[]
  solutions: ISolution[]
  pointsToRemember?: ISolution
  dpPoints?: ISolution
  datesAttempted?: string[]
  __v?: number
}

export type ICreateSolution = Pick<ISolution, 'solutions'>

export type ICreateProblem = Omit<
  IProblem,
  '_id' | '__v' | 'solutions' | 'pointsToRemember' | 'dpPoints' | 'tags'
> & {
  _id?: string
  tags: ITag[]
  solutions: ICreateSolution[]
  pointsToRemember?: ICreateSolution
  dpPoints?: ICreateSolution
}

export const getInitialProblemState = (): ICreateProblem => ({
  problemNo: 0,
  name: '',
  tags: [],
  solutions: [{ solutions: [] }],
  pointsToRemember: { solutions: [] },
  dpPoints: { solutions: ['', ''] },
  datesAttempted: [],
})

// API Types
export type IProblemsAPIResp = {
  success: boolean
  data: IProblem[]
  pagination: Pagination
}

export type IProblemAPIResp = {
  success: boolean
  data: IProblem
}
