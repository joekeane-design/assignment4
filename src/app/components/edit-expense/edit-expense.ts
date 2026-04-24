import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/expense';
import { ExpenseCategory } from '../../models/expense-category';
import { TransactionType } from '../../models/transaction-type';

@Component({
  standalone: true,
  selector: 'app-edit-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-expense.html',
  styleUrls: ['./edit-expense.css'],
})
export class EditExpense implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  expenseService = inject(ExpenseService);

  expenseId = 0;
  title = '';
  amount = 0;
  category: ExpenseCategory = 'Work';
  type: TransactionType = 'Expense';
  notes = "";
  date: Date = new Date();

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const expense = this.expenseService.getExpenseById(id);
    if (expense) {
      this.expenseId = expense.id;
      this.title = expense.title;
      this.amount = expense.amount;
      this.category = expense.category;
      this.type = expense.type;
      this.notes = expense.notes ?? '';
      this.date = expense.date ?? new Date();
    } else {
      this.router.navigate(['expenses']);
    }
  }

  onSubmit() {
    if (!this.title || !this.amount || !this.category || !this.type) {
      alert('Please fill in all fields');
      return;
    }
    const updated: Expense = {
      id: this.expenseId,
      title: this.title,
      amount: this.amount,
      category: this.category,
      type: this.type,
      notes: this.notes,
    };
    this.expenseService.updateExpense(updated);
    this.router.navigate(['expenses']);
  }

  onCancel() {
    this.router.navigate(['expenses']);
  }
}
