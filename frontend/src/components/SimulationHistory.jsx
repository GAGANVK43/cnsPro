import React from 'react';
import { History, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, RefreshCw, Terminal, CheckCircle2, XCircle } from 'lucide-react';

export default function SimulationHistory({
  history,
  onSelectHistoryItem,
  onClearHistory
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Simulation Session History
            </h2>
            <p className="text-xs text-slate-400">
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
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Txn ID & Time</th>
              <th className="py-3 px-4">Original Request</th>
              <th className="py-3 px-4">Server Received</th>
              <th className="py-3 px-4">MITM Mode</th>
              <th className="py-3 px-4">Decision</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {history && history.length > 0 ? (
              history.map((item, idx) => (
                <tr
                  key={item.transaction_id || idx}
                  onClick={() => onSelectHistoryItem(item)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  {/* Txn ID */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-white text-[11px]">{item.transaction_id}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>

                  {/* Original */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-400">₹{item.original_amount}</div>
                    <div className="text-slate-400 text-[11px]">{item.original_receiver}</div>
                  </td>

                  {/* Server Received */}
                  <td className="py-3.5 px-4">
                    <div className={item.received_amount !== item.original_amount ? 'font-bold text-rose-400' : 'text-slate-300'}>
                      ₹{item.received_amount}
                    </div>
                    <div className={item.received_receiver !== item.original_receiver ? 'font-bold text-rose-400 text-[11px]' : 'text-slate-400 text-[11px]'}>
                      {item.received_receiver}
                    </div>
                  </td>

                  {/* MITM Mode */}
                  <td className="py-3.5 px-4">
                    {item.is_mitm_active ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.tamper_type}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        DIRECT (SECURE)
                      </span>
                    )}
                  </td>

                  {/* Decision */}
                  <td className="py-3.5 px-4 font-semibold">
                    <span className={item.security_decision === 'SECURE' ? 'text-emerald-400' : 'text-rose-400'}>
                      {item.security_decision}
                    </span>
                  </td>

                  {/* Final Status */}
                  <td className="py-3.5 px-4">
                    {item.final_status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" />
                        APPROVED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        <XCircle className="w-3 h-3" />
                        BLOCKED
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">
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
