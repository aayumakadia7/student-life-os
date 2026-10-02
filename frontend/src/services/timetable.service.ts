import { TimetableEntry } from '../types'
import { apiClient, mockApiCall, ApiResponse } from './api'

export const timetableService = {
  async getAll(fallbackEntries: TimetableEntry[] = [], day?: string): Promise<ApiResponse<TimetableEntry[]>> {
    const endpoint = day ? `/timetable?day=${encodeURIComponent(day)}` : '/timetable'
    const res = await apiClient<TimetableEntry[]>(endpoint)
    if (res.success && Array.isArray(res.data)) {
      return res
    }
    return mockApiCall<TimetableEntry[]>(fallbackEntries)
  },

  async create(entry: Omit<TimetableEntry, 'id'>): Promise<ApiResponse<TimetableEntry>> {
    const res = await apiClient<TimetableEntry>('/timetable', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
    if (res.success && res.data) {
      return res
    }
    const newEntry: TimetableEntry = {
      ...entry,
      id: `tt_${Date.now()}`,
    }
    return mockApiCall(newEntry)
  },

  async update(
    id: string,
    updates: Partial<TimetableEntry>,
    entries: TimetableEntry[] = []
  ): Promise<ApiResponse<TimetableEntry | null>> {
    const res = await apiClient<TimetableEntry>(`/timetable/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    if (res.success && res.data) {
      return res
    }
    const existing = entries.find((e) => e.id === id)
    if (!existing) return { data: null, success: false, message: 'Class not found' }
    return mockApiCall<TimetableEntry>({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await apiClient<{ id: string }>(`/timetable/${id}`, {
      method: 'DELETE',
    })
    if (res.success) {
      return res
    }
    return mockApiCall({ id })
  },
}
