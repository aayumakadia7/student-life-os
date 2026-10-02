import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAttendanceDto } from './dto/create-attendance.dto'
import { UpdateAttendanceDto } from './dto/update-attendance.dto'

export interface AttendanceAnalytics {
  id: string
  subject: string
  code: string
  held: number
  attended: number
  targetPercentage: number
  currentPercentage: number
  status: 'compliant' | 'at_risk'
  missableClasses: number
  requiredClasses: number
}

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  calculateMetrics(record: {
    id: string
    subject: string
    code: string
    held: number
    attended: number
    targetPercentage: number
  }): AttendanceAnalytics {
    const held = record.held
    const attended = record.attended
    const target = record.targetPercentage

    const currentPercentage = held > 0 ? Number(((attended / held) * 100).toFixed(1)) : 100
    const isCompliant = currentPercentage >= target

    let missableClasses = 0
    let requiredClasses = 0

    if (isCompliant) {
      if (target > 0) {
        missableClasses = Math.max(0, Math.floor((attended * 100) / target - held))
      }
    } else {
      if (target < 100) {
        requiredClasses = Math.max(0, Math.ceil((target * held - 100 * attended) / (100 - target)))
      }
    }

    return {
      id: record.id,
      subject: record.subject,
      code: record.code,
      held,
      attended,
      targetPercentage: target,
      currentPercentage,
      status: isCompliant ? 'compliant' : 'at_risk',
      missableClasses,
      requiredClasses,
    }
  }

  async getAll(userId: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { userId },
      orderBy: { subject: 'asc' },
    })

    return records.map((r) => this.calculateMetrics(r))
  }

  async getById(userId: string, id: string) {
    const record = await this.prisma.attendanceRecord.findFirst({
      where: { id, userId },
    })

    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found.`)
    }

    return this.calculateMetrics(record)
  }

  async create(userId: string, dto: CreateAttendanceDto) {
    const record = await this.prisma.attendanceRecord.create({
      data: {
        userId,
        subject: dto.subject,
        code: dto.code,
        held: dto.held ?? 0,
        attended: dto.attended ?? 0,
        targetPercentage: dto.targetPercentage ?? 75,
      },
    })

    return this.calculateMetrics(record)
  }

  async update(userId: string, id: string, dto: UpdateAttendanceDto) {
    await this.getById(userId, id)

    const updated = await this.prisma.attendanceRecord.update({
      where: { id },
      data: {
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.held !== undefined && { held: dto.held }),
        ...(dto.attended !== undefined && { attended: dto.attended }),
        ...(dto.targetPercentage !== undefined && { targetPercentage: dto.targetPercentage }),
      },
    })

    return this.calculateMetrics(updated)
  }

  async markPresent(userId: string, id: string) {
    await this.getById(userId, id)

    const updated = await this.prisma.attendanceRecord.update({
      where: { id },
      data: {
        held: { increment: 1 },
        attended: { increment: 1 },
      },
    })

    return this.calculateMetrics(updated)
  }

  async markAbsent(userId: string, id: string) {
    await this.getById(userId, id)

    const updated = await this.prisma.attendanceRecord.update({
      where: { id },
      data: {
        held: { increment: 1 },
      },
    })

    return this.calculateMetrics(updated)
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)

    await this.prisma.attendanceRecord.delete({
      where: { id },
    })

    return { id, success: true, message: 'Attendance record deleted successfully.' }
  }

  async getSummary(userId: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { userId },
    })

    const totalHeld = records.reduce((sum, r) => sum + r.held, 0)
    const totalAttended = records.reduce((sum, r) => sum + r.attended, 0)
    const overallPercentage = totalHeld > 0 ? Number(((totalAttended / totalHeld) * 100).toFixed(1)) : 100

    const analyzedRecords = records.map((r) => this.calculateMetrics(r))
    const compliantSubjects = analyzedRecords.filter((r) => r.status === 'compliant').length
    const atRiskSubjects = analyzedRecords.filter((r) => r.status === 'at_risk').length

    return {
      totalHeld,
      totalAttended,
      overallPercentage,
      totalSubjects: records.length,
      compliantSubjects,
      atRiskSubjects,
      records: analyzedRecords,
    }
  }
}
