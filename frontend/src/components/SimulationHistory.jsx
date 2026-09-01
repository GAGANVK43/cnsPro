import React from 'react';
import { History, CheckCircle2, XCircle } from 'lucide-react';

export default function SimulationHistory({
  history,
  onSelectHistoryItem,
  onClearHistory
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Simulation Session History
            </h2>
            <p className="text-xs text-slate-500">
              Audit log of all simulated payment transactions and security decision outcomes.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          {history.length} Record{history.length === 1 ? '' : 's'} Logged
        </span>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Txn ID & Time</th>
              <th className="py-3 px-4">Original Request</th>
              <th className="py-3 px-4">Server Received</th>
              <th className="py-3 px-4">MITM Mode</th>
              <th className="py-3 px-4">Decision</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history && history.length > 0 ? (
              history.map((item, idx) => (
                <tr
                  key={item.transaction_id || idx}
                  onClick={() => onSelectHistoryItem(item)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  {/* Txn ID */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900 text-xs">{item.transaction_id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>

                  {/* Original */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-700">₹{item.original_amount}</div>
                    <div className="text-slate-500 text-xs">{item.original_receiver}</div>
                  </td>

                  {/* Server Received */}
                  <td className="py-3.5 px-4">
                    <div className={item.received_amount !== item.original_amount ? 'font-bold text-rose-700' : 'text-slate-800'}>
                      ₹{item.received_amount}
                    </div>
                    <div className={item.received_receiver !== item.original_receiver ? 'font-bold text-rose-700 text-xs' : 'text-slate-500 text-xs'}>
                      {item.received_receiver}
                    </div>
                  </td>

                  {/* MITM Mode */}
                  <td className="py-3.5 px-4">
                    {item.is_mitm_active ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                        {item.tamper_type}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        DIRECT (SECURE)
                      </span>
                    )}
                  </td>

                  {/* Decision */}
                  <td className="py-3.5 px-4 font-semibold">
                    <span className={item.security_decision === 'SECURE' ? 'text-emerald-700' : 'text-rose-700'}>
                      {item.security_decision}
                    </span>
                  </td>

                  {/* Final Status */}
                  <td className="py-3.5 px-4">
                    {item.final_status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        🟢 Safe
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        🔴 Blocked
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  No simulation records found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
