import { Test, TestingModule } from '@nestjs/testing'
import { DashboardService } from './dashboard.service'
import { PrismaService } from '../prisma/prisma.service'
import { AttendanceService } from '../attendance/attendance.service'
import { ExpensesService } from '../expenses/expenses.service'
import { StudyService } from '../study/study.service'

describe('DashboardService', () => {
  let service: DashboardService

  const mockTasks = [
    {
      id: 'task_1',
      userId: 'user_1',
      title: 'Urgent Task',
      subject: 'Data Structures',
      priority: 'urgent',
      status: 'todo',
      deadline: new Date().toISOString().split('T')[0],
      estimatedMinutes: 45,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task_2',
      userId: 'user_1',
      title: 'Low Priority Task',
      subject: 'Economics',
      priority: 'low',
      status: 'todo',
      deadline: '2099-01-01',
      estimatedMinutes: 30,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockTimetable: any[] = []
  const mockExams: any[] = []

  const mockPrismaService = {
    task: {
      findMany: jest.fn().mockResolvedValue(mockTasks),
    },
    timetableEntry: {
      findMany: jest.fn().mockResolvedValue(mockTimetable),
    },
    exam: {
      findMany: jest.fn().mockResolvedValue(mockExams),
    },
    assignment: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    expense: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  }

  const mockAttendanceService = {
    getSummary: jest.fn().mockResolvedValue({ overallPercentage: 80 }),
  }

  const mockExpensesService = {
    getSummary: jest.fn().mockResolvedValue({ monthlySpent: 120 }),
  }

  const mockStudyService = {
    getSummary: jest.fn().mockResolvedValue({ weeklyHours: 8 }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AttendanceService, useValue: mockAttendanceService },
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: StudyService, useValue: mockStudyService },
      ],
    }).compile()

    service = module.get<DashboardService>(DashboardService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getRecommendations', () => {
    it('should recommend highest-priority urgent task due today with explainable reasons', async () => {
      const rec = await service.getRecommendations('user_1')

      expect(rec).toBeDefined()
      expect(rec?.taskId).toBe('task_1')
      expect(rec?.title).toBe('Urgent Task')
      expect(rec?.reasons).toContain('Due today or overdue')
      expect(rec?.reasons).toContain('Urgent priority')
    })
  })
})
