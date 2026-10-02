import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AttendanceService } from './attendance.service'
import { CreateAttendanceDto } from './dto/create-attendance.dto'
import { UpdateAttendanceDto } from './dto/update-attendance.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all attendance records with live metrics' })
  @ApiResponse({ status: 200, description: 'List of attendance records with compliance metrics' })
  getAll(@CurrentUser('userId') userId: string) {
    return this.attendanceService.getAll(userId)
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get aggregated attendance compliance summary' })
  @ApiResponse({ status: 200, description: 'Overall compliance and subject health breakdown' })
  getSummary(@CurrentUser('userId') userId: string) {
    return this.attendanceService.getSummary(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific attendance record by ID' })
  @ApiResponse({ status: 200, description: 'Attendance record details' })
  getById(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.attendanceService.getById(userId, id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course attendance tracker' })
  @ApiResponse({ status: 201, description: 'Attendance record created' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance record fields' })
  @ApiResponse({ status: 200, description: 'Attendance record updated' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAttendanceDto
  ) {
    return this.attendanceService.update(userId, id, dto)
  }

  @Post(':id/present')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark student present for a lecture (increments held and attended)' })
  @ApiResponse({ status: 200, description: 'Lecture logged as present' })
  markPresent(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.attendanceService.markPresent(userId, id)
  }

  @Post(':id/absent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark student absent for a lecture (increments held only)' })
  @ApiResponse({ status: 200, description: 'Lecture logged as absent' })
  markAbsent(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.attendanceService.markAbsent(userId, id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attendance tracker for course' })
  @ApiResponse({ status: 200, description: 'Attendance record deleted' })
  delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.attendanceService.delete(userId, id)
  }
}
