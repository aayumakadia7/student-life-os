import { Task } from '../types'
import { mockApiCall, ApiResponse } from './api'

export const tasksService = {
  async getAll(tasks: Task[]): Promise<ApiResponse<Task[]>> {
    return mockApiCall<Task[]>(tasks)
  },

  async create(task: Omit<Task, 'id' | 'createdAt'>, currentTasks: Task[]): Promise<ApiResponse<Task>> {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return mockApiCall<Task>(newTask)
  },

  async update(id: string, updates: Partial<Task>, currentTasks: Task[]): Promise<ApiResponse<Task | null>> {
    const existing = currentTasks.find((t) => t.id === id)
    if (!existing) {
      return { data: null, success: false, message: 'Task not found' }
    }
    return mockApiCall<Task>({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return mockApiCall({ id })
  },
}
