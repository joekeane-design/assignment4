import { ExpenseCategory } from './expense-category';
import { TransactionType } from './transaction-type';
export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  type: TransactionType;
  notes?: string;
  date?: Date;
}
