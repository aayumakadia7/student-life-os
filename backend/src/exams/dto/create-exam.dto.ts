import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateExamDto {
  @ApiProperty({ example: 'Data Structures Midterm' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ example: '2026-10-16', description: 'YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  examDate: string

  @ApiPropertyOptional({ example: '10:00 AM' })
  @IsString()
  @IsOptional()
  time?: string

  @ApiPropertyOptional({ example: 'Hall A - Desk 42' })
  @IsString()
  @IsOptional()
  room?: string

  @ApiProperty({ example: 'Arrays, Linked Lists, Stacks, Queues, Binary Search Trees.' })
  @IsString()
  @IsNotEmpty()
  syllabus: string
}
