import { Component, inject } from '@angular/core';
import { ExpenseService } from '../../services/expense-service';
import { ExpenseItem } from '../expense-item/expense-item';

@Component({
  standalone: true,
  selector: 'app-expense-list',
  imports: [ExpenseItem],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css'],
})
export class ExpenseList {
  readonly expenseService = inject(ExpenseService);
  readonly expenses = this.expenseService.expenses;
}
