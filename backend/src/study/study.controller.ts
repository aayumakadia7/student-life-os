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
import { StudyService } from './study.service'
import { CreateStudyTopicDto } from './dto/create-study-topic.dto'
import { UpdateStudyTopicDto } from './dto/update-study-topic.dto'
import { CreateStudySessionDto } from './dto/create-study-session.dto'
import { UpdateStudySessionDto } from './dto/update-study-session.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Study')
@Controller('study')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  // --- Topics ---
  @Get('topics')
  @ApiOperation({ summary: 'Get all study syllabus topics with mastery progress' })
  @ApiResponse({ status: 200, description: 'List of study topics' })
  getTopics(@CurrentUser('userId') userId: string) {
    return this.studyService.getTopics(userId)
  }

  @Post('topics')
  @ApiOperation({ summary: 'Add a new syllabus study topic' })
  @ApiResponse({ status: 201, description: 'Study topic created' })
  createTopic(@CurrentUser('userId') userId: string, @Body() dto: CreateStudyTopicDto) {
    return this.studyService.createTopic(userId, dto)
  }

  @Patch('topics/:id')
  @ApiOperation({ summary: 'Update topic progress or details' })
  @ApiResponse({ status: 200, description: 'Topic updated' })
  updateTopic(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStudyTopicDto
  ) {
    return this.studyService.updateTopic(userId, id, dto)
  }

  @Delete('topics/:id')
  @ApiOperation({ summary: 'Delete a syllabus topic' })
  @ApiResponse({ status: 200, description: 'Topic deleted' })
  deleteTopic(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.studyService.deleteTopic(userId, id)
  }

  // --- Sessions ---
  @Get('sessions')
  @ApiOperation({ summary: 'Get focus study session history' })
  @ApiResponse({ status: 200, description: 'List of logged study sessions' })
  getSessions(@CurrentUser('userId') userId: string) {
    return this.studyService.getSessions(userId)
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Log a completed focus study session' })
  @ApiResponse({ status: 201, description: 'Study session logged' })
  createSession(@CurrentUser('userId') userId: string, @Body() dto: CreateStudySessionDto) {
    return this.studyService.createSession(userId, dto)
  }

  @Patch('sessions/:id')
  @ApiOperation({ summary: 'Update study session details' })
  @ApiResponse({ status: 200, description: 'Study session updated' })
  updateSession(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStudySessionDto
  ) {
    return this.studyService.updateSession(userId, id, dto)
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Delete a logged study session' })
  @ApiResponse({ status: 200, description: 'Study session deleted' })
  deleteSession(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.studyService.deleteSession(userId, id)
  }

  // --- Summary ---
  @Get('summary')
  @ApiOperation({ summary: 'Get overall study and focus metrics summary' })
  @ApiResponse({ status: 200, description: 'Study statistics and progress overview' })
  getSummary(@CurrentUser('userId') userId: string) {
    return this.studyService.getSummary(userId)
  }
}
