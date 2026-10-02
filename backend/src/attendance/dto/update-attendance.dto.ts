import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ example: 'Data Structures' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: 'CS301' })
  @IsString()
  @IsOptional()
  code?: string

  @ApiPropertyOptional({ example: 42 })
  @IsOptional()
  @IsInt()
  @Min(0)
  held?: number

  @ApiPropertyOptional({ example: 35 })
  @IsOptional()
  @IsInt()
  @Min(0)
  attended?: number

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(95)
  targetPercentage?: number
}
