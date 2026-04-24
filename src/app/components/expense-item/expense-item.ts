import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Expense } from '../../models/expense';
import { ExpenseService } from '../../services/expense-service';

@Component({
  standalone: true,
  selector: 'app-expense-item',
  imports: [CommonModule],
  templateUrl: './expense-item.html',
  styleUrls: ['./expense-item.css'],
})
export class ExpenseItem {
  @Input() expense!: Expense;
  expenseService = inject(ExpenseService);
  private readonly router = inject(Router);

  onEditClick(expense: Expense) {
    this.router.navigate(['edit-expense', expense.id]);
  }

  onDeleteClick() {
    if (this.expense) {
      this.expenseService.deleteExpense(this.expense);
    }
  }
}
