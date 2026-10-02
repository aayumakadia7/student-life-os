import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTimetableDto } from './dto/create-timetable.dto'
import { UpdateTimetableDto } from './dto/update-timetable.dto'

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string, day?: string) {
    return this.prisma.timetableEntry.findMany({
      where: {
        userId,
        ...(day && { day }),
      },
      orderBy: [
        { startTime: 'asc' },
      ],
    })
  }

  async getById(userId: string, id: string) {
    const entry = await this.prisma.timetableEntry.findFirst({
      where: { id, userId },
    })

    if (!entry) {
      throw new NotFoundException(`Timetable class entry with ID ${id} not found.`)
    }

    return entry
  }

  async create(userId: string, dto: CreateTimetableDto) {
    return this.prisma.timetableEntry.create({
      data: {
        userId,
        subject: dto.subject,
        code: dto.code || null,
        teacher: dto.teacher,
        room: dto.room,
        day: dto.day,
        startTime: dto.startTime,
        endTime: dto.endTime,
        color: dto.color || 'indigo',
      },
    })
  }

  async update(userId: string, id: string, dto: UpdateTimetableDto) {
    await this.getById(userId, id)

    return this.prisma.timetableEntry.update({
      where: { id },
      data: {
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.teacher !== undefined && { teacher: dto.teacher }),
        ...(dto.room !== undefined && { room: dto.room }),
        ...(dto.day !== undefined && { day: dto.day }),
        ...(dto.startTime !== undefined && { startTime: dto.startTime }),
        ...(dto.endTime !== undefined && { endTime: dto.endTime }),
        ...(dto.color !== undefined && { color: dto.color }),
      },
    })
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)

    await this.prisma.timetableEntry.delete({
      where: { id },
    })

    return { id, success: true, message: 'Class deleted from timetable.' }
  }
}
