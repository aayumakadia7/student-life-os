import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Shopping',
  'Entertainment',
  'Health',
  'Other',
] as const

export class CreateExpenseDto {
  @ApiProperty({ example: 'Algorithms Textbook (CLRS)' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 58.5 })
  @IsNumber()
  @IsPositive()
  amount: number

  @ApiProperty({ example: 'Education', enum: EXPENSE_CATEGORIES })
  @IsIn(EXPENSE_CATEGORIES)
  category: (typeof EXPENSE_CATEGORIES)[number]

  @ApiProperty({ example: '2026-10-01', description: 'YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  date: string

  @ApiPropertyOptional({ example: 'Bought second hand from senior student' })
  @IsString()
  @IsOptional()
  notes?: string
}
