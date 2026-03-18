import type { ICreateProblem } from '../types/problem'
import type { RValidateForm } from '../types/returns'

// Function to clean up any empty strings, whitespace-only entries, or empty nested arrays
const sanitizeForm = (formData: ICreateProblem): ICreateProblem => {
  return {
    ...formData,

    name: formData.name?.trim() || '',

    problemNo: Number(formData.problemNo) || 0,

    solutions: (formData.solutions || [])
      .map((s) => ({
        solutions: s.solutions
          .map((line) => line.trim())
          .filter((line) => line !== ''),
      }))
      .filter((s) => s.solutions.length > 0),

    pointsToRemember: formData.pointsToRemember?.solutions?.length
      ? {
          solutions: formData.pointsToRemember.solutions
            .map((p) => p.trim())
            .filter((p) => p !== ''),
        }
      : undefined,

    dpPoints: formData.dpPoints?.solutions?.length
      ? {
          solutions: formData.dpPoints.solutions
            .map((d) => d.trim())
            .filter((d) => d !== ''),
        }
      : undefined,

    datesAttempted: formData.datesAttempted || [],
  }
}

// Validate form and collect errors
export const validateForm = (formData: ICreateProblem): RValidateForm => {
  const sFormData = sanitizeForm(formData)
  const errors: Record<string, string> = {}

  if (sFormData.problemNo <= 0) {
    errors.problemNo = 'Problem number must be greater than 0.'
  }

  if (!sFormData.name) {
    errors.name = 'Problem name must not be empty.'
  }

  if (sFormData.tags.length === 0) {
    errors.tags = 'Please select at least one tag.'
  }

  if (sFormData.solutions.length === 0) {
    errors.solutions = 'At least one solution or approach is required.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: sFormData,
  }
}
