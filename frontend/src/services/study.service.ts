import { Exam, StudyTopic, StudySession } from '../types'
import { apiClient, mockApiCall, ApiResponse } from './api'

export const studyService = {
  async getStudyData(data: { exams: Exam[]; topics: StudyTopic[]; sessions: StudySession[] }): Promise<
    ApiResponse<{ exams: Exam[]; topics: StudyTopic[]; sessions: StudySession[] }>
  > {
    const [examsRes, topicsRes, sessionsRes] = await Promise.all([
      apiClient<Exam[]>('/exams'),
      apiClient<StudyTopic[]>('/study/topics'),
      apiClient<StudySession[]>('/study/sessions'),
    ])

    if (examsRes.success && topicsRes.success && sessionsRes.success) {
      return {
        data: {
          exams: examsRes.data || data.exams,
          topics: topicsRes.data || data.topics,
          sessions: sessionsRes.data || data.sessions,
        },
        success: true,
      }
    }

    return mockApiCall(data)
  },

  async addSession(session: Omit<StudySession, 'id'>): Promise<ApiResponse<StudySession>> {
    const res = await apiClient<StudySession>('/study/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    })
    if (res.success && res.data) {
      return res
    }
    const newSession: StudySession = {
      ...session,
      id: `sess_${Date.now()}`,
    }
    return mockApiCall(newSession)
  },

  async updateTopicProgress(
    id: string,
    progress: number,
    topics: StudyTopic[] = []
  ): Promise<ApiResponse<StudyTopic | null>> {
    const res = await apiClient<StudyTopic>(`/study/topics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
    })
    if (res.success && res.data) {
      return res
    }
    const existing = topics.find((t) => t.id === id)
    if (!existing) return { data: null, success: false, message: 'Topic not found' }
    return mockApiCall({ ...existing, progress })
  },

  async addExam(exam: Omit<Exam, 'id'>): Promise<ApiResponse<Exam>> {
    const res = await apiClient<Exam>('/exams', {
      method: 'POST',
      body: JSON.stringify(exam),
    })
    return res
  },

  async deleteExam(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient<{ id: string }>(`/exams/${id}`, {
      method: 'DELETE',
    })
  },
}
