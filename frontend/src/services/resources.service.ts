import { Resource } from '../types'
import { mockApiCall, ApiResponse } from './api'

export const resourcesService = {
  async getAll(resources: Resource[]): Promise<ApiResponse<Resource[]>> {
    return mockApiCall(resources)
  },

  async create(resource: Omit<Resource, 'id'>): Promise<ApiResponse<Resource>> {
    const newResource: Resource = {
      ...resource,
      id: `res_${Date.now()}`,
    }
    return mockApiCall(newResource)
  },

  async update(id: string, updates: Partial<Resource>, resources: Resource[]): Promise<ApiResponse<Resource | null>> {
    const existing = resources.find((r) => r.id === id)
    if (!existing) return { data: null, success: false, message: 'Resource not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return mockApiCall({ id })
  },
}
