import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense-service';
import { ExpenseItem } from '../expense-item/expense-item';
import { Expense } from '../../models/expense';

@Component({
  standalone: true,
  selector: 'app-expense-list',
  imports: [CommonModule, FormsModule, ExpenseItem],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css'],
})
export class ExpenseList {
  readonly expenseService = inject(ExpenseService);

  showFilters = false;
  filterCategory = '';
  filterStartDate = '';
  filterEndDate = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  get hasActiveFilters(): boolean {
    return !!(
      this.filterCategory ||
      this.filterStartDate ||
      this.filterEndDate ||
      this.minAmount !== null ||
      this.maxAmount !== null
    );
  }

  get filteredExpenses(): Expense[] {
    return this.expenseService.expenses().filter((e) => {
      if (this.filterCategory && e.category !== this.filterCategory) return false;

      const expDate = new Date(e.date);
      if (this.filterStartDate && expDate < new Date(this.filterStartDate)) return false;
      if (this.filterEndDate) {
        const end = new Date(this.filterEndDate);
        end.setHours(23, 59, 59, 999);
        if (expDate > end) return false;
      }

      if (this.minAmount !== null && e.amount < this.minAmount) return false;
      if (this.maxAmount !== null && e.amount > this.maxAmount) return false;

      return true;
    });
  }

  clearFilters() {
    this.filterCategory = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.minAmount = null;
    this.maxAmount = null;
  }
}
