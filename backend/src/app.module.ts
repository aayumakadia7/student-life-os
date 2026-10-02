import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TasksModule } from './tasks/tasks.module'
import { TimetableModule } from './timetable/timetable.module'
import { AssignmentsModule } from './assignments/assignments.module'
import { AttendanceModule } from './attendance/attendance.module'
import { ExpensesModule } from './expenses/expenses.module'
import { ExamsModule } from './exams/exams.module'
import { StudyModule } from './study/study.module'
import { ResourcesModule } from './resources/resources.module'
import { PreferencesModule } from './preferences/preferences.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TasksModule,
    TimetableModule,
    AssignmentsModule,
    AttendanceModule,
    ExpensesModule,
    ExamsModule,
    StudyModule,
    ResourcesModule,
    PreferencesModule,
    DashboardModule,
    HealthModule,
  ],
})
export class AppModule {}
