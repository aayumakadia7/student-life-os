import { Test, TestingModule } from '@nestjs/testing'
import { AttendanceService } from './attendance.service'
import { PrismaService } from '../prisma/prisma.service'

describe('AttendanceService', () => {
  let service: AttendanceService

  const mockPrismaService = {
    attendanceRecord: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<AttendanceService>(AttendanceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('calculateMetrics', () => {
    it('should correctly calculate compliant attendance and missable classes', () => {
      // 33 attended out of 40 held with 75% target:
      // (33 / 40) = 82.5% -> compliant
      // Can miss: Math.floor((33 * 100) / 75 - 40) = Math.floor(44 - 40) = 4 classes
      const result = service.calculateMetrics({
        id: 'rec_1',
        subject: 'Data Structures',
        code: 'CS301',
        held: 40,
        attended: 33,
        targetPercentage: 75,
      })

      expect(result.currentPercentage).toBe(82.5)
      expect(result.status).toBe('compliant')
      expect(result.missableClasses).toBe(4)
      expect(result.requiredClasses).toBe(0)
    })

    it('should correctly calculate at-risk attendance and required classes to recover', () => {
      // 21 attended out of 30 held with 75% target:
      // (21 / 30) = 70.0% -> at_risk
      // Need: Math.ceil((75 * 30 - 100 * 21) / (100 - 75)) = Math.ceil((2250 - 2100) / 25) = 150 / 25 = 6 classes
      const result = service.calculateMetrics({
        id: 'rec_2',
        subject: 'Database Systems',
        code: 'CS304',
        held: 30,
        attended: 21,
        targetPercentage: 75,
      })

      expect(result.currentPercentage).toBe(70)
      expect(result.status).toBe('at_risk')
      expect(result.missableClasses).toBe(0)
      expect(result.requiredClasses).toBe(6)
    })
  })
})
