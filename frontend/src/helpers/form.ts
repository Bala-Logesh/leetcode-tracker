import type { ICreateProblem } from '../types/problem'
import type { RValidateForm } from '../types/returns'

// Function to clean up any empty strings, whitespace-only entries, or empty nested arrays
const sanitizeForm = (formData: ICreateProblem) => {
  return {
    ...formData,

    name: formData.name?.trim() || '',

    problemNo: Number(formData.problemNo) || 0,

    tags: (formData.tags || []).map((t) => t.trim()).filter((t) => t !== ''),

    solutions: (formData.solutions || [])
      .map((lines) => lines.map((l) => l.trim()).filter((l) => l !== ''))
      .filter((solutionBlock) => solutionBlock.length > 0),

    pointsToRemember: (formData.pointsToRemember || [])
      .map((p) => p.trim())
      .filter((p) => p !== ''),

    dpPoints: (formData.dpPoints || [])
      .map((d) => d.trim())
      .filter((d) => d !== ''),

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
