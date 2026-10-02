import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'System health check and database connectivity status' })
  @ApiResponse({ status: 200, description: 'Health check response' })
  async check() {
    let databaseStatus = 'disconnected'

    try {
      // Fast ping check
      await this.prisma.$queryRaw`SELECT 1`
      databaseStatus = 'connected'
    } catch {
      databaseStatus = 'disconnected'
    }

    return {
      status: 'ok',
      service: 'student-life-os-backend',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      uptime: process.uptime(),
    }
  }
}
