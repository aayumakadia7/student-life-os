import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdatePreferencesDto } from './dto/update-preferences.dto'

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  private formatPreferences(prefs: any) {
    return {
      theme: prefs.theme,
      attendanceTarget: prefs.attendanceTarget,
      currency: prefs.currency,
      timeFormat: prefs.timeFormat,
      notifications: {
        assignmentReminders: prefs.assignmentReminders,
        taskReminders: prefs.taskReminders,
        attendanceAlerts: prefs.attendanceAlerts,
        studyReminders: prefs.studyReminders,
      },
    }
  }

  async getPreferences(userId: string) {
    let prefs = await this.prisma.userPreferences.findUnique({
      where: { userId },
    })

    if (!prefs) {
      prefs = await this.prisma.userPreferences.create({
        data: {
          userId,
          theme: 'dark',
          attendanceTarget: 75,
          currency: 'USD',
          timeFormat: '12h',
          assignmentReminders: true,
          taskReminders: true,
          attendanceAlerts: true,
          studyReminders: false,
        },
      })
    }

    return this.formatPreferences(prefs)
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    // Ensure record exists
    await this.getPreferences(userId)

    const updated = await this.prisma.userPreferences.update({
      where: { userId },
      data: {
        ...(dto.theme !== undefined && { theme: dto.theme }),
        ...(dto.attendanceTarget !== undefined && { attendanceTarget: dto.attendanceTarget }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.timeFormat !== undefined && { timeFormat: dto.timeFormat }),
        ...(dto.notifications?.assignmentReminders !== undefined && {
          assignmentReminders: dto.notifications.assignmentReminders,
        }),
        ...(dto.notifications?.taskReminders !== undefined && {
          taskReminders: dto.notifications.taskReminders,
        }),
        ...(dto.notifications?.attendanceAlerts !== undefined && {
          attendanceAlerts: dto.notifications.attendanceAlerts,
        }),
        ...(dto.notifications?.studyReminders !== undefined && {
          studyReminders: dto.notifications.studyReminders,
        }),
      },
    })

    return this.formatPreferences(updated)
  }
}
