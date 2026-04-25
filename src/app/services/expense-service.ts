import { Injectable, computed, signal } from '@angular/core';
import { Expense } from '../models/expense';
import { ExpenseCategory } from '../models/expense-category';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
   expenses = signal<Expense[]>([]);
   expenseCategories = signal<string[]>([
    'Work',
    'Travel',
    'Grocery',
    'Utilities',
    'Other',
  ]);
  expensetype = signal<string[]>([
    'Expense',
    'Income'
  ]);
   expenseCount = computed(() => this.expenses().length);

  addExpense(expense: Expense) {
    this.expenses.update((expenses) => {
      const newExpenses = [ ...expenses];
      newExpenses.push(expense);
      return newExpenses;

    });
  }

  deleteExpense(expenseToDelete: Expense) {
    this.expenses.update((expenses) =>
      expenses.filter((e) => e.id !== expenseToDelete.id)
    );
  }

  updateExpense(updated: Expense) {
    this.expenses.update((expenses) =>
      expenses.map((e) => (e.id === updated.id ? updated : e))
    );
  }

  getExpenseById(id: number): Expense | undefined {
    return this.expenses().find((e) => e.id === id);
  }

  addCategory(category: string) {
    const trimmed = category.trim();
    if (!trimmed) return;
    const exists = this.expenseCategories().some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      this.expenseCategories.update((cats) => [...cats, trimmed]);
    }
  }

  getExpenses(): Expense[] {
    return this.expenses();
  }

  transactionCount(): number {
    return this.expenses().length;
  }

  highestExpense() : number {
    if (this.expenses().length === 0) {
      return 0;
    }
    let highestExpense = 0;
      for (const expense of this.expenses()) {
      if(expense.amount > highestExpense) {
        highestExpense = expense.amount;
      }
    }
    return highestExpense;

  }

  averageExpense() : number {
    if (this.expenses().length === 0) {
      return 0;
    }

    let total = 0;
    for (const expense of this.expenses()) {
      total += expense.amount;
    }
    return total / this.expenses().length;
  }

  
}
