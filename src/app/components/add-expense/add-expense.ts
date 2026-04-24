import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Expense } from '../../models/expense';
import { ExpenseCategory } from '../../models/expense-category';
import { ExpenseService } from '../../services/expense-service';
import { TransactionType } from '../../models/transaction-type';
@Component({
  standalone: true,
  selector: 'app-add-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense {
  expenseService = inject(ExpenseService);

  get expenses() {
    return this.expenseService.expenses();
  }

  title = signal<string>('');
  amount = signal<number>(0);
  category = signal<ExpenseCategory>('Work');
  type = signal<TransactionType>('Expense');
  date = signal<Date>(new Date());
  notes = signal<string>('');
  onSubmit() {
    if (!this.title() || !this.amount() || !this.category()) {
      alert('Please fill in all fields');
      return;
    }

    const newExpense: Expense = {
      id: this.expenses.length,
      title: this.title(),
      amount: this.amount(),
      category: this.category() as ExpenseCategory,
      type: this.type() as TransactionType,
      notes: this.notes(),
    };

    this.expenseService.addExpense(newExpense);
    this.title.set('');
    this.amount.set(0);
    this.category.set('Work');
    this.type.set('Expense');
  }
}
