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
  tags: ITag[]
  solutions: ICreateSolution[]
  pointsToRemember?: ICreateSolution
  dpPoints?: ICreateSolution
}

export const DEFAULT_SOLUTION: ICreateSolution = {
  solutions: [],
}

export const DEFAULT_DP_SOLUTION: ICreateSolution = {
  solutions: ['', ''],
}

export const DEFAULT_CREATE_PROBLEM: ICreateProblem = {
  problemNo: 0,
  name: '',
  tags: [],
  solutions: [{ ...DEFAULT_SOLUTION }],
  pointsToRemember: { ...DEFAULT_SOLUTION },
  dpPoints: DEFAULT_DP_SOLUTION,
  datesAttempted: [],
}
