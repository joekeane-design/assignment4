import { Injectable, computed, signal } from '@angular/core';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesCollection = collection(db, 'expenses');
  private listId: string | null = null;

  expenses = signal<Expense[]>([]);
  expenseCategories = signal<string[]>([
    'Work',
    'Travel',
    'Grocery',
    'Utilities',
    'Other',
  ]);
  expensetype = signal<string[]>(['Expense', 'Income']);
  expenseCount = computed(() => this.expenses().length);

  async loadExpenses(listId: string): Promise<void> {
    this.listId = listId;
    const snap = await getDoc(doc(this.expensesCollection, listId));
    if (snap.exists()) {
      const data = snap.data() as { items: any[] };
      const loaded = (data.items ?? []).map((e) => ({
        ...e,
        date: new Date(e.date),
      })) as Expense[];
      this.expenses.set(loaded);
    } else {
      await setDoc(doc(this.expensesCollection, listId), { items: [] });
      this.expenses.set([]);
    }
  }

  clearExpenses(): void {
    this.listId = null;
    this.expenses.set([]);
  }

  private persist(): void {
    if (!this.listId) return;
    const items = this.expenses().map((e) => ({
      ...e,
      date: e.date instanceof Date ? e.date.toISOString() : e.date,
    }));
    setDoc(doc(this.expensesCollection, this.listId), { items });
  }

  addExpense(expense: Expense): void {
    this.expenses.update((list) => [...list, expense]);
    this.persist();
  }

  deleteExpense(expenseToDelete: Expense): void {
    this.expenses.update((list) => list.filter((e) => e.id !== expenseToDelete.id));
    this.persist();
  }

  updateExpense(updated: Expense): void {
    this.expenses.update((list) => list.map((e) => (e.id === updated.id ? updated : e)));
    this.persist();
  }

  getExpenseById(id: number): Expense | undefined {
    return this.expenses().find((e) => e.id === id);
  }

  addCategory(category: string): void {
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

  highestExpense(): number {
    if (this.expenses().length === 0) return 0;
    return Math.max(...this.expenses().map((e) => e.amount));
  }

  averageExpense(): number {
    if (this.expenses().length === 0) return 0;
    const total = this.expenses().reduce((sum, e) => sum + e.amount, 0);
    return total / this.expenses().length;
  }
}
