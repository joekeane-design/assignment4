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
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Protected — must be logged in
  { path: 'dashboard',        component: Dashboard,    canActivate: [authGuard] },
  { path: 'add-expense',      component: AddExpense,   canActivate: [authGuard] },
  { path: 'expenses',         component: ExpenseList,  canActivate: [authGuard] },
  { path: 'edit-expense/:id', component: EditExpense,  canActivate: [authGuard] },
  { path: 'budget',           component: ViewBudget,   canActivate: [authGuard] },
  { path: 'add-budget',       component: AddBudget,    canActivate: [authGuard] },
  { path: 'edit-budget/:id',  component: EditBudget,   canActivate: [authGuard] },

  // Public — redirect to dashboard if already logged in
  { path: 'login',        component: Login,         canActivate: [publicGuard] },
  { path: 'registration', component: Registration,  canActivate: [publicGuard] },

  { path: '**', redirectTo: 'login' },
];
