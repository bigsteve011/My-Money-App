import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  generateCashFlowProjection,
  calculateConsolidatedNetWorth,
  formatMoney,
  convertMinor,
  parseInputToMinor,
} from '../../utils/accounting';
import { RecurringBill, CategoryId, CurrencyCode } from '../../types/finance';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ArrowRight,
  TrendingDown,
  Info,
  DollarSign,
} from 'lucide-react';

export const ForecastBillsView: React.FC = () => {
  const {
    accounts,
    transactions,
    recurringBills,
    baseCurrency,
    ratesPerEur,
    markBillPaid,
    addRecurringBill,
    deleteRecurringBill,
  } = useFinance();

  const [nextPaydayDate, setNextPaydayDate] = useState('2026-11-01');
  const [plannedSalaryStr, setPlannedSalaryStr] = useState('16500'); // 16,500 PLN
  const [showAddBillModal, setShowAddBillModal] = useState(false);

  // Form state for adding new bill
  const [newBillName, setNewBillName] = useState('');
  const [newBillAmountStr, setNewBillAmountStr] = useState('');
  const [newBillCurrency, setNewBillCurrency] = useState<CurrencyCode>('PLN');
  const [newBillDueDay, setNewBillDueDay] = useState(15);
  const [newBillCategory, setNewBillCategory] = useState<CategoryId>('utilities');
  const [newBillAccountId, setNewBillAccountId] = useState(accounts[0]?.id || '');

  // Calculate current liquid base funds
  const { totalBaseMinor } = calculateConsolidatedNetWorth(
    accounts,
    transactions,
    baseCurrency,
    ratesPerEur
  );

  const plannedSalaryMinor = parseInputToMinor(plannedSalaryStr);

  const projection = generateCashFlowProjection(
    totalBaseMinor,
    recurringBills,
    plannedSalaryMinor,
    nextPaydayDate,
    baseCurrency,
    30,
    ratesPerEur
  );

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const minor = parseInputToMinor(newBillAmountStr);
    if (!newBillName || minor <= 0) return;

    addRecurringBill({
      name: newBillName,
      amountMinor: minor,
      currency: newBillCurrency,
      frequency: 'monthly',
      dueDay: Number(newBillDueDay),
      category: newBillCategory,
      accountId: newBillAccountId,
      status: 'upcoming',
      nextDueDate: `2026-10-${newBillDueDay.toString().padStart(2, '0')}`,
      isShared: true,
      autoDeduct: true,
    });

    setNewBillName('');
    setNewBillAmountStr('');
    setShowAddBillModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Upcoming Cash-Flow & Payday Runway
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Salary-to-salary projection that calculates your actual Safe-to-Spend daily buffer
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Next Payday:</span>
            <input
              type="date"
              value={nextPaydayDate}
              onChange={(e) => setNextPaydayDate(e.target.value)}
              className="font-mono font-semibold text-slate-900 bg-transparent border-none focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Primary KPI Row: Safe to Spend & Payday Projection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#D9F8EE]/60 border border-[#0DAE9B]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#102B3F] font-semibold">
            <span>Safe-to-Spend Daily Pace</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#0DAE9B]/30">
              Discretionary Buffer
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#0DAE9B] mt-3 tabular-nums">
            {formatMoney(projection.safeToSpendPerDayMinor, baseCurrency)}
            <span className="text-xs font-normal text-slate-600"> / day</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            Remaining cash after deducting all upcoming mandatory obligations before payday.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Mandatory Bills Before Payday</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-3 tabular-nums">
            {formatMoney(
              recurringBills
                .filter((b) => b.status === 'upcoming')
                .reduce((acc, b) => acc + convertMinor(b.amountMinor, b.currency, baseCurrency, ratesPerEur), 0),
              baseCurrency
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {recurringBills.filter((b) => b.status === 'upcoming').length} scheduled bills remaining this cycle.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Projected Payday Balance</span>
            <Calendar className="w-3.5 h-3.5 text-[#3478F6]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#102B3F] mt-3 tabular-nums">
            {formatMoney(projection.projectedPaydayBalanceMinor, baseCurrency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Includes planned salary deposit of {formatMoney(plannedSalaryMinor, baseCurrency)}.
          </p>
        </div>
      </div>

      {/* 30-Day Forward Timeline Visualizer */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Forward Runway Timeline (Next 30 Days)</h2>
            <span className="text-[11px] text-slate-400">Day-by-day projected balance</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Lowest dip: {formatMoney(projection.minimumProjectedMinor, baseCurrency)}</span>
          </div>
        </div>

        {/* Timeline Bar Strip */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[650px] grid grid-cols-15 gap-1.5 text-center">
            {projection.timeline.slice(0, 15).map((day, idx) => {
              const hasBill = day.outflowsMinor > 0;
              const hasIncome = day.inflowsMinor > 0;

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border text-[11px] transition-all ${
                    hasIncome
                      ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300'
                      : hasBill
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="font-semibold text-slate-500">Day {day.dayOfMonth}</div>
                  <div className="font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {(day.projectedBalanceMinor / 100).toFixed(0)}
                  </div>
                  {hasBill && (
                    <div className="text-[9px] text-amber-700 font-bold truncate mt-0.5">
                      -{formatMoney(day.outflowsMinor, baseCurrency, false)}
                    </div>
                  )}
                  {hasIncome && (
                    <div className="text-[9px] text-emerald-700 font-bold truncate mt-0.5">
                      +{formatMoney(day.inflowsMinor, baseCurrency, false)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recurring Bills & Subscriptions Manager */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recurring Bills & Subscriptions</h2>
            <p className="text-xs text-slate-500">
              Manage recurring commitments; marking as paid automatically records the ledger expense
            </p>
          </div>
          <button
            onClick={() => setShowAddBillModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Recurring Bill
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recurringBills.map((bill) => {
            const acc = accounts.find((a) => a.id === bill.accountId);
            const isPaid = bill.status === 'paid';

            return (
              <div
                key={bill.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between bg-white text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{bill.name}</div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-2">
                    <span>Due on day {bill.dueDay} of month</span>
                    <span>·</span>
                    <span>{acc?.name}</span>
                  </div>
                  <div className="text-slate-400 capitalize">{bill.category.replace('_', ' ')}</div>
                </div>

                <div className="text-right space-y-2">
                  <div className="font-mono font-bold text-base text-slate-900">
                    {formatMoney(bill.amountMinor, bill.currency)}
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <button
                      onClick={() => markBillPaid(bill.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isPaid ? 'Paid' : 'Mark Paid'}
                    </button>
                    <button
                      onClick={() => deleteRecurringBill(bill.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Bill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Recurring Bill Modal */}
      {showAddBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Recurring Bill / Subscription</h3>
            <p className="text-xs text-slate-500 mb-4">Set up a scheduled commitment for automated forecasting</p>

            <form onSubmit={handleAddBill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bill Name</label>
                <input
                  type="text"
                  value={newBillName}
                  onChange={(e) => setNewBillName(e.target.value)}
                  placeholder="e.g. Netflix, Gym, Internet"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="text"
                    value={newBillAmountStr}
                    onChange={(e) => setNewBillAmountStr(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={newBillCurrency}
                    onChange={(e) => setNewBillCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="PLN">PLN (zł)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="ZAR">ZAR (R)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Day of Month (1–31)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={newBillDueDay}
                    onChange={(e) => setNewBillDueDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newBillCategory}
                    onChange={(e) => setNewBillCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="housing">Housing</option>
                    <option value="utilities">Utilities</option>
                    <option value="software">Software / Cloud</option>
                    <option value="health">Fitness & Health</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Deduct From Account</label>
                <select
                  value={newBillAccountId}
                  onChange={(e) => setNewBillAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBillModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg shadow-xs"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
