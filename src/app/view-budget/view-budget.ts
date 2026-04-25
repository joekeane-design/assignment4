import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BudgetService } from '../services/budget-service';

@Component({
  selector: 'app-view-budget',
  imports: [CommonModule, RouterLink],
  templateUrl: './view-budget.html',
  styleUrl: './view-budget.css',
})
export class ViewBudget {
  readonly budgetService = inject(BudgetService);
  private readonly router = inject(Router);

  readonly summary = this.budgetService.budgetSummary;
  readonly totalAllocated = this.budgetService.totalAllocated;
  readonly totalSpent = this.budgetService.totalSpent;
  readonly totalRemaining = this.budgetService.totalRemaining;
  readonly currentMonth = this.budgetService.currentMonth;

  getPercentage(spent: number, amount: number): number {
    if (amount === 0) return 0;
    return Math.min((spent / amount) * 100, 100);
  }

  deleteBudget(id: string | undefined) {
    if (id) this.budgetService.deleteBudget(id);
  }

  editBudget(id: string | undefined) {
    if (id) this.router.navigate(['/edit-budget', id]);
  }
}
