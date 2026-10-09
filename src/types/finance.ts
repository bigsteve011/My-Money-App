export type CurrencyCode = 'PLN' | 'EUR' | 'USD' | 'GBP' | 'NGN' | 'ZAR';

export interface FXRate {
  pair: string; // e.g. "EUR/PLN"
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  source: string;
  updatedAt: string;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'wallet';

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  currency: CurrencyCode;
  openingBalanceMinor: number; // In minor units (cents, grosze, kobo)
  isShared: boolean; // true = household visible, false = private
  ownerId: string;
  color: string;
  accountNumberMasked?: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer' | 'refund';

export type CategoryId =
  | 'housing'
  | 'groceries'
  | 'utilities'
  | 'dining'
  | 'transport'
  | 'health'
  | 'entertainment'
  | 'family_support'
  | 'software'
  | 'income_salary'
  | 'income_freelance'
  | 'savings_transfer'
  | 'other';

export interface Transaction {
  id: string;
  accountId: string;
  date: string; // YYYY-MM-DD
  payee: string;
  category: CategoryId;
  type: TransactionType;
  amountMinor: number; // positive = inflow, negative = outflow
  originalCurrency: CurrencyCode;
  exchangeRateToBase?: number;
  notes?: string;
  isShared: boolean;
  transferAccountId?: string;
  transferLinkId?: string;
  splitWith?: string; // member id
  splitPercent?: number; // e.g. 50
  isSettled?: boolean;
}

export interface Budget {
  id: string;
  category: CategoryId;
  limitMinor: number; // in base currency
  period: 'monthly' | 'yearly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetMinor: number;
  allocatedMinor: number;
  targetCurrency: CurrencyCode;
  targetDate: string;
  category: string;
  linkedAccountId?: string;
  icon?: string;
}

export interface RecurringBill {
  id: string;
  name: string;
  amountMinor: number;
  currency: CurrencyCode;
  frequency: 'monthly' | 'yearly' | 'weekly';
  dueDay: number; // 1-31
  category: CategoryId;
  accountId: string;
  status: 'paid' | 'upcoming' | 'overdue';
  nextDueDate: string;
  isShared: boolean;
  autoDeduct: boolean;
}

export interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'partner' | 'member';
  avatarInitials: string;
  color: string;
}

export interface Household {
  id: string;
  name: string;
  members: HouseholdMember[];
  currency: CurrencyCode;
}

export type VisibilityMode = 'all' | 'shared_only' | 'private_only';

export interface CashFlowDay {
  date: string;
  dayOfMonth: number;
  projectedBalanceMinor: number;
  inflowsMinor: number;
  outflowsMinor: number;
  events: Array<{
    title: string;
    amountMinor: number;
    type: 'income' | 'bill' | 'discretionary';
  }>;
}
