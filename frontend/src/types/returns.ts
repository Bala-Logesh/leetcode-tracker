import type { ICreateProblem } from "./problem"

export type RValidateForm = {
  isValid: boolean
  errors: Record<string, string>
  sanitizedData: ICreateProblem
}