import { Assignment } from '../types'
import { mockApiCall, ApiResponse } from './api'

export const assignmentsService = {
  async getAll(assignments: Assignment[]): Promise<ApiResponse<Assignment[]>> {
    return mockApiCall(assignments)
  },

  async create(assignment: Omit<Assignment, 'id'>): Promise<ApiResponse<Assignment>> {
    const newAssignment: Assignment = {
      ...assignment,
      id: `asg_${Date.now()}`,
    }
    return mockApiCall(newAssignment)
  },

  async update(id: string, updates: Partial<Assignment>, assignments: Assignment[]): Promise<ApiResponse<Assignment | null>> {
    const existing = assignments.find((a) => a.id === id)
    if (!existing) return { data: null, success: false, message: 'Assignment not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return mockApiCall({ id })
  },
}
