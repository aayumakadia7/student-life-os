import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { AttendanceModule } from '../attendance/attendance.module'
import { ExpensesModule } from '../expenses/expenses.module'
import { StudyModule } from '../study/study.module'

@Module({
  imports: [AttendanceModule, ExpensesModule, StudyModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
