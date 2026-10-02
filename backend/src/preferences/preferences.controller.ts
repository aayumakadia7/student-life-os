import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PreferencesService } from './preferences.service'
import { UpdatePreferencesDto } from './dto/update-preferences.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Preferences')
@Controller('preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get current student user preferences and settings' })
  @ApiResponse({ status: 200, description: 'User preferences' })
  getPreferences(@CurrentUser('userId') userId: string) {
    return this.preferencesService.getPreferences(userId)
  }

  @Patch()
  @ApiOperation({ summary: 'Update student preferences (theme, currency, notification alerts)' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  updatePreferences(@CurrentUser('userId') userId: string, @Body() dto: UpdatePreferencesDto) {
    return this.preferencesService.updatePreferences(userId, dto)
  }
}
