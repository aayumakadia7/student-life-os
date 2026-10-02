import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateExamDto {
  @ApiPropertyOptional({ example: 'Data Structures Midterm' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: '2026-10-16' })
  @IsString()
  @IsOptional()
  examDate?: string

  @ApiPropertyOptional({ example: '10:00 AM' })
  @IsString()
  @IsOptional()
  time?: string

  @ApiPropertyOptional({ example: 'Hall A - Desk 42' })
  @IsString()
  @IsOptional()
  room?: string

  @ApiPropertyOptional({ example: 'Updated syllabus details' })
  @IsString()
  @IsOptional()
  syllabus?: string
}
