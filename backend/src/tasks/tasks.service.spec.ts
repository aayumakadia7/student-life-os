import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { PrismaService } from '../prisma/prisma.service'

describe('TasksService', () => {
  let service: TasksService

  const mockTask = {
    id: 'task_1',
    userId: 'user_1',
    title: 'Test Task',
    subject: 'Math',
    priority: 'high',
    status: 'todo',
    deadline: '2026-10-05',
    estimatedMinutes: 30,
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockPrismaService = {
    task: {
      findMany: jest.fn().mockResolvedValue([mockTask]),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'task_1' && where.userId === 'user_1') {
          return Promise.resolve(mockTask)
        }
        return Promise.resolve(null)
      }),
      create: jest.fn().mockResolvedValue(mockTask),
      update: jest.fn().mockResolvedValue({ ...mockTask, status: 'completed' }),
      delete: jest.fn().mockResolvedValue(mockTask),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<TasksService>(TasksService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get all tasks for the authenticated user', async () => {
    const tasks = await service.getAll('user_1')
    expect(tasks).toEqual([mockTask])
    expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ userId: 'user_1' }) })
    )
  })

  it('should throw NotFoundException if task does not belong to user', async () => {
    await expect(service.getById('other_user', 'task_1')).rejects.toThrow(NotFoundException)
  })

  it('should update task status', async () => {
    const updated = await service.updateStatus('user_1', 'task_1', 'completed')
    expect(updated.status).toBe('completed')
  })
})
