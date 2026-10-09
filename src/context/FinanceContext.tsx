import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Account,
  Transaction,
  Budget,
  SavingsGoal,
  RecurringBill,
  Household,
  CurrencyCode,
  VisibilityMode,
} from '../types/finance';
import {
  SEED_ACCOUNTS,
  SEED_TRANSACTIONS,
  SEED_BUDGETS,
  SEED_SAVINGS_GOALS,
  SEED_RECURRING_BILLS,
  SEED_HOUSEHOLD,
} from '../data/seedData';
import { DEFAULT_RATES_PER_EUR, verifyTransferInvariants } from '../utils/accounting';

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  recurringBills: RecurringBill[];
  household: Household;
  baseCurrency: CurrencyCode;
  visibilityMode: VisibilityMode;
  ratesPerEur: Record<CurrencyCode, number>;
  currentView: 'landing' | 'app';
  activeTab: 'dashboard' | 'ledger' | 'forecast' | 'budgets' | 'household' | 'dossier';
  activeMemberId: string;

  // Actions
  setBaseCurrency: (c: CurrencyCode) => void;
  setVisibilityMode: (v: VisibilityMode) => void;
  setCurrentView: (v: 'landing' | 'app') => void;
  setActiveTab: (tab: 'dashboard' | 'ledger' | 'forecast' | 'budgets' | 'household' | 'dossier') => void;
  setActiveMemberId: (id: string) => void;

  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  recordTransfer: (
    fromAccountId: string,
    toAccountId: string,
    amountMinor: number,
    currency: CurrencyCode,
    notes?: string
  ) => void;

  addAccount: (acc: Omit<Account, 'id'>) => void;
  editAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  markBillPaid: (billId: string) => void;
  addRecurringBill: (bill: Omit<RecurringBill, 'id'>) => void;
  deleteRecurringBill: (billId: string) => void;

  allocateToGoal: (goalId: string, fromAccountId: string, amountMinor: number) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'allocatedMinor'>) => void;
  editBudget: (id: string, limitMinor: number) => void;

  importTransactions: (txs: Omit<Transaction, 'id'>[]) => number;
  resetToDefaults: () => void;
  runInvariantsCheck: () => { isValid: boolean; message: string };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCOUNTS: 'stevari_accounts_v1',
  TRANSACTIONS: 'stevari_transactions_v1',
  BUDGETS: 'stevari_budgets_v1',
  GOALS: 'stevari_goals_v1',
  BILLS: 'stevari_bills_v1',
  HOUSEHOLD: 'stevari_household_v1',
  BASE_CURRENCY: 'stevari_base_currency_v1',
  VISIBILITY: 'stevari_visibility_v1',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : SEED_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : SEED_BUDGETS;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : SEED_SAVINGS_GOALS;
  });

  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
    return saved ? JSON.parse(saved) : SEED_RECURRING_BILLS;
  });

  const [household, setHousehold] = useState<Household>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOUSEHOLD);
    return saved ? JSON.parse(saved) : SEED_HOUSEHOLD;
  });

  const [baseCurrency, setBaseCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BASE_CURRENCY);
    return (saved as CurrencyCode) || 'PLN';
  });

  const [visibilityMode, setVisibilityModeState] = useState<VisibilityMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VISIBILITY);
    return (saved as VisibilityMode) || 'all';
  });

  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'forecast' | 'budgets' | 'household' | 'dossier'>('dashboard');
  const [activeMemberId, setActiveMemberId] = useState<string>('usr_piotr');
  const [ratesPerEur] = useState<Record<CurrencyCode, number>>(DEFAULT_RATES_PER_EUR);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(recurringBills));
  }, [recurringBills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOUSEHOLD, JSON.stringify(household));
  }, [household]);

  const setBaseCurrency = (c: CurrencyCode) => {
    setBaseCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.BASE_CURRENCY, c);
  };

  const setVisibilityMode = (v: VisibilityMode) => {
    setVisibilityModeState(v);
    localStorage.setItem(STORAGE_KEYS.VISIBILITY, v);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Double-entry Transfer: creates paired transactions linking source and target accounts,
   * guaranteeing zero-sum consolidated impact.
   */
  const recordTransfer = (
    fromAccountId: string,
    toAccountId: string,
    amountMinor: number,
    currency: CurrencyCode,
    notes = 'Account Transfer'
  ) => {
    const linkId = `tr_link_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const fromAccount = accounts.find((a) => a.id === fromAccountId);
    const toAccount = accounts.find((a) => a.id === toAccountId);

    const outTx: Transaction = {
      id: `tx_${Date.now()}_out`,
      accountId: fromAccountId,
      date: today,
      payee: `Transfer to ${toAccount?.name || 'Account'}`,
      category: 'savings_transfer',
      type: 'transfer',
      amountMinor: -Math.abs(amountMinor),
      originalCurrency: currency,
      transferAccountId: toAccountId,
      transferLinkId: linkId,
      isShared: true,
      notes,
    };

    const inTx: Transaction = {
      id: `tx_${Date.now()}_in`,
      accountId: toAccountId,
      date: today,
      payee: `Transfer from ${fromAccount?.name || 'Account'}`,
      category: 'savings_transfer',
      type: 'transfer',
      amountMinor: Math.abs(amountMinor),
      originalCurrency: currency,
      transferAccountId: fromAccountId,
      transferLinkId: linkId,
      isShared: true,
      notes,
    };

    setTransactions((prev) => [outTx, inTx, ...prev]);
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...acc,
      id: `acc_${Date.now()}`,
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const editAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const markBillPaid = (billId: string) => {
    const bill = recurringBills.find((b) => b.id === billId);
    if (!bill) return;

    // Toggle or mark paid and optionally record payment in ledger
    setRecurringBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: b.status === 'paid' ? 'upcoming' : 'paid' } : b))
    );

    if (bill.status !== 'paid') {
      const today = new Date().toISOString().split('T')[0];
      addTransaction({
        accountId: bill.accountId,
        date: today,
        payee: bill.name,
        category: bill.category,
        type: 'expense',
        amountMinor: -Math.abs(bill.amountMinor),
        originalCurrency: bill.currency,
        isShared: bill.isShared,
        notes: `Automated payment for recurring bill: ${bill.name}`,
      });
    }
  };

  const addRecurringBill = (bill: Omit<RecurringBill, 'id'>) => {
    const newBill: RecurringBill = {
      ...bill,
      id: `bill_${Date.now()}`,
    };
    setRecurringBills((prev) => [...prev, newBill]);
  };

  const deleteRecurringBill = (billId: string) => {
    setRecurringBills((prev) => prev.filter((b) => b.id !== billId));
  };

  const allocateToGoal = (goalId: string, fromAccountId: string, amountMinor: number) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return;

    // Increment allocated
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, allocatedMinor: g.allocatedMinor + amountMinor } : g))
    );

    // If linked account is specified, move funds
    if (goal.linkedAccountId && goal.linkedAccountId !== fromAccountId) {
      recordTransfer(fromAccountId, goal.linkedAccountId, amountMinor, goal.targetCurrency, `Allocation to Goal: ${goal.name}`);
    }
  };

  const addGoal = (goal: Omit<SavingsGoal, 'id' | 'allocatedMinor'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      allocatedMinor: 0,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  const editBudget = (id: string, limitMinor: number) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, limitMinor } : b)));
  };

  const importTransactions = (txs: Omit<Transaction, 'id'>[]): number => {
    const newTxs: Transaction[] = txs.map((t, idx) => ({
      ...t,
      id: `tx_import_${Date.now()}_${idx}`,
    }));
    setTransactions((prev) => [...newTxs, ...prev]);
    return newTxs.length;
  };

  const resetToDefaults = () => {
    setAccounts(SEED_ACCOUNTS);
    setTransactions(SEED_TRANSACTIONS);
    setBudgets(SEED_BUDGETS);
    setSavingsGoals(SEED_SAVINGS_GOALS);
    setRecurringBills(SEED_RECURRING_BILLS);
    setHousehold(SEED_HOUSEHOLD);
    setBaseCurrencyState('PLN');
    setVisibilityModeState('all');
    localStorage.clear();
  };

  const runInvariantsCheck = () => {
    return verifyTransferInvariants(transactions);
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        budgets,
        savingsGoals,
        recurringBills,
        household,
        baseCurrency,
        visibilityMode,
        ratesPerEur,
        currentView,
        activeTab,
        activeMemberId,
        setBaseCurrency,
        setVisibilityMode,
        setCurrentView,
        setActiveTab,
        setActiveMemberId,
        addTransaction,
        editTransaction,
        deleteTransaction,
        recordTransfer,
        addAccount,
        editAccount,
        deleteAccount,
        markBillPaid,
        addRecurringBill,
        deleteRecurringBill,
        allocateToGoal,
        addGoal,
        editBudget,
        importTransactions,
        resetToDefaults,
        runInvariantsCheck,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
