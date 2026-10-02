import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current student user profile' })
  @ApiResponse({ status: 200, description: 'Student profile returned' })
  getProfile(@CurrentUser('userId') userId: string) {
    return this.usersService.getProfile(userId)
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current student user profile' })
  @ApiResponse({ status: 200, description: 'Student profile updated' })
  updateProfile(@CurrentUser('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, dto)
  }
}
