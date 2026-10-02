import { Expense } from '../types'
import { apiClient, mockApiCall, ApiResponse } from './api'

export const expensesService = {
  async getAll(fallbackExpenses: Expense[] = [], category?: string): Promise<ApiResponse<Expense[]>> {
    const endpoint = category ? `/expenses?category=${encodeURIComponent(category)}` : '/expenses'
    const res = await apiClient<Expense[]>(endpoint)
    if (res.success && Array.isArray(res.data)) {
      return res
    }
    return mockApiCall(fallbackExpenses)
  },

  async create(expense: Omit<Expense, 'id'>): Promise<ApiResponse<Expense>> {
    const res = await apiClient<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    })
    if (res.success && res.data) {
      return res
    }
    const newExpense: Expense = {
      ...expense,
      id: `exp_${Date.now()}`,
    }
    return mockApiCall(newExpense)
  },

  async update(
    id: string,
    updates: Partial<Expense>,
    expenses: Expense[] = []
  ): Promise<ApiResponse<Expense | null>> {
    const res = await apiClient<Expense>(`/expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    if (res.success && res.data) {
      return res
    }
    const existing = expenses.find((e) => e.id === id)
    if (!existing) return { data: null, success: false, message: 'Expense not found' }
    return mockApiCall({ ...existing, ...updates })
  },

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await apiClient<{ id: string }>(`/expenses/${id}`, {
      method: 'DELETE',
    })
    if (res.success) {
      return res
    }
    return mockApiCall({ id })
  },

  async getSummary(): Promise<ApiResponse<any>> {
    return apiClient('/expenses/summary')
  },

  async getCategorySummary(): Promise<ApiResponse<any>> {
    return apiClient('/expenses/category-summary')
  },
}
