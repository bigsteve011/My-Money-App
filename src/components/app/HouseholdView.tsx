import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatMoney, convertMinor } from '../../utils/accounting';
import {
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRightLeft,
  Shield,
  UserCheck,
  Mail,
  HeartHandshake,
} from 'lucide-react';

export const HouseholdView: React.FC = () => {
  const {
    household,
    accounts,
    transactions,
    baseCurrency,
    ratesPerEur,
    editAccount,
    recordTransfer,
  } = useFinance();

  const [settledMessage, setSettledMessage] = useState<string | null>(null);

  // Calculate shared expenses for current month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const sharedTxs = transactions.filter(
    (tx) => tx.isShared && tx.type === 'expense' && tx.date.startsWith(currentMonth)
  );

  // Attribute shared expenses to account owner
  let piotrPaidSharedMinor = 0;
  let annaPaidSharedMinor = 0;

  sharedTxs.forEach((tx) => {
    const acc = accounts.find((a) => a.id === tx.accountId);
    const converted = convertMinor(Math.abs(tx.amountMinor), tx.originalCurrency, baseCurrency, ratesPerEur);
    if (acc?.ownerId === 'usr_piotr') {
      piotrPaidSharedMinor += converted;
    } else {
      annaPaidSharedMinor += converted;
    }
  });

  const totalSharedMinor = piotrPaidSharedMinor + annaPaidSharedMinor;
  const eachOwesMinor = Math.round(totalSharedMinor / 2);
  const netDuePiotrMinor = piotrPaidSharedMinor - eachOwesMinor; // If positive, Anna owes Piotr

  const handleSettleUp = () => {
    if (netDuePiotrMinor === 0) return;

    // Find Piotr and Anna's primary PLN accounts
    const piotrAcc = accounts.find((a) => a.ownerId === 'usr_piotr' && a.currency === 'PLN');
    const annaAcc = accounts.find((a) => a.ownerId === 'usr_anna' && a.currency === 'PLN');

    if (piotrAcc && annaAcc) {
      if (netDuePiotrMinor > 0) {
        // Anna pays Piotr
        recordTransfer(
          annaAcc.id,
          piotrAcc.id,
          netDuePiotrMinor,
          'PLN',
          'Household Monthly Settle-up (Rent & Groceries)'
        );
        setSettledMessage(
          `Settlement posted: Anna transferred ${formatMoney(netDuePiotrMinor, 'PLN')} to Piotr's ${piotrAcc.name}.`
        );
      } else {
        // Piotr pays Anna
        const amount = Math.abs(netDuePiotrMinor);
        recordTransfer(
          piotrAcc.id,
          annaAcc.id,
          amount,
          'PLN',
          'Household Monthly Settle-up'
        );
        setSettledMessage(
          `Settlement posted: Piotr transferred ${formatMoney(amount, 'PLN')} to Anna's ${annaAcc.name}.`
        );
      }
    }
  };

  const toggleAccountPrivacy = (accountId: string, currentShared: boolean) => {
    editAccount(accountId, { isShared: !currentShared });
  };

  return (
    <div className="space-y-8">
      {/* Top Household Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-[#0DAE9B] to-[#3478F6] flex items-center justify-center text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{household.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinated household budgeting with cryptographic privacy separation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {household.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            >
              <div
                className="w-6 h-6 rounded-full text-white font-bold text-[10px] flex items-center justify-center"
                style={{ backgroundColor: member.color }}
              >
                {member.avatarInitials}
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900">{member.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Expense Split & Settle-up Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#0DAE9B]" />
            <h2 className="text-base font-bold text-slate-900">October Shared Expenses & 50/50 Split</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Valued in {baseCurrency}</span>
        </div>

        {settledMessage && (
          <div className="p-3 bg-[#D9F8EE] border border-[#0DAE9B]/30 rounded-xl flex items-center gap-2 text-xs text-[#102B3F]">
            <CheckCircle2 className="w-4 h-4 text-[#0DAE9B] shrink-0" />
            <span>{settledMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Total Shared Expenses</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {formatMoney(totalSharedMinor, baseCurrency)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {sharedTxs.length} shared items (rent, groceries, utilities)
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Piotr Kowalski Paid</span>
            <div className="text-xl font-bold font-mono text-[#0DAE9B] mt-1">
              {formatMoney(piotrPaidSharedMinor, baseCurrency)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">PKO BP & Revolut transactions</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Anna Taylor Paid</span>
            <div className="text-xl font-bold font-mono text-[#3478F6] mt-1">
              {formatMoney(annaPaidSharedMinor, baseCurrency)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Santander shared contributions</p>
          </div>

          <div className="p-4 bg-[#F8FCFF] rounded-xl border border-blue-100 flex flex-col justify-between">
            <div>
              <span className="text-slate-500 font-medium">Net Settlement Due</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {netDuePiotrMinor > 0
                  ? `Anna owes Piotr ${formatMoney(netDuePiotrMinor, baseCurrency)}`
                  : netDuePiotrMinor < 0
                  ? `Piotr owes Anna ${formatMoney(Math.abs(netDuePiotrMinor), baseCurrency)}`
                  : 'All settled!'}
              </div>
            </div>

            <button
              onClick={handleSettleUp}
              disabled={netDuePiotrMinor === 0}
              className="mt-3 w-full py-2 text-xs font-semibold text-white bg-[#0DAE9B] hover:bg-[#0b9786] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Post Settle-up Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Account Granular Privacy Configuration */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Household Account Privacy Matrix</h2>
            <p className="text-xs text-slate-500">
              Control which accounts are visible in the joint plan vs kept in personal private vaults
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-[#0DAE9B]" />
            <span>EDPB Privacy by Design</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {accounts.map((acc) => {
            const owner = household.members.find((m) => m.id === acc.ownerId);

            return (
              <div key={acc.id} className="py-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 text-sm">{acc.name}</div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-2">
                    <span>{acc.institution}</span>
                    <span>·</span>
                    <span>Currency: {acc.currency}</span>
                    <span>·</span>
                    <span>Owner: {owner?.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                      acc.isShared
                        ? 'bg-[#D9F8EE] text-[#0DAE9B]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {acc.isShared ? <Users className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {acc.isShared ? 'Shared in Household' : 'Private to Owner'}
                  </span>

                  <button
                    onClick={() => toggleAccountPrivacy(acc.id, acc.isShared)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Toggle to {acc.isShared ? 'Private' : 'Shared'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
