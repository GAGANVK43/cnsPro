import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Terminal, ShieldCheck, ShieldAlert, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BackgroundActivity({ events, onOpenTechnicalDetails }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'secure':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'threat':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3" />
            Threat Detected
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3 h-3" />
            In Progress
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              What's happening in the background?
            </h3>
            <p className="text-xs text-slate-500">
              Plain-language breakdown of background verification operations.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTechnicalDetails}
          className="text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>Technical Details</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {events && events.length > 0 ? (
          events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className={`rounded-xl border transition-all duration-150 ${
                evt.status === 'threat'
                  ? 'bg-rose-50/50 border-rose-200'
                  : evt.status === 'secure'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-200'
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
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                        {evt.title}
                      </h4>
                      {getStatusBadge(evt.status)}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {evt.simple_explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <span className="text-[11px] font-mono hidden sm:inline">
                    {new Date(evt.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {expandedIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>

              {/* Expandable Technical Detail */}
              {expandedIndex === idx && (
                <div className="px-4 pb-3.5 pt-1 text-xs border-t border-slate-200/80 bg-white rounded-b-xl space-y-2">
                  <div className="text-slate-700 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-blue-700 font-bold">Tech Detail: </span>
                    {evt.technical_detail}
                  </div>
                  {evt.data_snapshot && (
                    <pre className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto">
                      {JSON.stringify(evt.data_snapshot, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No background events yet. Submit a payment above to see real-time activities.
          </div>
        )}
      </div>
    </div>
  );
}
