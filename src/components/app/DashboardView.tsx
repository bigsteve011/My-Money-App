import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  calculateAccountBalance,
  calculateConsolidatedNetWorth,
  formatMoney,
  convertMinor,
  CURRENCY_SYMBOLS,
} from '../../utils/accounting';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Calendar,
  Lock,
  Users,
  ShieldCheck,
  Plus,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface Props {
  onOpenNewTransaction: () => void;
  onOpenTransfer: () => void;
  onOpenCsvModal: () => void;
}

export const DashboardView: React.FC<Props> = ({
  onOpenNewTransaction,
  onOpenTransfer,
  onOpenCsvModal,
}) => {
  const {
    accounts,
    transactions,
    recurringBills,
    baseCurrency,
    visibilityMode,
    ratesPerEur,
    setActiveTab,
    runInvariantsCheck,
  } = useFinance();

  const { totalBaseMinor, assetsBaseMinor, debtsBaseMinor } = calculateConsolidatedNetWorth(
    accounts,
    transactions,
    baseCurrency,
    ratesPerEur,
    visibilityMode
  );

  // Invariant verification check
  const invariantStatus = runInvariantsCheck();

  // Current month flows in base currency
  const currentMonthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  let currentMonthInflows = 0;
  let currentMonthOutflows = 0;

  transactions
    .filter((tx) => tx.date.startsWith(currentMonthStr))
    .forEach((tx) => {
      if (tx.type === 'transfer') return; // Transfers do not count towards income/expense
      const converted = convertMinor(Math.abs(tx.amountMinor), tx.originalCurrency, baseCurrency, ratesPerEur);
      if (tx.type === 'income') {
        currentMonthInflows += converted;
      } else if (tx.type === 'expense') {
        currentMonthOutflows += converted;
      }
    });

  const netSavingsMinor = currentMonthInflows - currentMonthOutflows;

  // Upcoming bills due in next 14 days
  const upcomingBills = recurringBills.filter((b) => b.status === 'upcoming');

  return (
    <div className="space-y-6">
      {/* Top Consolidated Net Worth Bar & Invariant Badge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Net Worth Card */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Consolidated Net Worth ({baseCurrency})
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {visibilityMode === 'all'
                    ? 'All Accounts'
                    : visibilityMode === 'shared_only'
                    ? 'Shared Household Only'
                    : 'Private Accounts Only'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Accounting Invariants Verified</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-4">
              <span className="text-4xl font-extrabold text-[#102B3F] font-mono tabular-nums tracking-tight">
                {formatMoney(totalBaseMinor, baseCurrency)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Triangulated from {accounts.length} multi-currency accounts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 mt-6 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Total Assets</span>
              <div className="text-base font-bold font-mono text-slate-800 mt-0.5">
                {formatMoney(assetsBaseMinor, baseCurrency)}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Liabilities / Credit</span>
              <div className="text-base font-bold font-mono text-slate-800 mt-0.5">
                {formatMoney(debtsBaseMinor, baseCurrency)}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Net Monthly Flow</span>
              <div
                className={`text-base font-bold font-mono mt-0.5 ${
                  netSavingsMinor >= 0 ? 'text-[#0DAE9B]' : 'text-amber-600'
                }`}
              >
                {formatMoney(netSavingsMinor, baseCurrency)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Month Cash-Flow Snapshot */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                This Month (October)
              </span>
              <button
                onClick={() => setActiveTab('forecast')}
                className="text-xs text-[#0DAE9B] hover:underline font-semibold"
              >
                Forecast & Bills
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  </div>
                  <span>Total Inflow</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  +{formatMoney(currentMonthInflows, baseCurrency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-6 h-6 rounded-md bg-red-100 text-red-700 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <span>Total Outflow</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  -{formatMoney(currentMonthOutflows, baseCurrency)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <button
              onClick={onOpenNewTransaction}
              className="w-full py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Entry
            </button>
            <button
              onClick={onOpenTransfer}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Currency Accounts Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Multi-Currency Accounts & Wallets ({accounts.length})
          </h2>
          <span className="text-xs text-slate-500">
            Valuations in {baseCurrency} updated via ECB/NBP benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts
            .filter((acc) => {
              if (visibilityMode === 'shared_only') return acc.isShared;
              if (visibilityMode === 'private_only') return !acc.isShared;
              return true;
            })
            .map((account) => {
              const balanceMinor = calculateAccountBalance(account, transactions);
              const convertedMinor = convertMinor(balanceMinor, account.currency, baseCurrency, ratesPerEur);

              return (
                <div
                  key={account.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#0DAE9B]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium text-slate-400">
                        {account.institution} {account.accountNumberMasked}
                      </span>
                      {account.isShared ? (
                        <span
                          className="flex items-center gap-1 text-[11px] text-[#0DAE9B] font-medium"
                          title="Shared with household"
                        >
                          <Users className="w-3 h-3" />
                          Shared
                        </span>
                      ) : (
                        <span
                          className="flex items-center gap-1 text-[11px] text-slate-400 font-medium"
                          title="Private to owner"
                        >
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-sm text-slate-900 mb-1">{account.name}</div>

                    <div className="mt-3">
                      <div className="text-2xl font-extrabold font-mono text-[#102B3F] tabular-nums">
                        {formatMoney(balanceMinor, account.currency)}
                      </div>
                      {account.currency !== baseCurrency && (
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          ≈ {formatMoney(convertedMinor, baseCurrency)} ({baseCurrency})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize">{account.type} account</span>
                    <button
                      onClick={onOpenTransfer}
                      className="text-[#3478F6] hover:underline font-medium text-[11px]"
                    >
                      Transfer funds
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Two Column Section: Upcoming Bills + Recent Ledger Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upcoming Bills (14 Days) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3478F6]" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Recurring Bills</h3>
            </div>
            <button
              onClick={() => setActiveTab('forecast')}
              className="text-xs text-[#3478F6] hover:underline font-semibold"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingBills.slice(0, 4).map((bill) => (
              <div
                key={bill.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{bill.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Due {bill.nextDueDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900">
                    {formatMoney(bill.amountMinor, bill.currency)}
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium">Pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Strip */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Ledger Activity</h3>
            <button
              onClick={() => setActiveTab('ledger')}
              className="text-xs text-[#0DAE9B] hover:underline font-semibold"
            >
              View All ({transactions.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {transactions.slice(0, 5).map((tx) => {
              const acc = accounts.find((a) => a.id === tx.accountId);
              const isPositive = tx.amountMinor > 0;

              return (
                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        tx.type === 'transfer'
                          ? 'bg-blue-100 text-blue-700'
                          : isPositive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tx.type === 'transfer' ? (
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      ) : isPositive ? (
                        '+'
                      ) : (
                        '−'
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{tx.payee}</div>
                      <div className="text-[11px] text-slate-400">
                        {acc?.name} · {tx.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono font-bold tabular-nums ${
                        tx.type === 'transfer'
                          ? 'text-blue-700'
                          : isPositive
                          ? 'text-emerald-700'
                          : 'text-slate-900'
                      }`}
                    >
                      {formatMoney(tx.amountMinor, tx.originalCurrency)}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">{tx.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
