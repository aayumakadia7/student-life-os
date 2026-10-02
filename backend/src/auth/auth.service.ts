import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    })

    if (existing) {
      throw new ConflictException('A student account with this email already exists.')
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(dto.password, saltRounds)

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        college: dto.college || '',
        course: dto.course || '',
        semester: dto.semester || '',
        avatarUrl: dto.avatarUrl,
        preferences: {
          create: {
            theme: 'dark',
            attendanceTarget: 75,
            currency: 'USD',
            timeFormat: '12h',
            assignmentReminders: true,
            taskReminders: true,
            attendanceAlerts: true,
            studyReminders: false,
          },
        },
      },
      include: {
        preferences: true,
      },
    })

    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: this.sanitizeUser(user),
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        preferences: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: this.sanitizeUser(user),
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    })

    // Return friendly generic message for security
    return {
      success: true,
      message: user
        ? `Password reset instructions have been dispatched to ${dto.email}.`
        : 'If that email address exists in our database, we will send a password reset link.',
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User profile not found.')
    }

    return this.sanitizeUser(user)
  }

  public sanitizeUser(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user
    return safeUser
  }
}
