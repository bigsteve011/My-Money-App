import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  calculateCategorySpend,
  formatMoney,
  convertMinor,
  parseInputToMinor,
} from '../../utils/accounting';
import { SavingsGoal, CategoryId, CurrencyCode } from '../../types/finance';
import {
  PieChart,
  Target,
  Plus,
  ArrowRight,
  ShieldCheck,
  Edit2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const BudgetsGoalsView: React.FC = () => {
  const {
    budgets,
    savingsGoals,
    transactions,
    accounts,
    baseCurrency,
    ratesPerEur,
    editBudget,
    allocateToGoal,
    addGoal,
  } = useFinance();

  const [allocatingGoalId, setAllocatingGoalId] = useState<string | null>(null);
  const [allocationAmountStr, setAllocationAmountStr] = useState('');
  const [allocationFromAccountId, setAllocationFromAccountId] = useState(accounts[0]?.id || '');
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingBudgetLimitStr, setEditingBudgetLimitStr] = useState('');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // New goal form state
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTargetStr, setNewGoalTargetStr] = useState('');
  const [newGoalCurrency, setNewGoalCurrency] = useState<CurrencyCode>('PLN');
  const [newGoalDate, setNewGoalDate] = useState('2027-01-01');
  const [newGoalCategory, setNewGoalCategory] = useState('Safety Reserve');
  const [newGoalAccountId, setNewGoalAccountId] = useState(accounts[0]?.id || '');

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  const handleCommitAllocation = (goal: SavingsGoal) => {
    const minor = parseInputToMinor(allocationAmountStr);
    if (minor <= 0) return;

    allocateToGoal(goal.id, allocationFromAccountId, minor);
    setAllocatingGoalId(null);
    setAllocationAmountStr('');
  };

  const handleSaveBudgetLimit = (budgetId: string) => {
    const minor = parseInputToMinor(editingBudgetLimitStr);
    if (minor > 0) {
      editBudget(budgetId, minor);
    }
    setEditingBudgetId(null);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMinor = parseInputToMinor(newGoalTargetStr);
    if (!newGoalName || targetMinor <= 0) return;

    addGoal({
      name: newGoalName,
      targetMinor,
      targetCurrency: newGoalCurrency,
      targetDate: newGoalDate,
      category: newGoalCategory,
      linkedAccountId: newGoalAccountId,
    });

    setNewGoalName('');
    setNewGoalTargetStr('');
    setShowAddGoalModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Monthly Category Budgets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Monthly Category Budgets</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live spend derived from actual ledger records for {currentMonth} in {baseCurrency}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Currency: {baseCurrency}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spentMinor = calculateCategorySpend(
              b.category,
              transactions,
              baseCurrency,
              currentMonth,
              ratesPerEur
            );
            const percent = Math.min(100, Math.round((spentMinor / b.limitMinor) * 100));
            const remainingMinor = b.limitMinor - spentMinor;
            const isOver = spentMinor > b.limitMinor;

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 capitalize">
                      {b.category.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => {
                        setEditingBudgetId(b.id);
                        setEditingBudgetLimitStr((b.limitMinor / 100).toFixed(0));
                      }}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded"
                      title="Edit Budget Limit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {editingBudgetId === b.id ? (
                    <div className="flex items-center gap-2 my-2">
                      <input
                        type="number"
                        value={editingBudgetLimitStr}
                        onChange={(e) => setEditingBudgetLimitStr(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono border rounded"
                      />
                      <button
                        onClick={() => handleSaveBudgetLimit(b.id)}
                        className="px-2 py-1 text-xs bg-[#0DAE9B] text-white rounded font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-baseline justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Spent: </span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatMoney(spentMinor, baseCurrency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Limit: </span>
                        <span className="font-mono text-slate-600">
                          {formatMoney(b.limitMinor, baseCurrency)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-red-500' : percent > 85 ? 'bg-amber-500' : 'bg-[#0DAE9B]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{percent}% allocated</span>
                  <span
                    className={`font-mono font-semibold ${
                      isOver ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {isOver
                      ? `Over by ${formatMoney(Math.abs(remainingMinor), baseCurrency)}`
                      : `${formatMoney(remainingMinor, baseCurrency)} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings Goals Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dedicated Savings Goals</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Goal progress backed by real account balances rather than fictional numbers
            </p>
          </div>
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {savingsGoals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.allocatedMinor / goal.targetMinor) * 100));
            const isAllocatingThis = allocatingGoalId === goal.id;
            const linkedAcc = accounts.find((a) => a.id === goal.linkedAccountId);

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium text-slate-600">{goal.category}</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{goal.name}</h3>

                  <div className="mt-3">
                    <div className="text-2xl font-extrabold font-mono text-[#102B3F] tabular-nums">
                      {formatMoney(goal.allocatedMinor, goal.targetCurrency)}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      of {formatMoney(goal.targetMinor, goal.targetCurrency)} target
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-linear-to-r from-[#0DAE9B] to-[#3478F6] rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1.5 flex justify-between">
                    <span>{percent}% saved</span>
                    {linkedAcc && <span>Vault: {linkedAcc.name}</span>}
                  </div>
                </div>

                {/* Inline Fund Allocation Action */}
                <div className="pt-4 border-t border-slate-100 mt-4">
                  {isAllocatingThis ? (
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-slate-700">
                        Transfer to {goal.name}:
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={allocationAmountStr}
                          onChange={(e) => setAllocationAmountStr(e.target.value)}
                          placeholder="Amount"
                          className="w-full px-2 py-1 text-xs font-mono border rounded"
                        />
                        <button
                          onClick={() => handleCommitAllocation(goal)}
                          className="px-3 py-1 text-xs font-semibold bg-[#0DAE9B] text-white rounded"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => setAllocatingGoalId(null)}
                          className="px-2 py-1 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAllocatingGoalId(goal.id);
                        setAllocationAmountStr('500');
                      }}
                      className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#0DAE9B]" />
                      Allocate Savings
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Dedicated Savings Goal</h3>
            <p className="text-xs text-slate-500 mb-4">Set target and link to a secure savings account</p>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g. Emergency Runway, Wedding, Relocation"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Amount</label>
                  <input
                    type="text"
                    value={newGoalTargetStr}
                    onChange={(e) => setNewGoalTargetStr(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={newGoalCurrency}
                    onChange={(e) => setNewGoalCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="PLN">PLN (zł)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    placeholder="e.g. Travel, Property, Reserve"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Linked Storage Account</label>
                <select
                  value={newGoalAccountId}
                  onChange={(e) => setNewGoalAccountId(e.target.value)}
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
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
