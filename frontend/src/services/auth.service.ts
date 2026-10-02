import { apiClient, authStorage, ApiResponse } from './api'
import { UserProfile } from '../types'

export interface AuthResponse {
  accessToken: string
  user: UserProfile
}

export const authService = {
  async register(data: {
    name: string
    email: string
    password: string
    college?: string
    course?: string
    semester?: string
  }): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (res.success && res.data?.accessToken) {
      authStorage.setToken(res.data.accessToken)
    }

    return res
  },

  async login(data: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (res.success && res.data?.accessToken) {
      authStorage.setToken(res.data.accessToken)
    }

    return res
  },

  logout(): void {
    authStorage.clearToken()
  },

  async getMe(): Promise<ApiResponse<UserProfile>> {
    return apiClient<UserProfile>('/auth/me')
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  isAuthenticated(): boolean {
    return !!authStorage.getToken()
  },
}
