import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../services/budget-service';

@Component({
  selector: 'app-edit-budget',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-budget.html',
  styleUrl: './edit-budget.css',
})
export class EditBudget implements OnInit {
  private budgetService = inject(BudgetService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  budgetId = '';
  categoryName = '';
  amount = 0;
  errorMessage = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const budget = this.budgetService.budgets().find((b) => b.id === id);
    if (budget) {
      this.budgetId = id;
      this.categoryName = budget.categoryName;
      this.amount = budget.amount;
    } else {
      this.router.navigate(['/budget']);
    }
  }

  onSubmit() {
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount.';
      return;
    }
    this.budgetService.updateBudget(this.budgetId, this.amount);
    this.router.navigate(['/budget']);
  }

  onCancel() {
    this.router.navigate(['/budget']);
  }
}
