import { Component, Input, inject } from '@angular/core';
import { Expense } from '../../models/expense';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.html',
  styleUrls: ['./expense-item.css'],
})
export class ExpenseItem {
  @Input() expense!: Expense;
  expenseService = inject(ExpenseService);

  onEditClick() {
    // implement edit flow when needed
  }

  onDeleteClick() {
    if (this.expense) {
      this.expenseService.deleteExpense(this.expense);
    }
  }
}
