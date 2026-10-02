import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Balanced Binary Search Trees & AVL Rotations' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'Data Structures' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ example: 'Implement self-balancing AVL tree insertion in C++.' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: '2026-10-06' })
  @IsString()
  @IsNotEmpty()
  dueDate: string

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high', 'urgent'] })
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority: 'low' | 'medium' | 'high' | 'urgent'

  @ApiPropertyOptional({
    example: 'in_progress',
    enum: ['not_started', 'in_progress', 'submitted', 'completed'],
  })
  @IsOptional()
  @IsIn(['not_started', 'in_progress', 'submitted', 'completed'])
  status?: 'not_started' | 'in_progress' | 'submitted' | 'completed'

  @ApiProperty({ example: 4.0 })
  @IsNumber()
  @IsPositive()
  estimatedHours: number
}
