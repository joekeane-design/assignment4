import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { UserService } from '../../services/user-service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard  {
  readonly expenseService = inject(ExpenseService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly expenses = this.expenseService.expenses;
  readonly totalExpenses = this.expenseService.expenseCount;
  readonly transactionCount = computed(() => this.expenseService.transactionCount());
  readonly highestExpense = computed(() => this.expenseService.highestExpense());
  readonly averageExpense = computed(() => this.expenseService.averageExpense());

  // ngOnInit() {
  //   if (!this.userService.getCurrentUser()) {
  //     this.router.navigate(['/login']);
  //   }
  // }
}
