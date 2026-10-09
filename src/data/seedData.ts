import { Account, Transaction, Budget, SavingsGoal, RecurringBill, Household, FXRate } from '../types/finance';

export const SEED_HOUSEHOLD: Household = {
  id: 'hh_warsaw_01',
  name: 'Kowalski & Taylor Household',
  currency: 'PLN',
  members: [
    {
      id: 'usr_piotr',
      name: 'Piotr Kowalski',
      email: 'piotr@stevari.app',
      role: 'owner',
      avatarInitials: 'PK',
      color: '#0DAE9B', // primary teal
    },
    {
      id: 'usr_anna',
      name: 'Anna Taylor',
      email: 'anna@stevari.app',
      role: 'partner',
      avatarInitials: 'AT',
      color: '#3478F6', // sky blue
    },
  ],
};

export const SEED_ACCOUNTS: Account[] = [
  {
    id: 'acc_pko_pln',
    name: 'PKO BP Primary Checking',
    institution: 'PKO Bank Polski',
    type: 'checking',
    currency: 'PLN',
    openingBalanceMinor: 1485000, // 14,850.00 PLN
    isShared: true,
    ownerId: 'usr_piotr',
    color: '#0DAE9B',
    accountNumberMasked: '•••• 4920',
  },
  {
    id: 'acc_revolut_eur',
    name: 'Revolut Euro Travel & FX',
    institution: 'Revolut Bank UAB',
    type: 'wallet',
    currency: 'EUR',
    openingBalanceMinor: 320000, // 3,200.00 EUR
    isShared: true,
    ownerId: 'usr_piotr',
    color: '#3478F6',
    accountNumberMasked: '•••• 1184',
  },
  {
    id: 'acc_wise_gbp',
    name: 'Wise UK Consulting Account',
    institution: 'Wise Payments Ltd',
    type: 'checking',
    currency: 'GBP',
    openingBalanceMinor: 145000, // 1,450.00 GBP
    isShared: false, // Private to Piotr
    ownerId: 'usr_piotr',
    color: '#102B3F',
    accountNumberMasked: '•••• 8832',
  },
  {
    id: 'acc_santander_savings_pln',
    name: 'Santander High-Yield Savings',
    institution: 'Santander Bank Polska',
    type: 'savings',
    currency: 'PLN',
    openingBalanceMinor: 4200000, // 42,000.00 PLN
    isShared: true,
    ownerId: 'usr_anna',
    color: '#10B981',
    accountNumberMasked: '•••• 7012',
  },
  {
    id: 'acc_usd_emergency',
    name: 'USD Safe Buffer Wallet',
    institution: 'Interactive Brokers Cash',
    type: 'wallet',
    currency: 'USD',
    openingBalanceMinor: 250000, // 2,500.00 USD
    isShared: false,
    ownerId: 'usr_anna',
    color: '#F59E0B',
    accountNumberMasked: '•••• 3099',
  },
];

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_01',
    accountId: 'acc_pko_pln',
    date: '2026-10-08',
    payee: 'Biedronka Mokotów',
    category: 'groceries',
    type: 'expense',
    amountMinor: -18450, // -184.50 PLN
    originalCurrency: 'PLN',
    isShared: true,
    notes: 'Weekly fresh groceries and pantry essentials',
    splitPercent: 50,
  },
  {
    id: 'tx_02',
    accountId: 'acc_pko_pln',
    date: '2026-10-06',
    payee: 'Warsaw Tram & Metro ZTM',
    category: 'transport',
    type: 'expense',
    amountMinor: -11000, // -110.00 PLN
    originalCurrency: 'PLN',
    isShared: false,
    notes: '30-day transit pass Piotr',
  },
  {
    id: 'tx_03',
    accountId: 'acc_revolut_eur',
    date: '2026-10-05',
    payee: 'Iberia Airlines',
    category: 'entertainment',
    type: 'expense',
    amountMinor: -34000, // -340.00 EUR
    originalCurrency: 'EUR',
    isShared: true,
    notes: 'Flights Warsaw to Valencia holiday deposit',
    splitPercent: 50,
  },
  {
    id: 'tx_04',
    accountId: 'acc_wise_gbp',
    date: '2026-10-03',
    payee: 'London FinTech Consultancy Ltd',
    category: 'income_freelance',
    type: 'income',
    amountMinor: 285000, // +2,850.00 GBP
    originalCurrency: 'GBP',
    isShared: false,
    notes: 'Q3 Architectural review milestone invoice payout',
  },
  {
    id: 'tx_05',
    accountId: 'acc_pko_pln',
    date: '2026-10-01',
    payee: 'Warsaw Apartamenty Wynajem',
    category: 'housing',
    type: 'expense',
    amountMinor: -420000, // -4,200.00 PLN
    originalCurrency: 'PLN',
    isShared: true,
    notes: 'Monthly apartment rent (Mokotowska st)',
    splitPercent: 50,
  },
  {
    id: 'tx_06',
    accountId: 'acc_pko_pln',
    date: '2026-10-01',
    payee: 'TechCorp Poland Sp. z o.o.',
    category: 'income_salary',
    type: 'income',
    amountMinor: 1650000, // +16,500.00 PLN
    originalCurrency: 'PLN',
    isShared: true,
    notes: 'Monthly engineering salary net',
  },
  {
    id: 'tx_07',
    accountId: 'acc_pko_pln',
    date: '2026-09-28',
    payee: 'PGE Dystrybucja Prąd',
    category: 'utilities',
    type: 'expense',
    amountMinor: -24800, // -248.00 PLN
    originalCurrency: 'PLN',
    isShared: true,
    notes: 'Bi-monthly electricity bill',
  },
  {
    id: 'tx_08',
    accountId: 'acc_pko_pln',
    date: '2026-09-27',
    payee: 'Restauracja AleGloria',
    category: 'dining',
    type: 'expense',
    amountMinor: -32000, // -320.00 PLN
    originalCurrency: 'PLN',
    isShared: true,
    notes: 'Anniversary dinner with Anna',
    splitPercent: 50,
  },
  {
    id: 'tx_09_transfer_out',
    accountId: 'acc_pko_pln',
    date: '2026-09-25',
    payee: 'Transfer to Santander Savings',
    category: 'savings_transfer',
    type: 'transfer',
    amountMinor: -300000, // -3,000.00 PLN
    originalCurrency: 'PLN',
    transferAccountId: 'acc_santander_savings_pln',
    transferLinkId: 'tr_link_20260925',
    isShared: true,
    notes: 'Monthly automated emergency reserve allocation',
  },
  {
    id: 'tx_09_transfer_in',
    accountId: 'acc_santander_savings_pln',
    date: '2026-09-25',
    payee: 'Transfer from PKO Checking',
    category: 'savings_transfer',
    type: 'transfer',
    amountMinor: 300000, // +3,000.00 PLN
    originalCurrency: 'PLN',
    transferAccountId: 'acc_pko_pln',
    transferLinkId: 'tr_link_20260925',
    isShared: true,
    notes: 'Monthly automated emergency reserve allocation',
  },
  {
    id: 'tx_10',
    accountId: 'acc_revolut_eur',
    date: '2026-09-24',
    payee: 'Figma Annual Subscription',
    category: 'software',
    type: 'expense',
    amountMinor: -14400, // -144.00 EUR
    originalCurrency: 'EUR',
    isShared: false,
    notes: 'Design software annual seat',
  },
  {
    id: 'tx_11',
    accountId: 'acc_pko_pln',
    date: '2026-09-20',
    payee: 'Lidl Polska Śródmieście',
    category: 'groceries',
    type: 'expense',
    amountMinor: -21540, // -215.40 PLN
    originalCurrency: 'PLN',
    isShared: true,
    notes: 'Weekly pantry & bio produce',
    splitPercent: 50,
  },
  {
    id: 'tx_12',
    accountId: 'acc_pko_pln',
    date: '2026-09-18',
    payee: 'Refund from Zalando SE',
    category: 'other',
    type: 'refund',
    amountMinor: 38900, // +389.00 PLN
    originalCurrency: 'PLN',
    isShared: true,
    notes: 'Returned winter coat',
  },
];

export const SEED_BUDGETS: Budget[] = [
  { id: 'b_housing', category: 'housing', limitMinor: 450000, period: 'monthly' }, // 4,500 PLN
  { id: 'b_groceries', category: 'groceries', limitMinor: 220000, period: 'monthly' }, // 2,200 PLN
  { id: 'b_dining', category: 'dining', limitMinor: 120000, period: 'monthly' }, // 1,200 PLN
  { id: 'b_utilities', category: 'utilities', limitMinor: 65000, period: 'monthly' }, // 650 PLN
  { id: 'b_transport', category: 'transport', limitMinor: 40000, period: 'monthly' }, // 400 PLN
  { id: 'b_entertainment', category: 'entertainment', limitMinor: 150000, period: 'monthly' }, // 1,500 PLN
];

export const SEED_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal_emergency',
    name: '6-Month Runway Reserve',
    targetMinor: 6000000, // 60,000 PLN
    allocatedMinor: 4200000, // 42,000 PLN (70%)
    targetCurrency: 'PLN',
    targetDate: '2026-12-31',
    category: 'Security',
    linkedAccountId: 'acc_santander_savings_pln',
    icon: 'shield-check',
  },
  {
    id: 'goal_spain_holiday',
    name: 'Spain Andalusia Summer Trip',
    targetMinor: 350000, // 3,500 EUR
    allocatedMinor: 240000, // 2,400 EUR (68%)
    targetCurrency: 'EUR',
    targetDate: '2027-06-15',
    category: 'Travel',
    linkedAccountId: 'acc_revolut_eur',
    icon: 'palmtree',
  },
  {
    id: 'goal_home_deposit',
    name: 'Apartment Warsaw Down Payment',
    targetMinor: 15000000, // 150,000 PLN
    allocatedMinor: 5800000, // 58,000 PLN (38%)
    targetCurrency: 'PLN',
    targetDate: '2028-05-01',
    category: 'Property',
    linkedAccountId: 'acc_santander_savings_pln',
    icon: 'home',
  },
];

export const SEED_RECURRING_BILLS: RecurringBill[] = [
  {
    id: 'bill_rent',
    name: 'Mokotowska Apartment Rent',
    amountMinor: 420000, // 4,200 PLN
    currency: 'PLN',
    frequency: 'monthly',
    dueDay: 1,
    category: 'housing',
    accountId: 'acc_pko_pln',
    status: 'paid',
    nextDueDate: '2026-11-01',
    isShared: true,
    autoDeduct: true,
  },
  {
    id: 'bill_internet',
    name: 'Orange Fiber Optic 1Gbps',
    amountMinor: 8900, // 89.00 PLN
    currency: 'PLN',
    frequency: 'monthly',
    dueDay: 14,
    category: 'utilities',
    accountId: 'acc_pko_pln',
    status: 'upcoming',
    nextDueDate: '2026-10-14',
    isShared: true,
    autoDeduct: true,
  },
  {
    id: 'bill_gym',
    name: 'Zdrofit Premium Dual Pass',
    amountMinor: 36000, // 360.00 PLN
    currency: 'PLN',
    frequency: 'monthly',
    dueDay: 18,
    category: 'health',
    accountId: 'acc_pko_pln',
    status: 'upcoming',
    nextDueDate: '2026-10-18',
    isShared: true,
    autoDeduct: true,
  },
  {
    id: 'bill_spotify',
    name: 'Spotify Family HiFi',
    amountMinor: 3499, // 34.99 PLN
    currency: 'PLN',
    frequency: 'monthly',
    dueDay: 22,
    category: 'entertainment',
    accountId: 'acc_pko_pln',
    status: 'upcoming',
    nextDueDate: '2026-10-22',
    isShared: true,
    autoDeduct: true,
  },
  {
    id: 'bill_pge_power',
    name: 'PGE Electricity Est.',
    amountMinor: 24000, // 240.00 PLN
    currency: 'PLN',
    frequency: 'monthly',
    dueDay: 28,
    category: 'utilities',
    accountId: 'acc_pko_pln',
    status: 'upcoming',
    nextDueDate: '2026-10-28',
    isShared: true,
    autoDeduct: false,
  },
  {
    id: 'bill_icloud',
    name: 'Apple One Premier',
    amountMinor: 1199, // 11.99 EUR
    currency: 'EUR',
    frequency: 'monthly',
    dueDay: 27,
    category: 'software',
    accountId: 'acc_revolut_eur',
    status: 'upcoming',
    nextDueDate: '2026-10-27',
    isShared: true,
    autoDeduct: true,
  },
];

export const SEED_FX_RATES: FXRate[] = [
  { pair: 'EUR/PLN', from: 'EUR', to: 'PLN', rate: 4.285, source: 'NBP Benchmark Fixing', updatedAt: '2026-10-09' },
  { pair: 'USD/PLN', from: 'USD', to: 'PLN', rate: 3.960, source: 'NBP Benchmark Fixing', updatedAt: '2026-10-09' },
  { pair: 'GBP/PLN', from: 'GBP', to: 'PLN', rate: 5.018, source: 'NBP Benchmark Fixing', updatedAt: '2026-10-09' },
  { pair: 'EUR/USD', from: 'EUR', to: 'USD', rate: 1.082, source: 'ECB Daily Reference', updatedAt: '2026-10-09' },
  { pair: 'EUR/GBP', from: 'EUR', to: 'GBP', rate: 0.854, source: 'ECB Daily Reference', updatedAt: '2026-10-09' },
  { pair: 'EUR/NGN', from: 'EUR', to: 'NGN', rate: 1680.0, source: 'CBN Interbank Reference', updatedAt: '2026-10-09' },
  { pair: 'EUR/ZAR', from: 'EUR', to: 'ZAR', rate: 19.85, source: 'SARB Reference Rate', updatedAt: '2026-10-09' },
];
