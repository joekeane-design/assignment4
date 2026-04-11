import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/expense';

@Component({
  standalone: true,
  selector: 'app-expense-list',
  imports: [CommonModule],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css'],
})
export class ExpenseList {
  readonly expenseService = inject(ExpenseService);
  readonly expenses = this.expenseService.expenses;

  trackById(index: number, expense: Expense) {
    return expense.id;
  }

  clickEdit(expense: Expense) {
    console.log('Edit clicked for', expense);
    // TODO: wire to a real edit form or route
  }

  clickDelete(expense: Expense) {
    this.expenseService.deleteExpense(expense);
  }
}
