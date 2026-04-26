import { Injectable, computed, inject, signal } from '@angular/core';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { Budget } from '../models/budget';
import { ExpenseService } from './expense-service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private budgetsCollection = collection(db, 'budgets');
  private listId: string | null = null;
  private expenseService = inject(ExpenseService);

  readonly budgets = signal<Budget[]>([]);
  readonly currentMonth = new Date().toISOString().slice(0, 7);

  readonly currentMonthBudgets = computed(() =>
    this.budgets().filter((b) => b.month === this.currentMonth)
  );

  readonly totalAllocated = computed(() =>
    this.currentMonthBudgets().reduce((sum, b) => sum + b.amount, 0)
  );

  readonly unbudgetedCategories = computed(() => {
    const budgeted = new Set(this.currentMonthBudgets().map((b) => b.categoryName));
    return this.expenseService.expenseCategories().filter((c) => !budgeted.has(c));
  });

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
      return { ...budget, spent, remaining: budget.amount - spent, isOverBudget: spent > budget.amount };
    });
  });

  readonly totalSpent = computed(() =>
    this.budgetSummary().reduce((sum, b) => sum + b.spent, 0)
  );

  readonly totalRemaining = computed(() =>
    this.budgetSummary().reduce((sum, b) => sum + b.remaining, 0)
  );

  async loadBudgets(listId: string): Promise<void> {
    this.listId = listId;
    const snap = await getDoc(doc(this.budgetsCollection, listId));
    if (snap.exists()) {
      const data = snap.data() as { items: Budget[] };
      this.budgets.set(data.items ?? []);
    } else {
      await setDoc(doc(this.budgetsCollection, listId), { items: [] });
      this.budgets.set([]);
    }
  }

  clearBudgets(): void {
    this.listId = null;
    this.budgets.set([]);
  }

  private persist(): void {
    if (!this.listId) return;
    setDoc(doc(this.budgetsCollection, this.listId), { items: this.budgets() });
  }

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
    this.persist();
  }

  updateBudget(id: string, amount: number): void {
    this.budgets.update((budgets) =>
      budgets.map((b) => (b.id === id ? { ...b, amount } : b))
    );
    this.persist();
  }

  deleteBudget(id: string): void {
    this.budgets.update((budgets) => budgets.filter((b) => b.id !== id));
    this.persist();
  }

  getBudgetForCategory(category: string, month = this.currentMonth): Budget | undefined {
    return this.budgets().find((b) => b.categoryName === category && b.month === month);
  }

  getRemainingForCategory(category: string, month = this.currentMonth): number {
    return this.budgetSummary().find(
      (b) => b.categoryName === category && b.month === month
    )?.remaining ?? 0;
  }

  private generateId(): string {
    return `budget_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}
