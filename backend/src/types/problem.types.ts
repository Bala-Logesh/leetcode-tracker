export type ICreateSolution = {
  solutions: string[]
}

export type ICreateProblemReq = {
  problemNo: number
  name: string
  tags: string[]
  solutions: ICreateSolution[]
  pointsToRemember?: ICreateSolution
  dpPoints?: ICreateSolution
  datesAttempted?: string[]
}
