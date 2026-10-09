import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { exportTransactionsToCSV, parseCSVTransactions, formatMoney } from '../../utils/accounting';
import { X, Download, Upload, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Transaction } from '../../types/finance';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { transactions, accounts, importTransactions } = useFinance();
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [targetAccountId, setTargetAccountId] = useState(accounts[0]?.id || '');
  const [csvRawText, setCsvRawText] = useState('');
  const [parseResult, setParseResult] = useState<{
    valid: Omit<Transaction, 'id'>[];
    errors: string[];
    duplicateCount: number;
  } | null>(null);
  const [importedSuccessCount, setImportedSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const targetAccount = accounts.find((a) => a.id === targetAccountId);

  const handleDownloadExport = () => {
    const csvData = exportTransactionsToCSV(transactions, accounts);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stevari_ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSample = () => {
    const sample = `Date,Account,Payee,Category,Type,Amount,Currency,Notes,Shared
2026-10-09,"PKO BP Primary Checking","Żabka Mokotów",groceries,expense,24.80,PLN,"Coffee and snack",yes
2026-10-08,"PKO BP Primary Checking","Allegro Marketplace",entertainment,expense,189.00,PLN,"Books and headphones",no
2026-10-07,"Revolut Euro Travel & FX","Café Berlin",dining,expense,16.50,EUR,"Remote workspace coffee",yes
2026-10-06,"Wise UK Consulting Account","Client Consulting Payout",income_freelance,income,1200.00,GBP,"Design sprint payment",no`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'stevari_sample_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      validateCSV(text);
    };
    reader.readAsText(file);
  };

  const validateCSV = (text: string) => {
    if (!text.trim()) {
      setParseResult(null);
      return;
    }
    const result = parseCSVTransactions(text, transactions, targetAccountId, targetAccount?.currency || 'PLN');
    setParseResult(result);
    setImportedSuccessCount(null);
  };

  const handleCommitImport = () => {
    if (!parseResult || parseResult.valid.length === 0) return;
    const count = importTransactions(parseResult.valid);
    setImportedSuccessCount(count);
    setParseResult(null);
    setCsvRawText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl border border-slate-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">CSV Ledger Tools</h2>
            <p className="text-xs text-slate-500">Reliable data migration with verification & duplicate detection</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-[#0DAE9B] text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV Statements
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-[#0DAE9B] text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Clean Ledger
          </button>
        </div>

        <div className="mt-4 overflow-y-auto flex-1 space-y-4 pr-1">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-slate-900">Full Portable Ledger Export</p>
                <p>
                  Exports all {transactions.length} transactions across your {accounts.length} accounts.
                  Amounts are exported with exact decimals and currency codes for complete spreadsheet auditability.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleDownloadExport}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV ({transactions.length} records)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {importedSuccessCount !== null && (
                <div className="p-3 bg-[#D9F8EE] border border-[#0DAE9B]/30 rounded-xl flex items-center gap-2 text-xs text-[#102B3F]">
                  <CheckCircle2 className="w-4 h-4 text-[#0DAE9B] shrink-0" />
                  <span>
                    Successfully imported <strong>{importedSuccessCount} transactions</strong> into the ledger!
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Account</label>
                  <select
                    value={targetAccountId}
                    onChange={(e) => {
                      setTargetAccountId(e.target.value);
                      if (csvRawText) validateCSV(csvRawText);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Download Sample Template
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Choose CSV File</label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E9F3FF] file:text-[#3478F6] hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Or Paste CSV Text</label>
                <textarea
                  value={csvRawText}
                  onChange={(e) => {
                    setCsvRawText(e.target.value);
                    validateCSV(e.target.value);
                  }}
                  rows={4}
                  placeholder={`Date,Payee,Amount\n2026-10-09,"Biedronka",45.20\n2026-10-08,"Uber",22.50`}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0DAE9B]/30 focus:border-[#0DAE9B]"
                />
              </div>

              {parseResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-600">
                      Found <strong>{parseResult.valid.length}</strong> valid rows
                    </span>
                    {parseResult.duplicateCount > 0 && (
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {parseResult.duplicateCount} duplicate rows skipped
                      </span>
                    )}
                  </div>

                  {parseResult.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 space-y-1">
                      <div className="font-semibold">Formatting warnings ({parseResult.errors.length}):</div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {parseResult.errors.slice(0, 3).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parseResult.valid.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-700 mb-1.5">Import Preview (First 4 rows):</div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                              <th className="py-1.5 px-3">Date</th>
                              <th className="py-1.5 px-3">Payee</th>
                              <th className="py-1.5 px-3">Category</th>
                              <th className="py-1.5 px-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {parseResult.valid.slice(0, 4).map((row, idx) => (
                              <tr key={idx}>
                                <td className="py-1 px-3 text-slate-600">{row.date}</td>
                                <td className="py-1 px-3 font-sans text-slate-800">{row.payee}</td>
                                <td className="py-1 px-3 text-slate-500">{row.category}</td>
                                <td className="py-1 px-3 text-right font-medium">
                                  {formatMoney(row.amountMinor, row.originalCurrency)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          {activeTab === 'import' && parseResult && parseResult.valid.length > 0 && (
            <button
              type="button"
              onClick={handleCommitImport}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] rounded-lg transition-colors shadow-xs"
            >
              Commit {parseResult.valid.length} Transactions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
