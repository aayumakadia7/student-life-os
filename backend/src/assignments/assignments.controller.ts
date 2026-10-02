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
import { AssignmentsService } from './assignments.service'
import { CreateAssignmentDto } from './dto/create-assignment.dto'
import { UpdateAssignmentDto } from './dto/update-assignment.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assignments for student with optional status filter' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['not_started', 'in_progress', 'submitted', 'completed'],
  })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  getAll(@CurrentUser('userId') userId: string, @Query('status') status?: string) {
    return this.assignmentsService.getAll(userId, status)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment details returned' })
  getById(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.assignmentsService.getById(userId, id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAssignmentDto
  ) {
    return this.assignmentsService.update(userId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.assignmentsService.delete(userId, id)
  }
}
