import { ExpenseCategory } from './expense-category';
export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
}
