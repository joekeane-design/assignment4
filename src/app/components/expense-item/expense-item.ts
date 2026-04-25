import { Component, Input, inject, computed } from '@angular/core';
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

  readonly categoryColor = computed(() => {
    switch (this.expense.category) {
      case 'Work':       return '#2563eb';
      case 'Grocery':    return '#16a34a';
      case 'Travel':     return '#7c3aed';
      case 'Utilities':  return '#ea580c';
      case 'Other':      return '#64748b';
      default:           return '#94a3b8';
    }
  });


  onEditClick(expense: Expense) {
    this.router.navigate(['edit-expense', expense.id]);
  }

  onDeleteClick() {
    if (this.expense) {
      this.expenseService.deleteExpense(this.expense);
    }
  }
}
