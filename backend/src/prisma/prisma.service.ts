import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)
  private isConnected = false

  async onModuleInit() {
    try {
      await this.$connect()
      this.isConnected = true
      this.logger.log('✅ Connected to PostgreSQL database successfully.')
    } catch (error) {
      this.isConnected = false
      this.logger.warn(
        '⚠️ Could not connect to PostgreSQL database. Please verify DATABASE_URL in .env and that PostgreSQL is running.\n' +
        `Error details: ${error instanceof Error ? error.message : error}`
      )
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect()
    }
  }

  get isDbConnected(): boolean {
    return this.isConnected
  }
}
