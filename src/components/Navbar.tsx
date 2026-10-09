import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { CurrencyCode, VisibilityMode } from '../types/finance';
import { CURRENCY_SYMBOLS } from '../utils/accounting';
import { Plus, ArrowRightLeft, FileSpreadsheet, Globe, FileText, Sparkles } from 'lucide-react';

interface Props {
  onOpenNewTransaction: () => void;
  onOpenTransfer: () => void;
  onOpenCsvModal: () => void;
  onOpenFxModal: () => void;
  onOpenDossierModal: () => void;
}

const SUPPORTED_CURRENCIES: CurrencyCode[] = ['PLN', 'EUR', 'USD', 'GBP', 'NGN', 'ZAR'];

export const Navbar: React.FC<Props> = ({
  onOpenNewTransaction,
  onOpenTransfer,
  onOpenCsvModal,
  onOpenFxModal,
  onOpenDossierModal,
}) => {
  const {
    currentView,
    setCurrentView,
    activeTab,
    setActiveTab,
    baseCurrency,
    setBaseCurrency,
    visibilityMode,
    setVisibilityMode,
  } = useFinance();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left focus:outline-hidden whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#0DAE9B] via-[#22C55E] to-[#3478F6] p-0.5 shadow-xs flex items-center justify-center">
            <div className="w-full h-full bg-[#102B3F] rounded-[7px] flex items-center justify-center">
              <span className="text-white font-extrabold text-sm tracking-tight">S</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-[#102B3F] group-hover:text-[#0DAE9B] transition-colors leading-none">
              Stevari Money
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Your money. Your future.
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single line, no wrapping) */}
        {currentView === 'landing' ? (
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Features
            </a>
            <a href="#multicurrency" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Multi-Currency
            </a>
            <a href="#forecast" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Forecast
            </a>
            <a href="#households" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              For Households
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Pricing
            </a>
            <button
              onClick={onOpenDossierModal}
              className="text-[#0DAE9B] hover:text-[#0b9786] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold"
            >
              <FileText className="w-3.5 h-3.5" />
              Research Dossier
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard' ? 'text-[#0DAE9B] font-bold border-b-2 border-[#0DAE9B] pb-1' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'ledger' ? 'text-[#0DAE9B] font-bold border-b-2 border-[#0DAE9B] pb-1' : ''
              }`}
            >
              Ledger
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'forecast' ? 'text-[#0DAE9B] font-bold border-b-2 border-[#0DAE9B] pb-1' : ''
              }`}
            >
              Forecast & Bills
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'budgets' ? 'text-[#0DAE9B] font-bold border-b-2 border-[#0DAE9B] pb-1' : ''
              }`}
            >
              Budgets & Goals
            </button>
            <button
              onClick={() => setActiveTab('household')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'household' ? 'text-[#0DAE9B] font-bold border-b-2 border-[#0DAE9B] pb-1' : ''
              }`}
            >
              Household
            </button>
          </nav>
        )}

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'landing' ? (
            <button
              onClick={() => setCurrentView('app')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Web App
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('landing')}
                className="hidden sm:inline-flex px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Landing Site
              </button>
              <button
                onClick={onOpenNewTransaction}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-bar for App workspace controls (Currency & Privacy filter) */}
      {currentView === 'app' && (
        <div className="bg-[#F8FCFF] border-t border-slate-100 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Currency selector & FX tools */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Base Currency:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
                {SUPPORTED_CURRENCIES.map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setBaseCurrency(cur)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                      baseCurrency === cur
                        ? 'bg-[#0DAE9B] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {cur} ({CURRENCY_SYMBOLS[cur]})
                  </button>
                ))}
              </div>
              <button
                onClick={onOpenFxModal}
                className="text-[11px] font-medium text-[#3478F6] hover:underline flex items-center gap-1 ml-1"
                title="View FX Rates & Benchmarks"
              >
                <Globe className="w-3 h-3" />
                FX Rates
              </button>
            </div>

            {/* Quick Actions & Privacy Mode */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
                {(
                  [
                    { id: 'all', label: 'All Accounts' },
                    { id: 'shared_only', label: 'Shared Only' },
                    { id: 'private_only', label: 'Private Only' },
                  ] as { id: VisibilityMode; label: string }[]
                ).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setVisibilityMode(mode.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      visibilityMode === mode.id
                        ? 'bg-[#102B3F] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenTransfer}
                  className="px-2.5 py-1 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md font-medium text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3 text-[#0DAE9B]" />
                  Transfer
                </button>
                <button
                  onClick={onOpenCsvModal}
                  className="px-2.5 py-1 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md font-medium text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <FileSpreadsheet className="w-3 h-3 text-[#3478F6]" />
                  CSV Tools
                </button>
                <button
                  onClick={onOpenDossierModal}
                  className="px-2.5 py-1 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md font-medium text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
