import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode } from '../../types/finance';
import {
  CURRENCY_NAMES,
  CURRENCY_SYMBOLS,
  FX_RATE_PROVENANCE,
  FX_RATE_DATE,
  convertMinor,
  formatMoney,
  getExchangeRate,
} from '../../utils/accounting';
import { X, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_CURRENCIES: CurrencyCode[] = ['PLN', 'EUR', 'USD', 'GBP', 'NGN', 'ZAR'];

export const FxConverterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { ratesPerEur, baseCurrency } = useFinance();
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('PLN');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR');
  const [amountStr, setAmountStr] = useState('1000');

  if (!isOpen) return null;

  const rawAmount = parseFloat(amountStr) || 0;
  const fromMinor = Math.round(rawAmount * 100);
  const toMinor = convertMinor(fromMinor, fromCurrency, toCurrency, ratesPerEur);
  const currentRate = getExchangeRate(fromCurrency, toCurrency, ratesPerEur);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Multi-Currency & FX Engine</h2>
            <p className="text-xs text-slate-500">Transparent daily exchange rates & base valuation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          {/* Live Converter Sandbox */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Cross-Border Conversion Sandbox
            </div>
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">From</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm font-mono font-semibold bg-white border border-slate-200 rounded-lg"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                    className="px-2 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-5">
                <button
                  type="button"
                  onClick={() => {
                    const temp = fromCurrency;
                    setFromCurrency(toCurrency);
                    setToCurrency(temp);
                  }}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-2xs"
                  title="Swap currencies"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Receives / Valuation</label>
                <div className="flex gap-1.5 items-center">
                  <div className="w-full px-2.5 py-1.5 text-sm font-mono font-bold text-[#0DAE9B] bg-white border border-slate-200 rounded-lg">
                    {formatMoney(toMinor, toCurrency)}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                    className="px-2 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60 font-mono">
              <span>
                1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
              </span>
              <span>
                1 {toCurrency} = {(1 / currentRate).toFixed(4)} {fromCurrency}
              </span>
            </div>
          </div>

          {/* Rates Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">
                Current Rates relative to {baseCurrency} (Base Currency)
              </span>
              <span className="text-[11px] text-slate-400">Valuation Date: {FX_RATE_DATE}</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2 px-3">Currency</th>
                    <th className="py-2 px-3">Symbol</th>
                    <th className="py-2 px-3 text-right">Rate in {baseCurrency}</th>
                    <th className="py-2 px-3 text-right">Inverse Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {SUPPORTED_CURRENCIES.map((c) => {
                    const rate = getExchangeRate(c, baseCurrency, ratesPerEur);
                    return (
                      <tr key={c} className={c === baseCurrency ? 'bg-[#D9F8EE]/30' : ''}>
                        <td className="py-2 px-3 font-sans font-medium text-slate-900">
                          {CURRENCY_NAMES[c]}
                          {c === baseCurrency && (
                            <span className="ml-1.5 text-[10px] text-[#0DAE9B] font-bold">[BASE]</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-500">{CURRENCY_SYMBOLS[c]}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-800">
                          1 {c} = {rate.toFixed(4)} {baseCurrency}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-500">
                          1 {baseCurrency} = {(1 / rate).toFixed(4)} {c}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transparency & Governance Notice */}
          <div className="p-3 bg-[#F8FCFF] rounded-xl border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#3478F6] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-800">Rate Provenance & Invariant Policy</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Benchmark: {FX_RATE_PROVENANCE}. In accordance with the Stevari Money Dossier, transactions preserve
                their original nominal currency and amount. Converted valuations are transparently recomputed at base
                reporting dates rather than irreversibly mutating the ledger.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
