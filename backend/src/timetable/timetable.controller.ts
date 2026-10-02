import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { TimetableService } from './timetable.service'
import { CreateTimetableDto, DAYS_OF_WEEK } from './dto/create-timetable.dto'
import { UpdateTimetableDto } from './dto/update-timetable.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Timetable')
@Controller('timetable')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  @ApiOperation({ summary: 'Get timetable classes for student, optionally filtered by day' })
  @ApiQuery({ name: 'day', required: false, enum: DAYS_OF_WEEK })
  @ApiResponse({ status: 200, description: 'List of scheduled classes' })
  getAll(@CurrentUser('userId') userId: string, @Query('day') day?: string) {
    return this.timetableService.getAll(userId, day)
  }

  @Post()
  @ApiOperation({ summary: 'Add a new class to timetable' })
  @ApiResponse({ status: 201, description: 'Class scheduled successfully' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateTimetableDto) {
    return this.timetableService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing timetable class' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTimetableDto
  ) {
    return this.timetableService.update(userId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a class from timetable' })
  @ApiResponse({ status: 200, description: 'Class removed successfully' })
  delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.timetableService.delete(userId, id)
  }
}
