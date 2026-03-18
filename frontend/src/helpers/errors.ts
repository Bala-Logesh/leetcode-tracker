import axios from 'axios'

export const handleApiError = (err: unknown): Error => {
  if (axios.isAxiosError(err)) {
    // Server responded with error
    if (err.response) {
      const message =
        (err.response.data as any)?.error ||
        (err.response.data as any)?.message ||
        'Request failed'

      return new Error(message)
    }

    // No response (network error)
    if (err.request) {
      return new Error('Network error. Please check your connection.')
    }

    return new Error(err.message)
  }

  return new Error('Unexpected error occurred')
}
