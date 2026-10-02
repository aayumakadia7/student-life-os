import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateResourceDto } from './dto/create-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string, type?: string, subject?: string) {
    return this.prisma.resource.findMany({
      where: {
        userId,
        ...(type && { type }),
        ...(subject && { subject }),
      },
      orderBy: [{ subject: 'asc' }, { title: 'asc' }],
    })
  }

  async getById(userId: string, id: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, userId },
    })

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found.`)
    }

    return resource
  }

  async create(userId: string, dto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: {
        userId,
        title: dto.title,
        subject: dto.subject,
        type: dto.type,
        url: dto.url,
        description: dto.description,
        tags: dto.tags,
      },
    })
  }

  async update(userId: string, id: string, dto: UpdateResourceDto) {
    await this.getById(userId, id)

    return this.prisma.resource.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.url !== undefined && { url: dto.url }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
      },
    })
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)

    await this.prisma.resource.delete({
      where: { id },
    })

    return { id, success: true, message: 'Resource deleted successfully.' }
  }
}
