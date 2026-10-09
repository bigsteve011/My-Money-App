import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType, CategoryId, CurrencyCode } from '../../types/finance';
import { parseInputToMinor, CURRENCY_SYMBOLS } from '../../utils/accounting';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTransaction?: Transaction;
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'housing', label: 'Housing & Rent' },
  { id: 'groceries', label: 'Groceries & Supermarket' },
  { id: 'utilities', label: 'Utilities & Bills' },
  { id: 'dining', label: 'Dining & Cafes' },
  { id: 'transport', label: 'Transit & Fuel' },
  { id: 'health', label: 'Healthcare & Fitness' },
  { id: 'entertainment', label: 'Leisure & Travel' },
  { id: 'family_support', label: 'Family Cross-Border' },
  { id: 'software', label: 'Software & Cloud' },
  { id: 'income_salary', label: 'Salary Inflow' },
  { id: 'income_freelance', label: 'Consulting / Freelance' },
  { id: 'other', label: 'Other General' },
];

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, initialTransaction }) => {
  const { accounts, addTransaction, editTransaction } = useFinance();

  const [accountId, setAccountId] = useState(initialTransaction?.accountId || accounts[0]?.id || '');
  const [payee, setPayee] = useState(initialTransaction?.payee || '');
  const [type, setType] = useState<TransactionType>(initialTransaction?.type || 'expense');
  const [amountStr, setAmountStr] = useState(
    initialTransaction ? (Math.abs(initialTransaction.amountMinor) / 100).toFixed(2) : ''
  );
  const [category, setCategory] = useState<CategoryId>(initialTransaction?.category || 'groceries');
  const [date, setDate] = useState(initialTransaction?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialTransaction?.notes || '');
  const [isShared, setIsShared] = useState(initialTransaction?.isShared ?? true);

  if (!isOpen) return null;

  const currentAccount = accounts.find((a) => a.id === accountId);
  const currency: CurrencyCode = currentAccount ? currentAccount.currency : 'PLN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minor = parseInputToMinor(amountStr);
    if (minor <= 0) return;

    const signedMinor = type === 'expense' ? -minor : minor;

    if (initialTransaction) {
      editTransaction(initialTransaction.id, {
        accountId,
        payee,
        type,
        amountMinor: signedMinor,
        originalCurrency: currency,
        category,
        date,
        notes,
        isShared,
      });
    } else {
      addTransaction({
        accountId,
        payee,
        type,
        amountMinor: signedMinor,
        originalCurrency: currency,
        category,
        date,
        notes,
        isShared,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {initialTransaction ? 'Edit Transaction' : 'Record New Transaction'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Accurate double-entry recording in native currency</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Segmented Control */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            {(['expense', 'income', 'refund'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                  type === t
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Account Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Account & Native Currency</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {acc.currency} ({acc.institution})
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Amount ({CURRENCY_SYMBOLS[currency]})
              </label>
              <input
                type="text"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-base font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
              <div className="px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                {currency}
              </div>
            </div>
          </div>

          {/* Payee / Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Payee or Entity</label>
            <input
              type="text"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              placeholder="e.g. Biedronka, Apple, Employer"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
              required
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Tags (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Monthly groceries, invoice ref #491"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
            />
          </div>

          {/* Household Sharing Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="text-xs font-semibold text-slate-900">Household Visibility</div>
              <div className="text-[11px] text-slate-500">Allow partner to view in shared household plan</div>
            </div>
            <button
              type="button"
              onClick={() => setIsShared(!isShared)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isShared ? 'bg-[#0DAE9B]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  isShared ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors shadow-xs"
            >
              {initialTransaction ? 'Save Changes' : 'Confirm Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
