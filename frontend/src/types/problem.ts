export type ICreateProblem = {
  problemNo: number
  name: string
  tags: string[]
  solutions: string[][]
  pointsToRemember?: string[]
  dpPoints?: string[]
  datesAttempted?: string[]
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
