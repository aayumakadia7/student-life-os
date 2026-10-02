import { Assignment } from '../types'
import { apiClient, mockApiCall, ApiResponse } from './api'

export const assignmentsService = {
  async getAll(fallbackAssignments: Assignment[] = [], status?: string): Promise<ApiResponse<Assignment[]>> {
    const endpoint = status ? `/assignments?status=${encodeURIComponent(status)}` : '/assignments'
    const res = await apiClient<Assignment[]>(endpoint)
    if (res.success && Array.isArray(res.data)) {
      return res
    }
    return mockApiCall(fallbackAssignments)
  },

  async create(assignment: Omit<Assignment, 'id'>): Promise<ApiResponse<Assignment>> {
    const res = await apiClient<Assignment>('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    })
    if (res.success && res.data) {
      return res
    }
    const newAssignment: Assignment = {
      ...assignment,
      id: `asg_${Date.now()}`,
    }
    return mockApiCall(newAssignment)
  },

  async update(
    id: string,
    updates: Partial<Assignment>,
    assignments: Assignment[] = []
  ): Promise<ApiResponse<Assignment | null>> {
    const res = await apiClient<Assignment>(`/assignments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    if (res.success && res.data) {
      return res
    }
    const existing = assignments.find((a) => a.id === id)
    if (!existing) return { data: null, success: false, message: 'Assignment not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await apiClient<{ id: string }>(`/assignments/${id}`, {
      method: 'DELETE',
    })
    if (res.success) {
      return res
    }
    return mockApiCall({ id })
  },
}
