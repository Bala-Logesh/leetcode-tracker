import type { ITag } from './tags'

export type ICreateProblem = {
  problemNo: number
  name: string
  tags: string[]
  solutions: string[][]
  pointsToRemember?: string[]
  dpPoints?: string[]
  datesAttempted?: string[]
}

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

export const DEFAULT_CREATE_PROBLEM: ICreateProblem = {
  problemNo: 0,
  name: '',
  tags: [],
  solutions: [[]],
  pointsToRemember: [],
  dpPoints: ['', ''],
  datesAttempted: [],
}
