import { AttendanceRecord } from '../types'
import { mockApiCall, ApiResponse } from './api'

export const attendanceService = {
  async getAll(records: AttendanceRecord[]): Promise<ApiResponse<AttendanceRecord[]>> {
    return mockApiCall(records)
  },

  async update(id: string, updates: Partial<AttendanceRecord>, records: AttendanceRecord[]): Promise<ApiResponse<AttendanceRecord | null>> {
    const existing = records.find((r) => r.id === id)
    if (!existing) return { data: null, success: false, message: 'Attendance record not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async markAttendance(id: string, attended: boolean, records: AttendanceRecord[]): Promise<ApiResponse<AttendanceRecord | null>> {
    const existing = records.find((r) => r.id === id)
    if (!existing) return { data: null, success: false, message: 'Attendance record not found' }
    const updated: AttendanceRecord = {
      ...existing,
      held: existing.held + 1,
      attended: attended ? existing.attended + 1 : existing.attended,
    }
    return mockApiCall(updated)
  },
}
