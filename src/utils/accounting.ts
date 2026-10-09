import { CurrencyCode, Account, Transaction, TransactionType, RecurringBill, CashFlowDay, CategoryId } from '../types/finance';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  PLN: 'zł',
  EUR: '€',
  USD: '$',
  GBP: '£',
  NGN: '₦',
  ZAR: 'R',
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  PLN: 'Polish Złoty (PLN)',
  EUR: 'Euro (EUR)',
  USD: 'US Dollar (USD)',
  GBP: 'British Pound (GBP)',
  NGN: 'Nigerian Naira (NGN)',
  ZAR: 'South African Rand (ZAR)',
};

// Default benchmark FX Rates relative to 1 EUR
// Allows triangulation to any currency pair: from -> EUR -> to
export const DEFAULT_RATES_PER_EUR: Record<CurrencyCode, number> = {
  EUR: 1.0,
  PLN: 4.285, // 1 EUR = 4.285 PLN
  USD: 1.082, // 1 EUR = 1.082 USD
  GBP: 0.854, // 1 EUR = 0.854 GBP
  NGN: 1680.0, // 1 EUR = 1680 NGN
  ZAR: 19.85, // 1 EUR = 19.85 ZAR
};

export const FX_RATE_PROVENANCE = 'ECB & NBP Daily Mid-Market Benchmark';
export const FX_RATE_DATE = '2026-10-09';

/**
 * Calculates exchange rate between two currencies using EUR as base triangulation
 */
export function getExchangeRate(from: CurrencyCode, to: CurrencyCode, ratesPerEur = DEFAULT_RATES_PER_EUR): number {
  if (from === to) return 1.0;
  const eurPerFrom = 1.0 / ratesPerEur[from];
  return eurPerFrom * ratesPerEur[to];
}

/**
 * Convert integer minor units (e.g. grosze/cents) from one currency to another
 */
export function convertMinor(
  amountMinor: number,
  from: CurrencyCode,
  to: CurrencyCode,
  ratesPerEur = DEFAULT_RATES_PER_EUR
): number {
  if (from === to || amountMinor === 0) return amountMinor;
  const rate = getExchangeRate(from, to, ratesPerEur);
  return Math.round(amountMinor * rate);
}

/**
 * Converts minor units integer into formatted string (e.g. 125050 -> "1 250,50 zł" or "€1,250.50")
 */
export function formatMoney(minor: number, currency: CurrencyCode, includeSymbol = true): string {
  const isNegative = minor < 0;
  const absMinor = Math.abs(minor);
  const major = Math.floor(absMinor / 100);
  const cents = absMinor % 100;
  const centsStr = cents.toString().padStart(2, '0');

  // Format with thousand separators
  const parts: string[] = [];
  const majorStr = major.toString();
  for (let i = majorStr.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    parts.unshift(majorStr.slice(start, i));
  }
  const formattedMajor = parts.join(currency === 'PLN' ? ' ' : ',');

  const sign = isNegative ? '-' : '';
  const numString = `${sign}${formattedMajor}.${centsStr}`;

  if (!includeSymbol) return numString;

  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === 'PLN') {
    return `${sign}${formattedMajor},${centsStr} ${symbol}`;
  }
  return `${sign}${symbol}${formattedMajor}.${centsStr}`;
}

/**
 * Parses user input string (e.g. "1250.50" or "1 250,50") into integer minor units
 */
export function parseInputToMinor(input: string | number): number {
  if (typeof input === 'number') {
    return Math.round(input * 100);
  }
  if (!input) return 0;
  // Clean whitespace, convert comma to dot
  const cleaned = input.toString().replace(/\s+/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

/**
 * Calculates current ledger balance for a specific account:
 * Opening balance + sum of all transactions for that account
 */
export function calculateAccountBalance(
  account: Account,
  transactions: Transaction[]
): number {
  const accountTxs = transactions.filter((tx) => tx.accountId === account.id);
  const sumTxs = accountTxs.reduce((acc, tx) => acc + tx.amountMinor, 0);
  return account.openingBalanceMinor + sumTxs;
}

/**
 * Calculates consolidated net worth converted to chosen base currency
 */
export function calculateConsolidatedNetWorth(
  accounts: Account[],
  transactions: Transaction[],
  baseCurrency: CurrencyCode,
  ratesPerEur = DEFAULT_RATES_PER_EUR,
  visibilityFilter: 'all' | 'shared_only' | 'private_only' = 'all'
): {
  totalBaseMinor: number;
  assetsBaseMinor: number;
  debtsBaseMinor: number;
} {
  const filteredAccounts = accounts.filter((acc) => {
    if (visibilityFilter === 'shared_only') return acc.isShared;
    if (visibilityFilter === 'private_only') return !acc.isShared;
    return true;
  });

  let totalBaseMinor = 0;
  let assetsBaseMinor = 0;
  let debtsBaseMinor = 0;

  for (const acc of filteredAccounts) {
    const balMinor = calculateAccountBalance(acc, transactions);
    const convertedMinor = convertMinor(balMinor, acc.currency, baseCurrency, ratesPerEur);
    totalBaseMinor += convertedMinor;

    if (convertedMinor >= 0) {
      assetsBaseMinor += convertedMinor;
    } else {
      debtsBaseMinor += Math.abs(convertedMinor);
    }
  }

  return { totalBaseMinor, assetsBaseMinor, debtsBaseMinor };
}

/**
 * Invariant test: verify that transfers across all accounts net to zero
 */
export function verifyTransferInvariants(transactions: Transaction[]): {
  isValid: boolean;
  discrepancyCount: number;
  message: string;
} {
  const transferTxs = transactions.filter((tx) => tx.type === 'transfer' && tx.transferLinkId);
  const linkMap = new Map<string, number>();

  for (const tx of transferTxs) {
    const linkId = tx.transferLinkId!;
    const cur = linkMap.get(linkId) || 0;
    linkMap.set(linkId, cur + tx.amountMinor);
  }

  let discrepancyCount = 0;
  linkMap.forEach((netAmount) => {
    // For transfers in same currency, netAmount should be 0.
    if (netAmount !== 0) {
      discrepancyCount++;
    }
  });

  return {
    isValid: discrepancyCount === 0,
    discrepancyCount,
    message: discrepancyCount === 0
      ? 'All transfer pairs balance to 0. Accounting invariant intact.'
      : `${discrepancyCount} transfer pairs show discrepancies.`,
  };
}

/**
 * Calculates total category spending for a given calendar month in base currency
 */
export function calculateCategorySpend(
  category: CategoryId,
  transactions: Transaction[],
  baseCurrency: CurrencyCode,
  currentMonthPrefix: string, // "YYYY-MM"
  ratesPerEur = DEFAULT_RATES_PER_EUR
): number {
  return transactions
    .filter(
      (tx) =>
        tx.category === category &&
        tx.type === 'expense' &&
        tx.date.startsWith(currentMonthPrefix)
    )
    .reduce((total, tx) => {
      const outflowMinor = Math.abs(tx.amountMinor);
      const inBase = convertMinor(outflowMinor, tx.originalCurrency, baseCurrency, ratesPerEur);
      return total + inBase;
    }, 0);
}

/**
 * Next-Payday Salary-to-Salary Cashflow Projection Engine
 */
export function generateCashFlowProjection(
  currentTotalBaseMinor: number,
  upcomingBills: RecurringBill[],
  plannedSalaryBaseMinor: number,
  nextPaydayDate: string, // YYYY-MM-DD
  baseCurrency: CurrencyCode,
  daysToForecast = 30,
  ratesPerEur = DEFAULT_RATES_PER_EUR
): {
  timeline: CashFlowDay[];
  safeToSpendPerDayMinor: number;
  projectedPaydayBalanceMinor: number;
  minimumProjectedMinor: number;
} {
  const timeline: CashFlowDay[] = [];
  let runningBalance = currentTotalBaseMinor;
  let minimumProjectedMinor = currentTotalBaseMinor;

  const today = new Date();
  const paydayObj = new Date(nextPaydayDate);
  const daysUntilPayday = Math.max(1, Math.round((paydayObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  let totalMandatoryBillsMinor = 0;

  for (let i = 0; i < daysToForecast; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfMonth = d.getDate();

    let inflowsMinor = 0;
    let outflowsMinor = 0;
    const events: CashFlowDay['events'] = [];

    // Is it payday?
    if (dateStr === nextPaydayDate || (i === daysUntilPayday && i > 0)) {
      inflowsMinor += plannedSalaryBaseMinor;
      events.push({
        title: 'Planned Salary Deposit',
        amountMinor: plannedSalaryBaseMinor,
        type: 'income',
      });
    }

    // Bills falling on this day
    const dayBills = upcomingBills.filter((b) => b.dueDay === dayOfMonth && b.status !== 'paid');
    for (const bill of dayBills) {
      const billInBase = convertMinor(bill.amountMinor, bill.currency, baseCurrency, ratesPerEur);
      outflowsMinor += billInBase;
      if (i <= daysUntilPayday) {
        totalMandatoryBillsMinor += billInBase;
      }
      events.push({
        title: bill.name,
        amountMinor: billInBase,
        type: 'bill',
      });
    }

    runningBalance = runningBalance + inflowsMinor - outflowsMinor;
    if (runningBalance < minimumProjectedMinor) {
      minimumProjectedMinor = runningBalance;
    }

    timeline.push({
      date: dateStr,
      dayOfMonth,
      projectedBalanceMinor: runningBalance,
      inflowsMinor,
      outflowsMinor,
      events,
    });
  }

  // Safe to spend buffer calculation:
  // (Current balance - mandatory upcoming bills until payday) / daysUntilPayday
  const discretionaryBufferMinor = Math.max(0, currentTotalBaseMinor - totalMandatoryBillsMinor);
  const safeToSpendPerDayMinor = Math.floor(discretionaryBufferMinor / daysUntilPayday);

  const projectedPaydayIndex = Math.min(daysUntilPayday, timeline.length - 1);
  const projectedPaydayBalanceMinor = timeline[projectedPaydayIndex]?.projectedBalanceMinor ?? runningBalance;

  return {
    timeline,
    safeToSpendPerDayMinor,
    projectedPaydayBalanceMinor,
    minimumProjectedMinor,
  };
}

/**
 * CSV Export Generator
 */
export function exportTransactionsToCSV(transactions: Transaction[], accounts: Account[]): string {
  const accountMap = new Map(accounts.map((a) => [a.id, a.name]));
  const headers = ['Date', 'Account', 'Payee', 'Category', 'Type', 'Amount', 'Currency', 'Notes', 'Shared'];

  const rows = transactions.map((tx) => {
    const accName = accountMap.get(tx.accountId) || 'Unknown Account';
    const amountFloat = (tx.amountMinor / 100).toFixed(2);
    const notesClean = (tx.notes || '').replace(/"/g, '""');
    return [
      tx.date,
      `"${accName}"`,
      `"${tx.payee.replace(/"/g, '""')}"`,
      tx.category,
      tx.type,
      amountFloat,
      tx.originalCurrency,
      `"${notesClean}"`,
      tx.isShared ? 'yes' : 'no',
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * CSV Import Parser with Validation and Duplicate Detection
 */
export function parseCSVTransactions(
  csvContent: string,
  existingTransactions: Transaction[],
  defaultAccountId: string,
  defaultCurrency: CurrencyCode = 'PLN'
): {
  valid: Omit<Transaction, 'id'>[];
  errors: string[];
  duplicateCount: number;
} {
  const lines = csvContent.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { valid: [], errors: ['File is empty or contains only a header.'], duplicateCount: 0 };
  }

  const valid: Omit<Transaction, 'id'>[] = [];
  const errors: string[] = [];
  let duplicateCount = 0;

  // Simple key set for duplicate detection: date + payee + amountMinor + currency
  const existingSet = new Set(
    existingTransactions.map((tx) => `${tx.date}_${tx.payee.toLowerCase().trim()}_${tx.amountMinor}_${tx.originalCurrency}`)
  );

  // Skip header line
  for (let idx = 1; idx < lines.length; idx++) {
    const line = lines[idx].trim();
    if (!line) continue;

    // Basic CSV comma splitter handling quotes
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    const cols: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      const val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      cols.push((val || '').trim());
    }

    if (cols.length < 3) {
      errors.push(`Row ${idx + 1}: Insufficient columns`);
      continue;
    }

    // Expecting: Date, Payee, Amount (or Date, Account, Payee, Category, Type, Amount, Currency...)
    let dateStr = cols[0];
    let payee = cols[1];
    let amountStr = cols[2];
    let currency: CurrencyCode = defaultCurrency;
    let category: CategoryId = 'other';
    let type: TransactionType = 'expense';

    if (cols.length >= 6) {
      // Full Stevari format: Date, Account, Payee, Category, Type, Amount, Currency
      dateStr = cols[0];
      payee = cols[2];
      category = (cols[3] as CategoryId) || 'other';
      type = (cols[4] as TransactionType) || 'expense';
      amountStr = cols[5];
      if (cols[6] && ['PLN', 'EUR', 'USD', 'GBP', 'NGN', 'ZAR'].includes(cols[6].toUpperCase())) {
        currency = cols[6].toUpperCase() as CurrencyCode;
      }
    }

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // try to parse standard date
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) {
        errors.push(`Row ${idx + 1}: Invalid date '${dateStr}'`);
        continue;
      }
      dateStr = parsedDate.toISOString().split('T')[0];
    }

    const minor = parseInputToMinor(amountStr);
    if (minor === 0) {
      errors.push(`Row ${idx + 1}: Invalid amount '${amountStr}'`);
      continue;
    }

    // Determine type and signed amount
    const signedMinor = type === 'income' ? Math.abs(minor) : -Math.abs(minor);

    const dupKey = `${dateStr}_${payee.toLowerCase().trim()}_${signedMinor}_${currency}`;
    if (existingSet.has(dupKey)) {
      duplicateCount++;
      continue; // Skip duplicate
    }

    valid.push({
      accountId: defaultAccountId,
      date: dateStr,
      payee: payee || 'Uncategorized Payee',
      category,
      type,
      amountMinor: signedMinor,
      originalCurrency: currency,
      isShared: true,
      notes: 'Imported via CSV',
    });
  }

  return { valid, errors, duplicateCount };
}
