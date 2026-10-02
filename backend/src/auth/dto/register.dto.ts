import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'Aayu Makadia' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'aayu@student.edu' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string

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
