import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExamDto } from './dto/create-exam.dto'
import { UpdateExamDto } from './dto/update-exam.dto'

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.exam.findMany({
      where: { userId },
      orderBy: { examDate: 'asc' },
    })
  }

  async getById(userId: string, id: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, userId },
    })

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found.`)
    }

    return exam
  }

  async create(userId: string, dto: CreateExamDto) {
    return this.prisma.exam.create({
      data: {
        userId,
        subject: dto.subject,
        examDate: dto.examDate,
        time: dto.time || null,
        room: dto.room || null,
        syllabus: dto.syllabus,
      },
    })
  }

  async update(userId: string, id: string, dto: UpdateExamDto) {
    await this.getById(userId, id)

    return this.prisma.exam.update({
      where: { id },
      data: {
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.examDate !== undefined && { examDate: dto.examDate }),
        ...(dto.time !== undefined && { time: dto.time }),
        ...(dto.room !== undefined && { room: dto.room }),
        ...(dto.syllabus !== undefined && { syllabus: dto.syllabus }),
      },
    })
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)

    await this.prisma.exam.delete({
      where: { id },
    })

    return { id, success: true, message: 'Exam deleted successfully.' }
  }
}
