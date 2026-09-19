import { TimetableEntry } from '../types'
import { mockApiCall, ApiResponse } from './api'

export const timetableService = {
  async getAll(entries: TimetableEntry[]): Promise<ApiResponse<TimetableEntry[]>> {
    return mockApiCall<TimetableEntry[]>(entries)
  },

  async create(entry: Omit<TimetableEntry, 'id'>): Promise<ApiResponse<TimetableEntry>> {
    const newEntry: TimetableEntry = {
      ...entry,
      id: `tt_${Date.now()}`,
    }
    return mockApiCall(newEntry)
  },

  async update(id: string, updates: Partial<TimetableEntry>, entries: TimetableEntry[]): Promise<ApiResponse<TimetableEntry | null>> {
    const existing = entries.find((e) => e.id === id)
    if (!existing) return { data: null, success: false, message: 'Class not found' }
    return mockApiCall<TimetableEntry>({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return mockApiCall({ id })
  },
}
