import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ExpensesService } from './expenses.service'
import { CreateExpenseDto, EXPENSE_CATEGORIES } from './dto/create-expense.dto'
import { UpdateExpenseDto } from './dto/update-expense.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all logged student expenses with optional category and date filtering' })
  @ApiQuery({ name: 'category', required: false, enum: EXPENSE_CATEGORIES })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'List of expenses' })
  getAll(
    @CurrentUser('userId') userId: string,
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.expensesService.getAll(userId, category, startDate, endDate)
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get total and monthly expense summary metrics' })
  @ApiResponse({ status: 200, description: 'Expense financial summary' })
  getSummary(@CurrentUser('userId') userId: string) {
    return this.expensesService.getSummary(userId)
  }

  @Get('category-summary')
  @ApiOperation({ summary: 'Get category distribution for charts' })
  @ApiResponse({ status: 200, description: 'Category totals and percentages' })
  getCategorySummary(@CurrentUser('userId') userId: string) {
    return this.expensesService.getCategorySummary(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense details' })
  getById(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.expensesService.getById(userId, id)
  }

  @Post()
  @ApiOperation({ summary: 'Log a new student expense' })
  @ApiResponse({ status: 201, description: 'Expense logged successfully' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(userId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing expense' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto
  ) {
    return this.expensesService.update(userId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense log' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.expensesService.delete(userId, id)
  }
}
