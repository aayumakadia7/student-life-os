import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ExamsService } from './exams.service'
import { CreateExamDto } from './dto/create-exam.dto'
import { UpdateExamDto } from './dto/update-exam.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Exams')
@Controller('exams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all scheduled exams for current student' })
  @ApiResponse({ status: 200, description: 'List of exams returned' })
  getAll(@CurrentUser('userId') userId: string) {
    return this.examsService.getAll(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiResponse({ status: 200, description: 'Exam details returned' })
  getById(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.examsService.getById(userId, id)
  }

  @Post()
  @ApiOperation({ summary: 'Schedule a new exam' })
  @ApiResponse({ status: 201, description: 'Exam scheduled successfully' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateExamDto) {
    return this.examsService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exam schedule or syllabus' })
  @ApiResponse({ status: 200, description: 'Exam updated successfully' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateExamDto
  ) {
    return this.examsService.update(userId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an exam' })
  @ApiResponse({ status: 200, description: 'Exam deleted successfully' })
  delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.examsService.delete(userId, id)
  }
}
