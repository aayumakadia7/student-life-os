import { IsIn, IsOptional, IsString, Matches } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { DAYS_OF_WEEK } from './create-timetable.dto'

export class UpdateTimetableDto {
  @ApiPropertyOptional({ example: 'Data Structures' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: 'CS301' })
  @IsString()
  @IsOptional()
  code?: string

  @ApiPropertyOptional({ example: 'Dr. Sarah Vance' })
  @IsString()
  @IsOptional()
  teacher?: string

  @ApiPropertyOptional({ example: 'Room 204' })
  @IsString()
  @IsOptional()
  room?: string

  @ApiPropertyOptional({ example: 'Monday', enum: DAYS_OF_WEEK })
  @IsOptional()
  @IsIn(DAYS_OF_WEEK)
  day?: (typeof DAYS_OF_WEEK)[number]

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format' })
  startTime?: string

  @ApiPropertyOptional({ example: '10:00' })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:mm format' })
  endTime?: string

  @ApiPropertyOptional({ example: 'indigo' })
  @IsString()
  @IsOptional()
  color?: string
}
