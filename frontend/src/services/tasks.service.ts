import { Task } from '../types'
import { apiClient, mockApiCall, ApiResponse } from './api'

export const tasksService = {
  async getAll(fallbackTasks: Task[] = []): Promise<ApiResponse<Task[]>> {
    const res = await apiClient<Task[]>('/tasks')
    if (res.success && Array.isArray(res.data)) {
      return res
    }
    return mockApiCall<Task[]>(fallbackTasks)
  },

  async create(
    task: Omit<Task, 'id' | 'createdAt'>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _currentTasks: Task[] = []
  ): Promise<ApiResponse<Task>> {
    const res = await apiClient<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })
    if (res.success && res.data) {
      return res
    }
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return mockApiCall<Task>(newTask)
  },

  async update(
    id: string,
    updates: Partial<Task>,
    currentTasks: Task[] = []
  ): Promise<ApiResponse<Task | null>> {
    const res = await apiClient<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    if (res.success && res.data) {
      return res
    }
    const existing = currentTasks.find((t) => t.id === id)
    if (!existing) {
      return { data: null, success: false, message: 'Task not found' }
    }
    return mockApiCall<Task>({ ...existing, ...updates })
  },

  async updateStatus(id: string, status: 'todo' | 'in_progress' | 'completed'): Promise<ApiResponse<Task | null>> {
    const res = await apiClient<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return res
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await apiClient<{ id: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    })
    if (res.success) {
      return res
    }
    return mockApiCall({ id })
  },
}
