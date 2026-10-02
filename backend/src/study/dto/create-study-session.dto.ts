import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateStudySessionDto {
  @ApiProperty({ example: 'Data Structures' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ example: 'Graph Dijkstra & Prim algorithms' })
  @IsString()
  @IsNotEmpty()
  topic: string

  @ApiProperty({ example: '2026-10-02', description: 'YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  date: string

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  @IsPositive()
  durationMinutes: number

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
