import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { UserService } from '../../services/user-service';
import { BudgetService } from '../../services/budget-service';
import {
  ArcElement, BarController, BarElement, CategoryScale,
  Chart, Legend, LinearScale, PieController, Tooltip,
} from 'chart.js';

Chart.register(PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements AfterViewInit, OnDestroy {
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;

  private pieInstance: Chart<'pie'> | null = null;
  private barInstance: Chart<'bar'> | null = null;

  readonly expenseService = inject(ExpenseService);
  readonly budgetService = inject(BudgetService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly expenses = this.expenseService.expenses;
  readonly totalExpenses = this.expenseService.expenseCount;
  readonly transactionCount = computed(() => this.expenseService.transactionCount());
  readonly highestExpense = computed(() => this.expenseService.highestExpense());
  readonly averageExpense = computed(() => this.expenseService.averageExpense());

  readonly currentMonthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  readonly monthlySpending = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return this.expenses()
      .filter((e) => {
        const d = new Date(e.date);
        return e.type === 'Expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  });

  readonly categoryChartData = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const totals = new Map<string, number>();
    for (const e of this.expenses()) {
      const d = new Date(e.date);
      if (e.type === 'Expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
      }
    }
    return { labels: [...totals.keys()], data: [...totals.values()] };
  });

  readonly barChartData = computed(() => {
    const summary = this.budgetService.budgetSummary();
    return {
      labels: summary.map((b) => b.categoryName),
      budgeted: summary.map((b) => b.amount),
      spent: summary.map((b) => b.spent),
    };
  });

  private readonly PALETTE = [
    '#2563eb', '#16a34a', '#7c3aed', '#ea580c', '#64748b',
    '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444',
  ];

  constructor() {
    effect(() => {
      const { labels, data } = this.categoryChartData();
      if (this.pieInstance) {
        this.pieInstance.data.labels = labels;
        this.pieInstance.data.datasets[0].data = data;
        this.pieInstance.data.datasets[0].backgroundColor = labels.map((_, i) => this.PALETTE[i % this.PALETTE.length]);
        this.pieInstance.update();
      }
    });

    effect(() => {
      const { labels, budgeted, spent } = this.barChartData();
      if (this.barInstance) {
        this.barInstance.data.labels = labels;
        this.barInstance.data.datasets[0].data = budgeted;
        this.barInstance.data.datasets[1].data = spent;
        this.barInstance.update();
      }
    });
  }

  ngAfterViewInit() {
    const { labels, data } = this.categoryChartData();
    this.pieInstance = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: labels.map((_, i) => this.PALETTE[i % this.PALETTE.length]),
          borderWidth: 2,
          borderColor: '#ffffff',
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: $${(ctx.parsed as number).toFixed(2)}`,
            },
          },
        },
      },
    });

    const bar = this.barChartData();
    this.barInstance = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: bar.labels,
        datasets: [
          {
            label: 'Budget',
            data: bar.budgeted,
            backgroundColor: '#cbd5e1',
            borderRadius: 6,
          },
          {
            label: 'Spent',
            data: bar.spent,
            backgroundColor: '#2563eb',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toFixed(2)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (val) => `$${val}` },
            grid: { color: '#f1f5f9' },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }

  ngOnDestroy() {
    this.pieInstance?.destroy();
    this.barInstance?.destroy();
  }
}
