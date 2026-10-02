import { IsBoolean, IsInt, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateStudySessionDto {
  @ApiPropertyOptional({ example: 'Data Structures' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: 'Graph Dijkstra & Prim algorithms' })
  @IsString()
  @IsOptional()
  topic?: string

  @ApiPropertyOptional({ example: '2026-10-02' })
  @IsString()
  @IsOptional()
  date?: string

  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  durationMinutes?: number

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
