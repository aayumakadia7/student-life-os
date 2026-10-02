import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete Linked List Assignment' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'Data Structures' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high', 'urgent'] })
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority: 'low' | 'medium' | 'high' | 'urgent'

  @ApiPropertyOptional({ example: 'todo', enum: ['todo', 'in_progress', 'completed'] })
  @IsOptional()
  @IsIn(['todo', 'in_progress', 'completed'])
  status?: 'todo' | 'in_progress' | 'completed'

  @ApiProperty({ example: '2026-10-04', description: 'YYYY-MM-DD format or ISO string' })
  @IsString()
  @IsNotEmpty()
  deadline: string

  @ApiProperty({ example: 60, description: 'Estimated minutes for completion' })
  @IsInt()
  @IsPositive()
  estimatedMinutes: number

  @ApiPropertyOptional({ example: 'Implement doubly linked list operations' })
  @IsString()
  @IsOptional()
  description?: string
}
