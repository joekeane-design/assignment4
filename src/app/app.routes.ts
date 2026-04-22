import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { AddExpense } from './components/add-expense/add-expense';
import { ExpenseList } from './components/expense-list/expense-list';
import { Login } from './components/login/login';
import { Registration } from './components/registration/registration';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'add-expense', component: AddExpense },
  { path: 'expenses', component: ExpenseList },
  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  { path: '**', redirectTo: 'dashboard' },
];
