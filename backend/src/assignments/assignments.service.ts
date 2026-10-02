import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAssignmentDto } from './dto/create-assignment.dto'
import { UpdateAssignmentDto } from './dto/update-assignment.dto'

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string, status?: string) {
    return this.prisma.assignment.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: [
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })
  }

  async getById(userId: string, id: string) {
    const assignment = await this.prisma.assignment.findFirst({
      where: { id, userId },
    })

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found.`)
    }

    return assignment
  }

  async create(userId: string, dto: CreateAssignmentDto) {
    return this.prisma.assignment.create({
      data: {
        userId,
        title: dto.title,
        subject: dto.subject,
        description: dto.description,
        dueDate: dto.dueDate,
        priority: dto.priority,
        status: dto.status || 'not_started',
        estimatedHours: dto.estimatedHours,
      },
    })
  }

  async update(userId: string, id: string, dto: UpdateAssignmentDto) {
    await this.getById(userId, id)

    return this.prisma.assignment.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.estimatedHours !== undefined && { estimatedHours: dto.estimatedHours }),
      },
    })
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)

    await this.prisma.assignment.delete({
      where: { id },
    })

    return { id, success: true, message: 'Assignment deleted successfully.' }
  }
}
