export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

/**
 * Standard simulated API wrapper for future NestJS integration.
 * In development, returns mock/local responses wrapped in Promises.
 */
export async function mockApiCall<T>(data: T, delayMs: number = 50): Promise<ApiResponse<T>> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return {
    data,
    success: true,
  }
}

export const API_BASE_URL = '/api'
