import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode } from '../../types/finance';
import { parseInputToMinor, CURRENCY_SYMBOLS, convertMinor, formatMoney } from '../../utils/accounting';
import { X, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { accounts, recordTransfer, ratesPerEur } = useFinance();

  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('Savings & Reserve Transfer');

  if (!isOpen) return null;

  const fromAccount = accounts.find((a) => a.id === fromAccountId);
  const toAccount = accounts.find((a) => a.id === toAccountId);

  const fromCurrency: CurrencyCode = fromAccount ? fromAccount.currency : 'PLN';
  const toCurrency: CurrencyCode = toAccount ? toAccount.currency : 'PLN';

  const minor = parseInputToMinor(amountStr);
  const convertedToMinor = convertMinor(minor, fromCurrency, toCurrency, ratesPerEur);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (minor <= 0 || !fromAccountId || !toAccountId || fromAccountId === toAccountId) return;

    recordTransfer(fromAccountId, toAccountId, minor, fromCurrency, notes);
    onClose();
  };

  const isSameAccount = fromAccountId === toAccountId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D9F8EE] flex items-center justify-center text-[#0DAE9B]">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Internal Account Transfer</h2>
              <p className="text-xs text-slate-500">Double-entry ledger movement with zero-sum invariant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Source Account (From)</label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Destination Account (To)</label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} disabled={acc.id === fromAccountId}>
                    {acc.name} ({acc.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isSameAccount && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
              Source and destination accounts must be different.
            </p>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Transfer Amount in {fromCurrency} ({CURRENCY_SYMBOLS[fromCurrency]})
            </label>
            <input
              type="text"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 text-lg font-mono tabular-nums bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
              required
            />
          </div>

          {/* Cross-Currency Conversion Preview if different currencies */}
          {fromCurrency !== toCurrency && minor > 0 && (
            <div className="p-3 bg-[#E9F3FF] rounded-xl border border-blue-100 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Destination receives approx:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatMoney(convertedToMinor, toCurrency)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Converted via daily benchmark FX rate. Both original debit and credit entries will be recorded with reference IDs.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Transfer Memo / Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Allocation to emergency fund"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#0DAE9B] shrink-0 mt-0.5" />
            <span>
              <strong>Accounting Rule:</strong> Transfers create a linked debit and credit pair. They do not alter consolidated income or expense reports.
            </span>
          </div>

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
              disabled={isSameAccount || minor <= 0}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
            >
              Post Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
