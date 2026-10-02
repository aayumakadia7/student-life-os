import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Aayu Makadia' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ example: 'Institute of Technology & Engineering' })
  @IsString()
  @IsOptional()
  college?: string

  @ApiPropertyOptional({ example: 'Computer Science & Engineering' })
  @IsString()
  @IsOptional()
  course?: string

  @ApiPropertyOptional({ example: 'Semester 5' })
  @IsString()
  @IsOptional()
  semester?: string

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' })
  @IsString()
  @IsOptional()
  avatarUrl?: string
}
