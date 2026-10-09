import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  formatMoney,
  convertMinor,
  CURRENCY_SYMBOLS,
  FX_RATE_PROVENANCE,
} from '../../utils/accounting';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  Compass,
  FileSpreadsheet,
  BookOpen,
  Send,
  HelpCircle,
  TrendingUp,
  Lock,
} from 'lucide-react';

interface Props {
  onOpenDossier: () => void;
  onOpenNewTransaction: () => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenDossier }) => {
  const { setCurrentView, baseCurrency, accounts, transactions, ratesPerEur } = useFinance();
  const [demoAmount, setDemoAmount] = useState('1000');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const parsedDemo = parseFloat(demoAmount) || 0;
  const demoPln = Math.round(parsedDemo * 100);
  const demoEur = convertMinor(demoPln, 'PLN', 'EUR', ratesPerEur);
  const demoGbp = convertMinor(demoPln, 'PLN', 'GBP', ratesPerEur);
  const demoUsd = convertMinor(demoPln, 'PLN', 'USD', ratesPerEur);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does Stevari Money handle multiple currencies differently from YNAB?',
      a: 'Unlike traditional budget apps that force all accounts into a single currency or miscalculate exchange differences, Stevari Money preserves the native currency and exact minor unit amounts for every transaction. It uses daily transparent benchmark rates (ECB & NBP) to dynamically project consolidated net worth and budgets.',
    },
    {
      q: 'Can couples keep individual accounts private in a shared household?',
      a: 'Yes! Household plans support granular visibility. You can mark accounts and transactions as "Shared" (e.g. joint rent, shared groceries) while keeping personal checking, investment, or discretionary spending "Private". Private records are completely masked from other household members.',
    },
    {
      q: 'Does Stevari Money require connecting to live bank APIs?',
      a: 'No. Based on our user research with privacy-conscious professionals in Poland and Europe, Stevari prioritises reliable manual entry and robust CSV statement imports. This guarantees complete control without sharing banking credentials or depending on fragile scraping.',
    },
    {
      q: 'What is the "Safe-to-Spend" calculation?',
      a: 'Instead of only looking at historical spending in rear-view pie charts, our salary-to-salary engine looks ahead to your next payday. It subtracts mandatory upcoming bills (rent, utilities, debt) from your available cash and divides the remaining buffer across the days until payday.',
    },
    {
      q: 'How does Stevari comply with GDPR Privacy by Design?',
      a: 'We follow EDPB Guidelines 4/2019 Article 25. All account numbers are masked by default, private records never cross household boundaries, full one-click CSV export is always available, and we strictly prohibit selling or monetising personal financial data.',
    },
  ];

  return (
    <div className="bg-[#F8FCFF] text-[#102B3F] selection:bg-[#D9F8EE] selection:text-[#0DAE9B]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0DAE9B] bg-[#D9F8EE]/80 px-3 py-1 rounded-full border border-[#0DAE9B]/20">
                <span className="w-2 h-2 rounded-full bg-[#0DAE9B]"></span>
                <span>Production Beta Available · Warsaw & Central Europe Beachhead</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#102B3F] leading-[1.12] text-balance">
                Know where your money stands — and what comes next.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                A personal financial planning companion built for internationally mobile professionals and
                households. Plan forward, track multi-currency accounts with exact ledger accounting, and collaborate
                seamlessly without sacrificing personal privacy.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('app')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Interactive App
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenDossier}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#3478F6]" />
                  Read October 2026 Dossier
                </button>
              </div>

              {/* Trust & Proof Metadata */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                  <span>PLN · EUR · GBP · USD · NGN · ZAR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                  <span>Salary-to-Salary Forecasting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                  <span>Zero-Sum Double Entry Invariants</span>
                </div>
              </div>
            </div>

            {/* Right Media / Preview Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                <img
                  src="/src/assets/images/hero_finance_lifestyle_1791583247737.jpg"
                  alt="Professional managing multi-currency personal finances"
                  className="w-full h-80 object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Realistic UI Overlays */}
                <div className="p-5 bg-white border-t border-slate-100 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Consolidated Net Worth (PLN)
                      </div>
                      <div className="text-xl font-bold font-mono text-[#102B3F]">
                        {formatMoney(6250000, 'PLN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-medium text-slate-400">Next Payday In</div>
                      <div className="text-sm font-bold text-[#0DAE9B] font-mono">14 Days (Nov 1)</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8FCFF] rounded-xl border border-blue-50 text-xs flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Safe-to-Spend Daily Pace:</span>
                    <span className="font-mono font-bold text-[#3478F6]">185.00 zł / day</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400">PKO BP</div>
                      <div className="font-mono font-semibold text-slate-800">14 850 zł</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400">Revolut</div>
                      <div className="font-mono font-semibold text-[#0DAE9B]">€3 200</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400">Wise UK</div>
                      <div className="font-mono font-semibold text-[#3478F6]">£1 450</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Value Pillars Section (Understand / Plan / Grow / Share) — Visual-First Architecture */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0DAE9B] uppercase tracking-wider">
              Engineered For Financial Clarity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102B3F] tracking-tight text-balance">
              Four pillars to understand today and plan tomorrow.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Stevari Money replaces disconnected banking apps and fragile spreadsheets with an integrated, mathematically sound system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {/* Pillar 01: Understand — Visual Multi-Currency Stack & Triangulation */}
            <div className="p-5 rounded-2xl bg-[#F8FCFF] border border-slate-200/80 hover:border-[#0DAE9B]/50 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D9F8EE] flex items-center justify-center text-[#0DAE9B]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0DAE9B] bg-white px-2 py-0.5 rounded-md border border-[#0DAE9B]/20">
                    Triangulated
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">01. Understand</h3>
                <div className="text-[11px] text-slate-500 mb-4 font-medium">Multi-Currency Ledger</div>

                {/* Visual Widget: Multi-Currency Stacks */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-[#3478F6]"></span> Revolut EUR
                    </span>
                    <span className="font-mono font-bold text-slate-900">€3 200</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-[#102B3F]"></span> Wise GBP
                    </span>
                    <span className="font-mono font-bold text-slate-900">£1 450</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-[#0DAE9B]"></span> PKO BP PLN
                    </span>
                    <span className="font-mono font-bold text-slate-900">14 850 zł</span>
                  </div>

                  {/* Flow Arrow & Consolidated Net Worth Output */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-[#0DAE9B] font-semibold">
                      <ArrowRight className="w-3 h-3" />
                      <span>Net Worth</span>
                    </div>
                    <span className="font-mono font-extrabold text-[#102B3F] text-xs">
                      62 500 zł
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>ECB 4.285 Benchmark</span>
                <span className="text-[#0DAE9B] font-semibold">0% Precision Loss</span>
              </div>
            </div>

            {/* Pillar 02: Plan Ahead — Visual Salary-to-Salary Runway Timeline */}
            <div className="p-5 rounded-2xl bg-[#F8FCFF] border border-slate-200/80 hover:border-[#3478F6]/50 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E9F3FF] flex items-center justify-center text-[#3478F6]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3478F6] bg-white px-2 py-0.5 rounded-md border border-[#3478F6]/20">
                    Payday Runway
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">02. Plan Ahead</h3>
                <div className="text-[11px] text-slate-500 mb-4 font-medium">Salary-to-Salary Forecast</div>

                {/* Visual Widget: Safe to Spend & Timeline Gauge */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs space-y-3">
                  <div className="p-2 bg-[#F8FCFF] rounded-lg border border-blue-100 text-center">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Safe-to-Spend Daily Buffer
                    </div>
                    <div className="font-mono text-lg font-extrabold text-[#3478F6] mt-0.5">
                      185.00 zł <span className="text-[10px] font-normal text-slate-500">/ day</span>
                    </div>
                  </div>

                  {/* Visual timeline milestone ticks */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Oct 18 Gym
                      </span>
                      <span className="font-mono font-medium text-amber-700">-360 zł</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Oct 28 PGE
                      </span>
                      <span className="font-mono font-medium text-amber-700">-240 zł</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-slate-900 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Nov 1 Salary
                      </span>
                      <span className="font-mono text-emerald-700">+16 500 zł</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>14 Days to Payday</span>
                <span className="text-emerald-600 font-semibold">Positive Runway</span>
              </div>
            </div>

            {/* Pillar 03: Grow Reserves — Visual Real Goals with Progress Rings & Invariant Movements */}
            <div className="p-5 rounded-2xl bg-[#F8FCFF] border border-slate-200/80 hover:border-[#10B981]/50 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Real Reserves
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">03. Grow Reserves</h3>
                <div className="text-[11px] text-slate-500 mb-4 font-medium">Goal-Linked Transfers</div>

                {/* Visual Widget: Goal progress bars & vault movement */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>Emergency Runway</span>
                      <span className="font-mono font-bold text-[#10B981]">70%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10B981] rounded-full w-[70%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>42 000 zł</span>
                      <span>Target: 60 000 zł</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>Spain Vacation</span>
                      <span className="font-mono font-bold text-[#3478F6]">68%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3478F6] rounded-full w-[68%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>€2 400</span>
                      <span>Target: €3 500</span>
                    </div>
                  </div>

                  {/* Ledger-Backed Badge */}
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Auto-Transfer</span>
                    <span className="font-mono font-bold text-slate-800">+3 000 zł / mo</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Vault: Santander HYS</span>
                <span className="text-emerald-600 font-semibold">Invariant Verified</span>
              </div>
            </div>

            {/* Pillar 04: Share & Protect — Visual Shared vs Private Split Matrix */}
            <div className="p-5 rounded-2xl bg-[#F8FCFF] border border-slate-200/80 hover:border-[#F59E0B]/50 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                    Granular Privacy
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">04. Share & Protect</h3>
                <div className="text-[11px] text-slate-500 mb-4 font-medium">Household Visibility Matrix</div>

                {/* Visual Widget: Shared vs Private compartments */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs space-y-2.5">
                  {/* Shared Compartment */}
                  <div className="p-2 bg-[#D9F8EE]/40 rounded-lg border border-[#0DAE9B]/20">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#102B3F] mb-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#0DAE9B]" /> Shared Joint
                      </span>
                      <span className="text-[#0DAE9B]">50/50 Split</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 flex justify-between">
                      <span>Apartment Rent</span>
                      <span className="font-bold">4 200 zł</span>
                    </div>
                  </div>

                  {/* Private Vault Compartment */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" /> Private Vault
                      </span>
                      <span className="text-slate-400 font-normal">Encrypted</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 flex justify-between">
                      <span>Wise UK (£1,450)</span>
                      <span className="text-slate-400">Masked</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Piotr & Anna</span>
                <span className="text-slate-600 font-semibold">EDPB DPbDD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Currency Architecture Story */}
      <section id="multicurrency" className="py-20 bg-[#F8FCFF] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual representation */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                <img
                  src="/src/assets/images/multicurrency_global_mobility_1791583270075.jpg"
                  alt="International multi-currency banking and travel planning"
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Live Interactive Cross-Currency Demo</span>
                    <span className="text-[11px] text-[#0DAE9B]">{FX_RATE_PROVENANCE}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] text-slate-500 font-medium">
                      Enter amount in PLN to test instant triangulated conversion:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={demoAmount}
                        onChange={(e) => setDemoAmount(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
                      />
                      <span className="px-3 py-1.5 text-xs font-bold bg-slate-100 rounded-lg flex items-center">
                        PLN (zł)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Euro (EUR)</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {formatMoney(demoEur, 'EUR')}
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">British Pound</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {formatMoney(demoGbp, 'GBP')}
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">US Dollar</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {formatMoney(demoUsd, 'USD')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy & Explanation */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold text-[#3478F6] uppercase tracking-wider">
                Solving A Foundational Pain Point
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102B3F] tracking-tight text-balance">
                One financial life. Multiple currencies. True mathematical precision.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Most budgeting software forces you to pick one national currency. If you earn in GBP from remote clients,
                pay rent in Warsaw in Polish Złoty (PLN), and save in EUR on Revolut, traditional tools break down.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Native Currency Preservation:</span>
                    <p className="text-slate-600 mt-0.5">
                      We never corrupt your raw transaction data by converting it into a permanent fake number. A €150 flight
                      stays €150 forever.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Transparent Daily Benchmark Rates:</span>
                    <p className="text-slate-600 mt-0.5">
                      Reports and net worth valuations reference genuine European Central Bank and National Bank of Poland mid-market fixes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forecasting & Next-Payday Showcase */}
      <section id="forecast" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0DAE9B] uppercase tracking-wider">
              Cash-Flow Forecasting Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102B3F] tracking-tight text-balance">
              Salary-to-salary forecasting that prevents mid-month surprises.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Rear-view charts tell you where your money went last month. Stevari Money tells you what will happen before next payday.
            </p>
          </div>

          <div className="mt-12 bg-[#F8FCFF] rounded-2xl p-6 sm:p-8 border border-slate-200/80 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-medium">Forecast Period</span>
                <div className="text-base font-bold text-slate-900">Today → 1 November Payday (14 Days Ahead)</div>
              </div>
              <div className="flex gap-4 text-right">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Mandatory Bills Due</span>
                  <div className="text-sm font-mono font-bold text-slate-900">689.99 zł</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Safe-to-Spend Daily Buffer</span>
                  <div className="text-sm font-mono font-bold text-[#0DAE9B]">185.00 zł / day</div>
                </div>
              </div>
            </div>

            {/* Illustrative timeline strip */}
            <div className="mt-6 space-y-3">
              <div className="text-xs font-semibold text-slate-700">Upcoming Obligations Timeline:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>Oct 14 · Orange Fiber</span>
                    <span className="font-bold text-slate-700">89.00 zł</span>
                  </div>
                  <div className="mt-2 text-slate-800 font-medium">Projected Buffer: 14 761 zł</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>Oct 18 · Zdrofit Gym Dual</span>
                    <span className="font-bold text-slate-700">360.00 zł</span>
                  </div>
                  <div className="mt-2 text-slate-800 font-medium">Projected Buffer: 14 401 zł</div>
                </div>

                <div className="p-3 bg-[#D9F8EE]/50 rounded-xl border border-[#0DAE9B]/30">
                  <div className="flex justify-between items-center text-[#0DAE9B] text-[11px] font-bold">
                    <span>Nov 1 · TechCorp Salary</span>
                    <span>+16 500 zł</span>
                  </div>
                  <div className="mt-2 text-[#102B3F] font-bold">New Period Balance: 30 901 zł</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Household Collaboration Section */}
      <section id="households" className="py-20 bg-[#F8FCFF] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Copy */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-[#0DAE9B] uppercase tracking-wider">
                Couples & Modern Households
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102B3F] tracking-tight text-balance">
                Plan together. Keep the right things private.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Couples need to coordinate shared apartment rent, utilities, and grocery runs without losing personal financial independence.
                Stevari gives you clear shared views while keeping personal savings, hobbies, and gifts private.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-[#0DAE9B]">Shared Household Mode</div>
                  <p className="text-slate-600 mt-1">
                    Joint bills, shared grocery splits, and family vacation goals visible to both partners.
                  </p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-[#102B3F]">Private Vault Mode</div>
                  <p className="text-slate-600 mt-1">
                    Consulting accounts, private investments, and individual discretion hidden from joint ledger.
                  </p>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                <img
                  src="/src/assets/images/household_finance_couple_1791583259860.jpg"
                  alt="Couple collaborating on household budgeting"
                  className="w-full h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0DAE9B] uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102B3F] tracking-tight text-balance">
              Simple, ethical plans. No ads. No data selling.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Tested against European price discovery hypotheses (€3–€11/month). Free forever tier for essential manual tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Starter</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">€0</div>
                <div className="text-xs text-slate-500 mt-0.5">Free forever</div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Unlimited manual accounts & currencies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Double-entry ledger & zero-sum transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Full CSV statement import & export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Essential monthly category budgets</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setCurrentView('app')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Start Free Today
                </button>
              </div>
            </div>

            {/* Plus */}
            <div className="p-6 rounded-2xl bg-[#F8FCFF] border-2 border-[#0DAE9B] shadow-lg flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0DAE9B] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-bold text-[#0DAE9B] uppercase tracking-wider">Stevari Plus</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                  €5<span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Billed monthly or €48/yr (approx 22 zł/mo)</div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Everything in Starter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Salary-to-salary cash flow forecasting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Safe-to-spend daily pace alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
                    <span>Multi-currency portfolio analytics</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setCurrentView('app')}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-xl transition-colors shadow-xs"
                >
                  Try Plus in Demo
                </button>
              </div>
            </div>

            {/* Household */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-[#3478F6] uppercase tracking-wider">Household Plan</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                  €9<span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">For 2+ partners (approx 39 zł/mo)</div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3478F6]" />
                    <span>Everything in Plus for both partners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3478F6]" />
                    <span>Granular Shared vs Private account visibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3478F6]" />
                    <span>Joint expense split & settlement calculator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3478F6]" />
                    <span>Priority early feature access</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setCurrentView('app')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Explore Household Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-[#F8FCFF] border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-[#0DAE9B] uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-[#102B3F] tracking-tight">Got questions? We have clear answers.</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-[#102B3F] flex justify-between items-center hover:text-[#0DAE9B] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 font-mono text-base">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Enrollment & Waitlist Form */}
      <section className="py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102B3F]">
            Join the Warsaw & EU Closed Beta Cohort
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            We are admitting 50–100 initial households managing cross-border finances. Receive private product updates,
            feedback sessions, and direct roadmap influence.
          </p>

          {waitlistSubmitted ? (
            <div className="p-4 bg-[#D9F8EE] border border-[#0DAE9B]/30 rounded-xl text-xs text-[#102B3F] font-medium flex items-center justify-center gap-2 max-w-md mx-auto">
              <CheckCircle2 className="w-4 h-4 text-[#0DAE9B]" />
              <span>Thank you! Your spot in the beta evaluation cohort has been reserved.</span>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter your email (e.g. piotr@domain.com)"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Join Waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="py-12 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Stevari Money</span>
            <span>—</span>
            <span>Your money. Your future.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <button onClick={() => setCurrentView('app')} className="hover:text-slate-900 transition-colors">
              Open App
            </button>
            <button onClick={onOpenDossier} className="hover:text-slate-900 transition-colors">
              Product Dossier
            </button>
            <span>EDPB GDPR Article 25 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
