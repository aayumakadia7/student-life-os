import { Expense } from '../types'
import { mockApiCall, ApiResponse } from './api'

export const expensesService = {
  async getAll(expenses: Expense[]): Promise<ApiResponse<Expense[]>> {
    return mockApiCall(expenses)
  },

  async create(expense: Omit<Expense, 'id'>): Promise<ApiResponse<Expense>> {
    const newExpense: Expense = {
      ...expense,
      id: `exp_${Date.now()}`,
    }
    return mockApiCall(newExpense)
  },

  async update(id: string, updates: Partial<Expense>, expenses: Expense[]): Promise<ApiResponse<Expense | null>> {
    const existing = expenses.find((e) => e.id === id)
    if (!existing) return { data: null, success: false, message: 'Expense not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return mockApiCall({ id })
  },
}
