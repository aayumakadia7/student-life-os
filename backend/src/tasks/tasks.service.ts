import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string, status?: string, priority?: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(priority && { priority }),
      },
      orderBy: [
        { status: 'asc' },
        { deadline: 'asc' },
        { createdAt: 'desc' },
      ],
    })
  }

  async getById(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    })

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`)
    }

    return task
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        subject: dto.subject,
        priority: dto.priority,
        status: dto.status || 'todo',
        deadline: dto.deadline,
        estimatedMinutes: dto.estimatedMinutes,
        description: dto.description || null,
      },
    })
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.getById(userId, id) // verifies ownership

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.deadline !== undefined && { deadline: dto.deadline }),
        ...(dto.estimatedMinutes !== undefined && { estimatedMinutes: dto.estimatedMinutes }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    })
  }

  async updateStatus(userId: string, id: string, status: 'todo' | 'in_progress' | 'completed') {
    await this.getById(userId, id)

    return this.prisma.task.update({
      where: { id },
      data: { status },
    })
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)

    await this.prisma.task.delete({
      where: { id },
    })

    return { id, success: true, message: 'Task deleted successfully.' }
  }
}
