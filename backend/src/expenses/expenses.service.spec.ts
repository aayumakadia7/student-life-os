import { Test, TestingModule } from '@nestjs/testing'
import { ExpensesService } from './expenses.service'
import { PrismaService } from '../prisma/prisma.service'

describe('ExpensesService', () => {
  let service: ExpensesService

  const mockExpenses = [
    { id: 'exp_1', userId: 'user_1', title: 'Textbook', amount: 50, category: 'Education', date: '2026-10-01' },
    { id: 'exp_2', userId: 'user_1', title: 'Lunch', amount: 15, category: 'Food', date: '2026-10-02' },
    { id: 'exp_3', userId: 'user_1', title: 'Dinner', amount: 35, category: 'Food', date: '2026-10-02' },
  ]

  const mockPrismaService = {
    expense: {
      findMany: jest.fn().mockResolvedValue(mockExpenses),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<ExpensesService>(ExpensesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getCategorySummary', () => {
    it('should aggregate expenses by category with correct percentages', async () => {
      const summary = await service.getCategorySummary('user_1')

      expect(summary).toHaveLength(2)

      const foodSummary = summary.find((s) => s.category === 'Food')
      const eduSummary = summary.find((s) => s.category === 'Education')

      expect(foodSummary).toBeDefined()
      expect(foodSummary?.total).toBe(50)
      expect(foodSummary?.count).toBe(2)
      expect(foodSummary?.percentage).toBe(50)

      expect(eduSummary).toBeDefined()
      expect(eduSummary?.total).toBe(50)
      expect(eduSummary?.count).toBe(1)
      expect(eduSummary?.percentage).toBe(50)
    })
  })
})
