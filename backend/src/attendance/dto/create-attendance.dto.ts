import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAttendanceDto {
  @ApiProperty({ example: 'Data Structures' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ example: 'CS301' })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsInt()
  @Min(0)
  held?: number

  @ApiPropertyOptional({ example: 33 })
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
