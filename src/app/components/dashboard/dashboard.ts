import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { UserService } from '../../services/user-service';
import { ArcElement, Chart, Legend, PieController, Tooltip } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements AfterViewInit, OnDestroy {
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart<'pie'> | null = null;

  readonly expenseService = inject(ExpenseService);
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
        return (
          e.type === 'Expense' &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
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
      if (
        e.type === 'Expense' &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      ) {
        totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
      }
    }

    return {
      labels: [...totals.keys()],
      data: [...totals.values()],
    };
  });

  private readonly PALETTE = [
    '#2563eb', '#16a34a', '#7c3aed', '#ea580c', '#64748b',
    '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444',
  ];

  constructor() {
    effect(() => {
      const { labels, data } = this.categoryChartData();
      if (this.chartInstance) {
        this.chartInstance.data.labels = labels;
        this.chartInstance.data.datasets[0].data = data;
        this.chartInstance.data.datasets[0].backgroundColor = labels.map(
          (_, i) => this.PALETTE[i % this.PALETTE.length]
        );
        this.chartInstance.update();
      }
    });
  }

  ngAfterViewInit() {
    const { labels, data } = this.categoryChartData();
    this.chartInstance = new Chart(this.pieChartRef.nativeElement, {
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
  }

  ngOnDestroy() {
    this.chartInstance?.destroy();
  }
}
