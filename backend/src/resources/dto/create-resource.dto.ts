import { ArrayNotEmpty, IsArray, IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export const RESOURCE_TYPES = ['PDF', 'Website', 'YouTube', 'GitHub', 'Notes', 'Other'] as const

export class CreateResourceDto {
  @ApiProperty({ example: 'MIT 6.006 Introduction to Algorithms Notes' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'Data Structures' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ example: 'PDF', enum: RESOURCE_TYPES })
  @IsIn(RESOURCE_TYPES)
  type: (typeof RESOURCE_TYPES)[number]

  @ApiProperty({ example: 'https://ocw.mit.edu/courses/6-006' })
  @IsUrl()
  url: string

  @ApiProperty({ example: 'Comprehensive MIT lecture notes and problem sets.' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: ['MIT', 'Lecture Notes', 'PDF'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[]
}
