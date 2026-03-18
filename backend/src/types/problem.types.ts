export type ICreateSolution = {
  solutions: string[]
}

export type IProblemReq = {
  problemNo: number
  name: string
  tags: string[]
  solutions: ICreateSolution[]
  pointsToRemember?: ICreateSolution
  dpPoints?: ICreateSolution
  datesAttempted?: string[]
}

export type IProblemDateUpd = {
  dateString: string
  action: 'add' | 'remove'
}
