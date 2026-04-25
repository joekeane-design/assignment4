import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService } from '../services/budget-service';

@Component({
  selector: 'app-add-budget',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-budget.html',
  styleUrl: './add-budget.css',
})
export class AddBudget {
  private budgetService = inject(BudgetService);
  private router = inject(Router);

  readonly unbudgetedCategories = this.budgetService.unbudgetedCategories;

  category = '';
  amount = 0;
  errorMessage = '';

  onSubmit() {
    if (!this.category || !this.amount || this.amount <= 0) {
      this.errorMessage = 'Please select a category and enter a valid amount.';
      return;
    }
    try {
      this.budgetService.addBudget(this.category, this.amount);
      this.router.navigate(['/budget']);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to add budget.';
    }
  }
}
