import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 3000)
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:5173')

  // Global prefix: /api
  app.setGlobalPrefix('api')

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter())

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  // Configure CORS
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })

  // Configure Swagger OpenAPI documentation at /api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Student Life OS API')
    .setDescription(
      'Complete centralized backend REST API for Student Life OS college command center.\n' +
      'Provides persistent endpoints for tasks, timetable, assignments, attendance, expenses, exams, study, resources, preferences, and rule-based recommendations.'
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT access token (Bearer <token>)',
        in: 'header',
      },
      'bearer'
    )
    .addTag('Auth', 'Student authentication and token management')
    .addTag('Users', 'Student profile and account settings')
    .addTag('Tasks', 'Personal task management and status toggling')
    .addTag('Timetable', 'Course schedules and weekly lecture planner')
    .addTag('Assignments', 'Academic assignments and deadline tracking')
    .addTag('Attendance', 'Attendance compliance tracking and missable classes formula')
    .addTag('Expenses', 'Campus expenses and category analytics')
    .addTag('Exams', 'Upcoming exams and syllabus mastery countdowns')
    .addTag('Study', 'Syllabus mastery tracking and focus session logging')
    .addTag('Resources', 'Academic bookmarks, cheat sheets, and lecture notes')
    .addTag('Preferences', 'Student OS UI preferences and reminder alerts')
    .addTag('Dashboard', 'Command center dataset and "What Should I Do Now?" recommendations')
    .addTag('Health', 'Health status and PostgreSQL connection ping')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Student Life OS - API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(port)

  logger.log(`🚀 Student Life OS backend running on: http://localhost:${port}/api`)
  logger.log(`📖 Swagger API documentation available at: http://localhost:${port}/api/docs`)
  logger.log(`💓 Health check endpoint: http://localhost:${port}/api/health`)
  logger.log(`🌐 Allowed frontend origin: ${frontendUrl}`)
}

bootstrap()
