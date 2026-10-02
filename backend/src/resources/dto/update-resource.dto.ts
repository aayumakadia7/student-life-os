import { ArrayNotEmpty, IsArray, IsIn, IsOptional, IsString, IsUrl } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { RESOURCE_TYPES } from './create-resource.dto'

export class UpdateResourceDto {
  @ApiPropertyOptional({ example: 'MIT 6.006 Introduction to Algorithms Notes' })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ example: 'Data Structures' })
  @IsString()
  @IsOptional()
  subject?: string

  @ApiPropertyOptional({ example: 'PDF', enum: RESOURCE_TYPES })
  @IsOptional()
  @IsIn(RESOURCE_TYPES)
  type?: (typeof RESOURCE_TYPES)[number]

  @ApiPropertyOptional({ example: 'https://ocw.mit.edu/courses/6-006' })
  @IsOptional()
  @IsUrl()
  url?: string

  @ApiPropertyOptional({ example: 'Comprehensive MIT lecture notes and problem sets.' })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: ['MIT', 'Lecture Notes', 'PDF'] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[]
}
