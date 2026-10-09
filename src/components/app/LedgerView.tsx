import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, CategoryId, TransactionType } from '../../types/finance';
import { formatMoney, convertMinor } from '../../utils/accounting';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
  Users,
} from 'lucide-react';

interface Props {
  onOpenNewTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onOpenCsvModal: () => void;
  onOpenTransfer: () => void;
}

export const LedgerView: React.FC<Props> = ({
  onOpenNewTransaction,
  onEditTransaction,
  onOpenCsvModal,
  onOpenTransfer,
}) => {
  const {
    transactions,
    accounts,
    baseCurrency,
    ratesPerEur,
    deleteTransaction,
    addTransaction,
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredTransactions = transactions.filter((tx) => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchPayee = tx.payee.toLowerCase().includes(term);
      const matchNotes = (tx.notes || '').toLowerCase().includes(term);
      if (!matchPayee && !matchNotes) return false;
    }
    // Account filter
    if (selectedAccountId !== 'all' && tx.accountId !== selectedAccountId) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
      return false;
    }
    // Type filter
    if (selectedType !== 'all' && tx.type !== selectedType) {
      return false;
    }
    return true;
  });

  const handleDuplicate = (tx: Transaction) => {
    const today = new Date().toISOString().split('T')[0];
    addTransaction({
      accountId: tx.accountId,
      date: today,
      payee: `${tx.payee} (Copy)`,
      category: tx.category,
      type: tx.type,
      amountMinor: tx.amountMinor,
      originalCurrency: tx.originalCurrency,
      notes: tx.notes,
      isShared: tx.isShared,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Transactional Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict double-entry preservation with original currency tracking and converted valuations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCsvModal}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            CSV Import/Export
          </button>
          <button
            onClick={onOpenTransfer}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#0DAE9B]" />
            Internal Transfer
          </button>
          <button
            onClick={onOpenNewTransaction}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payees, notes, or descriptions..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
            />
          </div>

          {/* Account selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30"
            >
              <option value="all">All Accounts ({accounts.length})</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Type selector */}
          <div className="sm:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Incomes</option>
              <option value="transfer">Transfers</option>
              <option value="refund">Refunds</option>
            </select>
          </div>

          {/* Category selector */}
          <div className="sm:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30"
            >
              <option value="all">All Categories</option>
              <option value="housing">Housing</option>
              <option value="groceries">Groceries</option>
              <option value="utilities">Utilities</option>
              <option value="dining">Dining</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="software">Software</option>
              <option value="income_salary">Salary</option>
              <option value="income_freelance">Freelance</option>
              <option value="savings_transfer">Savings Transfer</option>
            </select>
          </div>
        </div>

        {/* Filter metadata count */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filteredTransactions.length}</strong> of {transactions.length} records
          </span>
          <span className="font-mono">Base Valuation: {baseCurrency}</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Payee & Notes</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Privacy</th>
                <th className="py-3 px-4 text-right">Original Amount</th>
                <th className="py-3 px-4 text-right">In {baseCurrency}</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const account = accounts.find((a) => a.id === tx.accountId);
                  const isPositive = tx.amountMinor > 0;
                  const inBaseMinor = convertMinor(
                    tx.amountMinor,
                    tx.originalCurrency,
                    baseCurrency,
                    ratesPerEur
                  );

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Account */}
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-medium">
                        <span className="inline-block max-w-[130px] truncate" title={account?.name}>
                          {account?.name || 'Unknown Account'}
                        </span>
                      </td>

                      {/* Payee & Notes */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{tx.payee}</div>
                        {tx.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.notes}</div>}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          {tx.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Privacy */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {tx.isShared ? (
                          <span
                            className="inline-flex items-center text-[#0DAE9B]"
                            title="Shared with household"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center text-slate-400"
                            title="Private to account owner"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      {/* Original Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                        <span
                          className={
                            tx.type === 'transfer'
                              ? 'text-blue-600'
                              : isPositive
                              ? 'text-emerald-600'
                              : 'text-slate-900'
                          }
                        >
                          {formatMoney(tx.amountMinor, tx.originalCurrency)}
                        </span>
                      </td>

                      {/* Converted Amount */}
                      <td className="py-3 px-4 text-right font-mono whitespace-nowrap tabular-nums text-slate-500">
                        {formatMoney(inBaseMinor, baseCurrency)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(tx)}
                            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Duplicate Entry"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
