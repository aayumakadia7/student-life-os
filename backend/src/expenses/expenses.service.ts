import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExpenseDto } from './dto/create-expense.dto'
import { UpdateExpenseDto } from './dto/update-expense.dto'

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string, category?: string, startDate?: string, endDate?: string) {
    return this.prisma.expense.findMany({
      where: {
        userId,
        ...(category && { category }),
        ...(startDate && endDate
          ? { date: { gte: startDate, lte: endDate } }
          : startDate
          ? { date: { gte: startDate } }
          : endDate
          ? { date: { lte: endDate } }
          : {}),
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async getById(userId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    })

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found.`)
    }

    return expense
  }

  async create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        title: dto.title,
        amount: dto.amount,
        category: dto.category,
        date: dto.date,
        notes: dto.notes || null,
      },
    })
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.getById(userId, id)

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    })
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)

    await this.prisma.expense.delete({
      where: { id },
    })

    return { id, success: true, message: 'Expense deleted successfully.' }
  }

  async getSummary(userId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { userId },
    })

    const totalSpent = Number(expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2))

    // Current month calculation
    const now = new Date()
    const currentMonthPrefix = now.toISOString().slice(0, 7) // YYYY-MM
    const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonthPrefix))
    const monthlySpent = Number(monthlyExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2))

    const dayOfMonth = Math.max(1, now.getDate())
    const dailyAverage = Number((monthlySpent / dayOfMonth).toFixed(2))

    return {
      totalSpent,
      monthlySpent,
      dailyAverage,
      totalCount: expenses.length,
      monthlyCount: monthlyExpenses.length,
    }
  }

  async getCategorySummary(userId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { userId },
    })

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
    const categoryMap: Record<string, { total: number; count: number }> = {}

    for (const exp of expenses) {
      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = { total: 0, count: 0 }
      }
      categoryMap[exp.category].total += exp.amount
      categoryMap[exp.category].count += 1
    }

    return Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      total: Number(stats.total.toFixed(2)),
      count: stats.count,
      percentage: totalSpent > 0 ? Number(((stats.total / totalSpent) * 100).toFixed(1)) : 0,
    }))
  }
}
