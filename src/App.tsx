/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/app/DashboardView';
import { LedgerView } from './components/app/LedgerView';
import { ForecastBillsView } from './components/app/ForecastBillsView';
import { BudgetsGoalsView } from './components/app/BudgetsGoalsView';
import { HouseholdView } from './components/app/HouseholdView';
import { TransactionModal } from './components/modals/TransactionModal';
import { TransferModal } from './components/modals/TransferModal';
import { CsvModal } from './components/modals/CsvModal';
import { FxConverterModal } from './components/modals/FxConverterModal';
import { DossierModal } from './components/modals/DossierModal';
import { Transaction } from './types/finance';

const AppContent: React.FC = () => {
  const { currentView, activeTab } = useFinance();

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | undefined>(undefined);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isFxModalOpen, setIsFxModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  const handleOpenNewTransaction = () => {
    setEditingTx(undefined);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#102B3F] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenNewTransaction={handleOpenNewTransaction}
        onOpenTransfer={() => setIsTransferModalOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenFxModal={() => setIsFxModalOpen(true)}
        onOpenDossierModal={() => setIsDossierModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenDossier={() => setIsDossierModalOpen(true)}
            onOpenNewTransaction={handleOpenNewTransaction}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' && (
              <DashboardView
                onOpenNewTransaction={handleOpenNewTransaction}
                onOpenTransfer={() => setIsTransferModalOpen(true)}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
              />
            )}
            {activeTab === 'ledger' && (
              <LedgerView
                onOpenNewTransaction={handleOpenNewTransaction}
                onEditTransaction={handleEditTransaction}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
                onOpenTransfer={() => setIsTransferModalOpen(true)}
              />
            )}
            {activeTab === 'forecast' && <ForecastBillsView />}
            {activeTab === 'budgets' && <BudgetsGoalsView />}
            {activeTab === 'household' && <HouseholdView />}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(undefined);
        }}
        initialTransaction={editingTx}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />

      <CsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />

      <FxConverterModal
        isOpen={isFxModalOpen}
        onClose={() => setIsFxModalOpen(false)}
      />

      <DossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
