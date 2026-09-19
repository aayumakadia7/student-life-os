import { Exam, StudyTopic, StudySession } from '../types'
import { mockApiCall, ApiResponse } from './api'

export const studyService = {
  async getStudyData(data: { exams: Exam[]; topics: StudyTopic[]; sessions: StudySession[] }): Promise<
    ApiResponse<{ exams: Exam[]; topics: StudyTopic[]; sessions: StudySession[] }>
  > {
    return mockApiCall(data)
  },

  async addSession(session: Omit<StudySession, 'id'>): Promise<ApiResponse<StudySession>> {
    const newSession: StudySession = {
      ...session,
      id: `sess_${Date.now()}`,
    }
    return mockApiCall(newSession)
  },

  async updateTopicProgress(id: string, progress: number, topics: StudyTopic[]): Promise<ApiResponse<StudyTopic | null>> {
    const existing = topics.find((t) => t.id === id)
    if (!existing) return { data: null, success: false, message: 'Topic not found' }
    return mockApiCall({ ...existing, progress })
  },
}
