import { AttendanceRecord } from '../types'
import { apiClient, mockApiCall, ApiResponse } from './api'

export const attendanceService = {
  async getAll(fallbackRecords: AttendanceRecord[] = []): Promise<ApiResponse<AttendanceRecord[]>> {
    const res = await apiClient<AttendanceRecord[]>('/attendance')
    if (res.success && Array.isArray(res.data)) {
      return res
    }
    return mockApiCall(fallbackRecords)
  },

  async create(record: Omit<AttendanceRecord, 'id'>): Promise<ApiResponse<AttendanceRecord>> {
    const res = await apiClient<AttendanceRecord>('/attendance', {
      method: 'POST',
      body: JSON.stringify(record),
    })
    return res
  },

  async update(
    id: string,
    updates: Partial<AttendanceRecord>,
    records: AttendanceRecord[] = []
  ): Promise<ApiResponse<AttendanceRecord | null>> {
    const res = await apiClient<AttendanceRecord>(`/attendance/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    if (res.success && res.data) {
      return res
    }
    const existing = records.find((r) => r.id === id)
    if (!existing) return { data: null, success: false, message: 'Attendance record not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async markAttendance(
    id: string,
    attended: boolean,
    records: AttendanceRecord[] = []
  ): Promise<ApiResponse<AttendanceRecord | null>> {
    const action = attended ? 'present' : 'absent'
    const res = await apiClient<AttendanceRecord>(`/attendance/${id}/${action}`, {
      method: 'POST',
    })
    if (res.success && res.data) {
      return res
    }
    const existing = records.find((r) => r.id === id)
    if (!existing) return { data: null, success: false, message: 'Attendance record not found' }
    const updated: AttendanceRecord = {
      ...existing,
      held: existing.held + 1,
      attended: attended ? existing.attended + 1 : existing.attended,
    }
    return mockApiCall(updated)
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient<{ id: string }>(`/attendance/${id}`, {
      method: 'DELETE',
    })
  },
}
