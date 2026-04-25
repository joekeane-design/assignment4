import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { AddExpense } from './components/add-expense/add-expense';
import { ExpenseList } from './components/expense-list/expense-list';
import { EditExpense } from './components/edit-expense/edit-expense';
import { Login } from './components/login/login';
import { Registration } from './components/registration/registration';
import { AddBudget } from './add-budget/add-budget';
import { ViewBudget } from './view-budget/view-budget';
import { EditBudget } from './edit-budget/edit-budget';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'add-expense', component: AddExpense },
  { path: 'expenses', component: ExpenseList },
  { path: 'edit-expense/:id', component: EditExpense },
  { path: 'budget', component: ViewBudget },
  { path: 'add-budget', component: AddBudget },
  { path: 'edit-budget/:id', component: EditBudget },
  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  { path: '**', redirectTo: 'dashboard' },
];
