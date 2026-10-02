import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { EXPENSE_CATEGORIES } from './create-expense.dto'

export class UpdateExpenseDto {
  @ApiPropertyOptional({ example: 'Algorithms Textbook (CLRS)' })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ example: 58.5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number

  @ApiPropertyOptional({ example: 'Education', enum: EXPENSE_CATEGORIES })
  @IsOptional()
  @IsIn(EXPENSE_CATEGORIES)
  category?: (typeof EXPENSE_CATEGORIES)[number]

  @ApiPropertyOptional({ example: '2026-10-01' })
  @IsString()
  @IsOptional()
  date?: string

  @ApiPropertyOptional({ example: 'Bought second hand' })
  @IsString()
  @IsOptional()
  notes?: string
}
