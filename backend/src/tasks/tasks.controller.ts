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
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks for current student with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['todo', 'in_progress', 'completed'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high', 'urgent'] })
  @ApiResponse({ status: 200, description: 'List of tasks returned' })
  getAll(
    @CurrentUser('userId') userId: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string
  ) {
    return this.tasksService.getAll(userId, status, priority)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task details returned' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getById(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.getById(userId, id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.update(userId, id, dto)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update only task status' })
  @ApiResponse({ status: 200, description: 'Task status updated' })
  updateStatus(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto
  ) {
    return this.tasksService.updateStatus(userId, id, dto.status)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.delete(userId, id)
  }
}
