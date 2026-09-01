import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Terminal, ShieldCheck, ShieldAlert, Info, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

export default function BackgroundActivity({ events, onOpenTechnicalDetails }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'secure':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'threat':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3" />
            Threat Detected
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Info className="w-3 h-3" />
            In Progress
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              What's happening in the background?
            </h3>
            <p className="text-xs text-slate-400">
              Live plain-language inspection of background payment operations.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTechnicalDetails}
          className="text-xs font-semibold text-slate-300 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>View Technical Details</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {events && events.length > 0 ? (
          events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className={`rounded-xl border transition-all duration-200 ${
                evt.status === 'threat'
                  ? 'bg-rose-950/20 border-rose-900/50'
                  : evt.status === 'secure'
                  ? 'bg-emerald-950/15 border-emerald-900/40'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div 
                className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5">{evt.icon || '⚡'}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {evt.title}
                      </h4>
                      {getStatusBadge(evt.status)}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {evt.simple_explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <span className="text-[11px] font-mono hidden sm:inline">
                    {new Date(evt.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {expandedIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expandable Technical Sub-Detail */}
              {expandedIndex === idx && (
                <div className="px-4 pb-3.5 pt-1 text-xs border-t border-slate-800/60 bg-slate-950/40 rounded-b-xl space-y-2 animate-in fade-in duration-150">
                  <div className="text-slate-400 font-mono text-[11px] bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-cyan-400 font-bold">Tech Detail: </span>
                    {evt.technical_detail}
                  </div>
                  {evt.data_snapshot && (
                    <pre className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 overflow-x-auto">
                      {JSON.stringify(evt.data_snapshot, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No background events yet. Submit a payment above to see real-time activities.
          </div>
        )}
      </div>
    </div>
  );
}
