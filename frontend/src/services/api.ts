export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3000/api'

const TOKEN_KEY = 'student_os_jwt_token'

export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  setToken: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // ignore
    }
  },
  clearToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // ignore
    }
  },
}

/**
 * Robust API Client connecting frontend to NestJS backend.
 * Automatically injects JWT Bearer tokens and handles response status parsing.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const token = authStorage.getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        data: json,
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      }
    }

    return {
      data: json,
      success: true,
    }
  } catch (error) {
    return {
      data: null as any,
      success: false,
      message: error instanceof Error ? error.message : 'Network error connecting to backend API',
    }
  }
}

/**
 * Standard simulated API wrapper for fallback and offline local data.
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
