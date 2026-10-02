import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateStudyTopicDto } from './dto/create-study-topic.dto'
import { UpdateStudyTopicDto } from './dto/update-study-topic.dto'
import { CreateStudySessionDto } from './dto/create-study-session.dto'
import { UpdateStudySessionDto } from './dto/update-study-session.dto'

@Injectable()
export class StudyService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Topic Operations ---
  async getTopics(userId: string) {
    return this.prisma.studyTopic.findMany({
      where: { userId },
      orderBy: [{ subject: 'asc' }, { progress: 'asc' }],
    })
  }

  async getTopicById(userId: string, id: string) {
    const topic = await this.prisma.studyTopic.findFirst({
      where: { id, userId },
    })

    if (!topic) {
      throw new NotFoundException(`Study topic with ID ${id} not found.`)
    }

    return topic
  }

  async createTopic(userId: string, dto: CreateStudyTopicDto) {
    return this.prisma.studyTopic.create({
      data: {
        userId,
        subject: dto.subject,
        topic: dto.topic,
        difficulty: dto.difficulty || 'medium',
        progress: dto.progress !== undefined ? Math.min(100, Math.max(0, dto.progress)) : 0,
      },
    })
  }

  async updateTopic(userId: string, id: string, dto: UpdateStudyTopicDto) {
    await this.getTopicById(userId, id)

    return this.prisma.studyTopic.update({
      where: { id },
      data: {
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.topic !== undefined && { topic: dto.topic }),
        ...(dto.difficulty !== undefined && { difficulty: dto.difficulty }),
        ...(dto.progress !== undefined && {
          progress: Math.min(100, Math.max(0, dto.progress)),
        }),
      },
    })
  }

  async deleteTopic(userId: string, id: string) {
    await this.getTopicById(userId, id)

    await this.prisma.studyTopic.delete({
      where: { id },
    })

    return { id, success: true, message: 'Study topic deleted successfully.' }
  }

  // --- Session Operations ---
  async getSessions(userId: string) {
    return this.prisma.studySession.findMany({
      where: { userId },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async getSessionById(userId: string, id: string) {
    const session = await this.prisma.studySession.findFirst({
      where: { id, userId },
    })

    if (!session) {
      throw new NotFoundException(`Study session with ID ${id} not found.`)
    }

    return session
  }

  async createSession(userId: string, dto: CreateStudySessionDto) {
    return this.prisma.studySession.create({
      data: {
        userId,
        subject: dto.subject,
        topic: dto.topic,
        date: dto.date,
        durationMinutes: dto.durationMinutes,
        completed: dto.completed ?? true,
      },
    })
  }

  async updateSession(userId: string, id: string, dto: UpdateStudySessionDto) {
    await this.getSessionById(userId, id)

    return this.prisma.studySession.update({
      where: { id },
      data: {
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.topic !== undefined && { topic: dto.topic }),
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.durationMinutes !== undefined && { durationMinutes: dto.durationMinutes }),
        ...(dto.completed !== undefined && { completed: dto.completed }),
      },
    })
  }

  async deleteSession(userId: string, id: string) {
    await this.getSessionById(userId, id)

    await this.prisma.studySession.delete({
      where: { id },
    })

    return { id, success: true, message: 'Study session deleted successfully.' }
  }

  // --- Study Summary ---
  async getSummary(userId: string) {
    const [topics, sessions] = await Promise.all([
      this.prisma.studyTopic.findMany({ where: { userId } }),
      this.prisma.studySession.findMany({ where: { userId } }),
    ])

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
    const totalHours = Number((totalMinutes / 60).toFixed(1))

    const avgProgress =
      topics.length > 0
        ? Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length)
        : 0

    const completedTopics = topics.filter((t) => t.progress === 100).length

    // Last 7 days study minutes
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
    const recentSessions = sessions.filter((s) => s.date >= sevenDaysAgo)
    const weeklyMinutes = recentSessions.reduce((sum, s) => sum + s.durationMinutes, 0)

    return {
      totalStudyMinutes: totalMinutes,
      totalStudyHours: totalHours,
      totalSessions: sessions.length,
      averageTopicProgress: avgProgress,
      totalTopics: topics.length,
      completedTopics,
      weeklyMinutes,
      weeklyHours: Number((weeklyMinutes / 60).toFixed(1)),
    }
  }
}
