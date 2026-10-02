import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateAssignmentDto {
  @ApiPropertyOptional({ example: 'Balanced Binary Search Trees & AVL Rotations' })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ example: 'Data Structures' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: 'Implement self-balancing AVL tree insertion in C++.' })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: '2026-10-06' })
  @IsString()
  @IsOptional()
  dueDate?: string

  @ApiPropertyOptional({ example: 'high', enum: ['low', 'medium', 'high', 'urgent'] })
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent'

  @ApiPropertyOptional({
    example: 'completed',
    enum: ['not_started', 'in_progress', 'submitted', 'completed'],
  })
  @IsOptional()
  @IsIn(['not_started', 'in_progress', 'submitted', 'completed'])
  status?: 'not_started' | 'in_progress' | 'submitted' | 'completed'

  @ApiPropertyOptional({ example: 4.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  estimatedHours?: number
}
