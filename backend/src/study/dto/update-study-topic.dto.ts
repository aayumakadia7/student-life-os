import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateStudyTopicDto {
  @ApiPropertyOptional({ example: 'Data Structures' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: 'AVL Tree Rotations' })
  @IsString()
  @IsOptional()
  topic?: string

  @ApiPropertyOptional({ example: 'hard', enum: ['easy', 'medium', 'hard'] })
  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard'

  @ApiPropertyOptional({ example: 80, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number
}
