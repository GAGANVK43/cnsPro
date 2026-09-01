import React from 'react';
import { ShieldCheck, ShieldAlert, Zap, ArrowRight, BookOpen, AlertTriangle, CheckCircle2, Lock, Radio } from 'lucide-react';

export default function Dashboard({
  isMitmActive,
  onStartSimulation,
  onStartMitmSimulation,
  onLearnMore,
  recentSimulation,
  onViewForensics
}) {
  return (
    <div className="space-y-6">
      {/* Top Status & Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        {isMitmActive && (
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md bg-slate-950/80">
              {isMitmActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-rose-400 font-medium">MITM Attack Interceptor Active</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-emerald-400 font-medium">Payment Environment Secure</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              See what happens <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">behind your payment.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience the end-to-end journey of a digital UPI transaction. Understand how communication flows, where a Man-in-the-Middle (MITM) threat intercepts data, and how cryptographic verification protects users.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
            <button
              onClick={() => onStartSimulation(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Normal Payment</span>
            </button>

            <button
              onClick={() => onStartMitmSimulation()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-800/90 hover:bg-rose-950/50 hover:border-rose-500/50 hover:text-rose-300 border border-slate-700 text-slate-200 transition-all active:scale-98 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-rose-400" />
              <span>Simulate MITM Attack</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Overview Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Security Status */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security State</span>
            <div className={`p-2 rounded-lg ${isMitmActive ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {isMitmActive ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white mb-1">
              {isMitmActive ? 'Threat Injected' : 'Protected (TLS 1.3 + SHA-256)'}
            </div>
            <p className="text-xs text-slate-400">
              {isMitmActive
                ? 'Simulated rogue proxy waiting to tamper with data packets.'
                : 'Cryptographic hashing and digital signatures active.'}
            </p>
          </div>
        </div>

        {/* Card 2: Recent Activity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Activity</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            {recentSimulation ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">₹{recentSimulation.original_amount} → {recentSimulation.original_receiver}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    recentSimulation.final_status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {recentSimulation.final_status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {recentSimulation.risk_summary}
                </p>
              </>
            ) : (
              <>
                <div className="text-base font-bold text-slate-300">Ready for Payment</div>
                <p className="text-xs text-slate-400 mt-1">Start a simulation below to see real-time packet transit.</p>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Educational Hub */}
        <div 
          onClick={onLearnMore}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Knowledge Base</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Learn MITM Concepts</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visual diagrams on encryption, hashing, nonces, and user defense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
