import { IsIn, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export class CreateTimetableDto {
  @ApiProperty({ example: 'Data Structures' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiPropertyOptional({ example: 'CS301' })
  @IsString()
  @IsOptional()
  code?: string

  @ApiProperty({ example: 'Dr. Sarah Vance' })
  @IsString()
  @IsNotEmpty()
  teacher: string

  @ApiProperty({ example: 'Room 204' })
  @IsString()
  @IsNotEmpty()
  room: string

  @ApiProperty({ example: 'Monday', enum: DAYS_OF_WEEK })
  @IsIn(DAYS_OF_WEEK)
  day: (typeof DAYS_OF_WEEK)[number]

  @ApiProperty({ example: '09:00', description: 'HH:mm format' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format' })
  startTime: string

  @ApiProperty({ example: '10:00', description: 'HH:mm format' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:mm format' })
  endTime: string

  @ApiPropertyOptional({ example: 'indigo' })
  @IsString()
  @IsOptional()
  color?: string
}
