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
import { ResourcesService } from './resources.service'
import { CreateResourceDto, RESOURCE_TYPES } from './dto/create-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Resources')
@Controller('resources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all learning resources with optional type and subject filters' })
  @ApiQuery({ name: 'type', required: false, enum: RESOURCE_TYPES })
  @ApiQuery({ name: 'subject', required: false })
  @ApiResponse({ status: 200, description: 'List of resources' })
  getAll(
    @CurrentUser('userId') userId: string,
    @Query('type') type?: string,
    @Query('subject') subject?: string
  ) {
    return this.resourcesService.getAll(userId, type, subject)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  @ApiResponse({ status: 200, description: 'Resource details' })
  getById(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.resourcesService.getById(userId, id)
  }

  @Post()
  @ApiOperation({ summary: 'Bookmark a new academic resource' })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateResourceDto) {
    return this.resourcesService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a resource' })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto
  ) {
    return this.resourcesService.update(userId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bookmarked resource' })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.resourcesService.delete(userId, id)
  }
}
