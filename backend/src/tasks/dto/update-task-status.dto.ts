import { IsIn, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateTaskStatusDto {
  @ApiProperty({ example: 'completed', enum: ['todo', 'in_progress', 'completed'] })
  @IsNotEmpty()
  @IsIn(['todo', 'in_progress', 'completed'])
  status: 'todo' | 'in_progress' | 'completed'
}
