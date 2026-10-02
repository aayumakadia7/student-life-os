import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { PrismaService } from '../prisma/prisma.service'

describe('AuthService', () => {
  let service: AuthService

  const mockUser = {
    id: 'user_1',
    name: 'Aayu Makadia',
    email: 'aayu@student.edu',
    passwordHash: '$2b$10$hashedpasswordstring',
    college: 'Engineering',
    course: 'CSE',
    semester: '5',
    avatarUrl: null,
    preferences: null,
  }

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  }

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('register', () => {
    it('should throw ConflictException if email is already in use', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser)

      await expect(
        service.register({
          name: 'Aayu',
          email: 'aayu@student.edu',
          password: 'password123',
        })
      ).rejects.toThrow(ConflictException)
    })

    it('should create user and return token and sanitized user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null)
      mockPrismaService.user.create.mockResolvedValueOnce(mockUser)

      const result = await service.register({
        name: 'Aayu Makadia',
        email: 'aayu@student.edu',
        password: 'password123',
      })

      expect(result.accessToken).toBe('mock-jwt-token')
      expect(result.user.email).toBe('aayu@student.edu')
      expect((result.user as any).passwordHash).toBeUndefined()
    })
  })

  describe('login', () => {
    it('should throw UnauthorizedException if email does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null)

      await expect(
        service.login({
          email: 'unknown@student.edu',
          password: 'password123',
        })
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if password does not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false) as any)

      await expect(
        service.login({
          email: 'aayu@student.edu',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should return token and safe user if credentials match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true) as any)

      const result = await service.login({
        email: 'aayu@student.edu',
        password: 'password123',
      })

      expect(result.accessToken).toBe('mock-jwt-token')
      expect(result.user.email).toBe('aayu@student.edu')
      expect((result.user as any).passwordHash).toBeUndefined()
    })
  })
})
