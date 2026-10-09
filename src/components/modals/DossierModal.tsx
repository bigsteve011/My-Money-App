import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, AlertTriangle, FileText, Compass, Shield, BarChart3, Database } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DossierModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'summary' | 'audit' | 'accounting' | 'gtm' | 'gdpr'>('summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D9F8EE] flex items-center justify-center text-[#0DAE9B]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Stevari Money Product Dossier & Market Strategy
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Version 1.0</span>
                <span>·</span>
                <span>October 2026</span>
                <span>·</span>
                <span>Poland & EU Multi-Currency Beachhead</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 pt-4 border-b border-slate-100 pb-3 overflow-x-auto">
          {[
            { id: 'summary', label: '1. Executive Brief & Positioning', icon: Compass },
            { id: 'audit', label: '2. Prototype Audit & Fixes', icon: AlertTriangle },
            { id: 'accounting', label: '3. Accounting Engine & Invariants', icon: Database },
            { id: 'gtm', label: '4. GTM & Segments', icon: BarChart3 },
            { id: 'gdpr', label: '5. GDPR & Privacy-by-Design', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeSection === tab.id
                    ? 'bg-[#0DAE9B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Viewer */}
        <div className="mt-4 overflow-y-auto flex-1 pr-2 space-y-5 text-slate-700 text-sm leading-relaxed">
          {activeSection === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F8FCFF] rounded-xl border border-blue-100">
                <h3 className="font-bold text-slate-900 text-base">Executive Decision Brief</h3>
                <p className="mt-1 text-slate-600 text-xs">
                  Stevari Money is a personal financial planning companion for internationally mobile professionals and
                  households in Poland and the European Union who manage commitments in multiple currencies.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900">Brand Tagline:</span>
                    <p className="text-[#0DAE9B] font-bold">Your money. Your future.</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900">Core Proposition:</span>
                    <p className="text-slate-800">Know where your money stands — and what comes next.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">The Defensible Product Wedge</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="font-bold text-[#0DAE9B]">1. Multi-Currency Accounting</div>
                    <p className="mt-1 text-slate-600">
                      Preserves native transaction currency with explicit rate provenance. Solves the YNAB limitation
                      of single-currency budgets.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="font-bold text-[#3478F6]">2. Salary-to-Salary Forecasting</div>
                    <p className="mt-1 text-slate-600">
                      Forward-looking upcoming cash flow calendar that calculates actual Safe-to-Spend buffer rather
                      than purely backward-looking pie charts.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="font-bold text-[#102B3F]">3. Household Privacy Model</div>
                    <p className="mt-1 text-slate-600">
                      Enables couples and shared apartments to plan joint commitments while preserving autonomy over
                      personal private accounts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audit' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Audit of Early Prototype & Production Resolutions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between earlier prototype defects identified in Section 7 of the dossier and the production engine.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Area</th>
                      <th className="py-2.5 px-3">Identified Defect</th>
                      <th className="py-2.5 px-3">Stevari Engine Resolution</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Multi-Currency Sums</td>
                      <td className="py-2.5 px-3 text-red-600">Summed raw multi-currency numbers without converting</td>
                      <td className="py-2.5 px-3 text-slate-700">Triangulated conversion with daily benchmark FX rates table</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">Resolved</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Account Transfers</td>
                      <td className="py-2.5 px-3 text-red-600">Treated transfers as regular expense or income</td>
                      <td className="py-2.5 px-3 text-slate-700">Paired double-entry linking netting to zero net-worth impact</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">Resolved</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Float Precision</td>
                      <td className="py-2.5 px-3 text-red-600">Standard JS/Dart binary floating point rounding bugs</td>
                      <td className="py-2.5 px-3 text-slate-700">Integer minor units (grosze / cents) arithmetic engine</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">Resolved</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Persistence</td>
                      <td className="py-2.5 px-3 text-red-600">In-memory only, lost on browser/app reload</td>
                      <td className="py-2.5 px-3 text-slate-700">Local persistent store + CSV backup and restore workflow</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">Resolved</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Bills & Matching</td>
                      <td className="py-2.5 px-3 text-red-600">Static toggle without recurrence or ledger recording</td>
                      <td className="py-2.5 px-3 text-slate-700">Due day recurrence + auto ledger expense recording</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">Resolved</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Household Privacy</td>
                      <td className="py-2.5 px-3 text-red-600">Static screen without user isolation or splits</td>
                      <td className="py-2.5 px-3 text-slate-700">Shared vs Private filtering and 50/50 balance settlement</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">Resolved</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'accounting' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Accounting Rules & Core Invariants</h3>
                <p className="text-xs text-slate-500 mt-0.5">Section 9 specification for reliable personal finance ledgers</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Invariant 1: Transfer Zero-Sum Rule</span>
                  <p className="text-slate-600 mt-1">
                    An internal transfer between Piotr’s PKO Checking account and Santander Savings creates a paired
                    outflow and inflow. In consolidated reporting, this transfer must net to exactly 0 (excluding explicit
                    bank fees).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Invariant 2: Original Currency Preservation</span>
                  <p className="text-slate-600 mt-1">
                    A transaction recorded in GBP or EUR must retain its original currency and nominal minor unit count.
                    Converted values into PLN or EUR are calculated on-the-fly using the rate active for the reporting period.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Invariant 3: Safe-to-Spend Computation</span>
                  <p className="text-slate-600 mt-1">
                    Safe-to-spend is defined as: <code>(Liquid Available Funds − Unpaid Mandatory Bills before next Payday) ÷ Days until Payday</code>.
                    This prevents overspending early in the billing cycle.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'gtm' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Go-to-Market Strategy & Audience Beachhead</h3>
                <p className="text-xs text-slate-500 mt-0.5">Focusing on high-trust early cohorts before wide consumer marketing</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Segment A: Cross-Border Expats</span>
                  <p className="mt-1 text-slate-600">
                    Living in Poland with income or obligations in EUR, USD, GBP or NGN. Highest willingness to pay for
                    correct multi-currency accounting.
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Segment B: Modern Couples</span>
                  <p className="mt-1 text-slate-600">
                    Cohabitating couples who split rent and utilities while maintaining individual discretionary budgets.
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Segment C: Spreadsheet Migrants</span>
                  <p className="mt-1 text-slate-600">
                    People fatigued by manual Excel/Sheets maintenance who demand full CSV exportability and zero lock-in.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#D9F8EE]/40 border border-[#0DAE9B]/30 rounded-xl text-xs text-slate-700">
                <span className="font-bold text-[#102B3F]">Pricing Hypothesis (Price Discovery Only):</span>
                <p className="mt-1">
                  • <strong>Free Tier:</strong> Multi-currency accounts, manual entries, CSV import/export, essential budgets.
                  <br />
                  • <strong>Plus Tier (€4–€6/mo):</strong> Salary-to-salary cash flow forecast, advanced multi-currency analytics.
                  <br />
                  • <strong>Household Tier (€8–€11/mo):</strong> Granular shared vs private accounts, automated split settlement.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'gdpr' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">GDPR & Privacy-by-Design Architecture</h3>
                <p className="text-xs text-slate-500 mt-0.5">Compliance with EDPB Guidelines 4/2019 on Article 25</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Data Minimisation:</span>
                    <p className="text-slate-600 mt-0.5">
                      No unnecessary personal identifiers stored. Account numbers are masked (•••• 4920) by default.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Household Isolation:</span>
                    <p className="text-slate-600 mt-0.5">
                      Private accounts are never exposed to household members without explicit cryptographic permission.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Data Portability & Right to Erasure:</span>
                    <p className="text-slate-600 mt-0.5">
                      Full one-click CSV ledger export and one-click local memory wipe. Never sell financial records to brokers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3 text-xs text-slate-500">
          <span>Stevari Money Research Dossier · Ref: 2026-10-09</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
