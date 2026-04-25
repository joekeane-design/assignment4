import { Injectable, computed, inject, signal } from '@angular/core';
import { Budget } from '../models/budget';
import { ExpenseService } from './expense-service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private expenseService = inject(ExpenseService);

  readonly budgets = signal<Budget[]>([]);

  // Current month as "YYYY-MM" — used as the default for all methods
  readonly currentMonth = new Date().toISOString().slice(0, 7);

  // Budgets allocated for the current month
  readonly currentMonthBudgets = computed(() =>
    this.budgets().filter((b) => b.month === this.currentMonth)
  );

  // Total dollars allocated across all categories this month
  readonly totalAllocated = computed(() =>
    this.currentMonthBudgets().reduce((sum, b) => sum + b.amount, 0)
  );

  // Categories from ExpenseService that don't yet have a budget this month
  readonly unbudgetedCategories = computed(() => {
    const budgeted = new Set(this.currentMonthBudgets().map((b) => b.categoryName));
    return this.expenseService.expenseCategories().filter((c) => !budgeted.has(c));
  });

  // Full summary: each budget entry enriched with how much was spent and what remains
  readonly budgetSummary = computed(() => {
    const [year, monthIndex] = this.currentMonth.split('-').map(Number);

    return this.currentMonthBudgets().map((budget) => {
      const spent = this.expenseService
        .expenses()
        .filter((e) => {
          const d = new Date(e.date);
          return (
            e.category === budget.categoryName &&
            e.type === 'Expense' &&
            d.getFullYear() === year &&
            d.getMonth() === monthIndex - 1
          );
        })
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        isOverBudget: spent > budget.amount,
      };
    });
  });

  // Total spent across all budgeted categories this month
  readonly totalSpent = computed(() =>
    this.budgetSummary().reduce((sum, b) => sum + b.spent, 0)
  );

  // Total remaining across all budgeted categories this month
  readonly totalRemaining = computed(() =>
    this.budgetSummary().reduce((sum, b) => sum + b.remaining, 0)
  );

  addBudget(categoryName: string, amount: number, month = this.currentMonth): void {
    const duplicate = this.budgets().find(
      (b) => b.categoryName === categoryName && b.month === month
    );
    if (duplicate) {
      throw new Error(`A budget for "${categoryName}" already exists for ${month}.`);
    }
    this.budgets.update((budgets) => [
      ...budgets,
      { id: this.generateId(), categoryName, amount, month },
    ]);
  }

  updateBudget(id: string, amount: number): void {
    this.budgets.update((budgets) =>
      budgets.map((b) => (b.id === id ? { ...b, amount } : b))
    );
  }

  deleteBudget(id: string): void {
    this.budgets.update((budgets) => budgets.filter((b) => b.id !== id));
  }

  getBudgetForCategory(category: string, month = this.currentMonth): Budget | undefined {
    return this.budgets().find(
      (b) => b.categoryName === category && b.month === month
    );
  }

  getRemainingForCategory(category: string, month = this.currentMonth): number {
    const summary = this.budgetSummary().find(
      (b) => b.categoryName === category && b.month === month
    );
    return summary?.remaining ?? 0;
  }

  private generateId(): string {
    return `budget_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}
