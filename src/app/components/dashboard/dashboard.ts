import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense-service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  readonly expenseService = inject(ExpenseService);

  readonly expenses = this.expenseService.expenses;
  readonly totalExpenses = this.expenseService.expenseCount;
  readonly transactionCount = computed(() => this.expenseService.transactionCount());
  readonly highestExpense = computed(() => this.expenseService.highestExpense());
  readonly averageExpense = computed(() => this.expenseService.averageExpense());
}
