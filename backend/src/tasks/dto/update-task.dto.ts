import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Complete Linked List Assignment' })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ example: 'Data Structures' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: 'high', enum: ['low', 'medium', 'high', 'urgent'] })
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent'

  @ApiPropertyOptional({ example: 'completed', enum: ['todo', 'in_progress', 'completed'] })
  @IsOptional()
  @IsIn(['todo', 'in_progress', 'completed'])
  status?: 'todo' | 'in_progress' | 'completed'

  @ApiPropertyOptional({ example: '2026-10-04' })
  @IsString()
  @IsOptional()
  deadline?: string

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  estimatedMinutes?: number

  @ApiPropertyOptional({ example: 'Updated notes on implementation' })
  @IsString()
  @IsOptional()
  description?: string
}
