import { Resource } from '../types'
import { apiClient, mockApiCall, ApiResponse } from './api'

export const resourcesService = {
  async getAll(
    fallbackResources: Resource[] = [],
    type?: string,
    subject?: string
  ): Promise<ApiResponse<Resource[]>> {
    let endpoint = '/resources'
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (subject) params.append('subject', subject)
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`

    const res = await apiClient<Resource[]>(endpoint)
    if (res.success && Array.isArray(res.data)) {
      return res
    }
    return mockApiCall(fallbackResources)
  },

  async create(resource: Omit<Resource, 'id'>): Promise<ApiResponse<Resource>> {
    const res = await apiClient<Resource>('/resources', {
      method: 'POST',
      body: JSON.stringify(resource),
    })
    if (res.success && res.data) {
      return res
    }
    const newResource: Resource = {
      ...resource,
      id: `res_${Date.now()}`,
    }
    return mockApiCall(newResource)
  },

  async update(
    id: string,
    updates: Partial<Resource>,
    resources: Resource[] = []
  ): Promise<ApiResponse<Resource | null>> {
    const res = await apiClient<Resource>(`/resources/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    if (res.success && res.data) {
      return res
    }
    const existing = resources.find((r) => r.id === id)
    if (!existing) return { data: null, success: false, message: 'Resource not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await apiClient<{ id: string }>(`/resources/${id}`, {
      method: 'DELETE',
    })
    if (res.success) {
      return res
    }
    return mockApiCall({ id })
  },
}
