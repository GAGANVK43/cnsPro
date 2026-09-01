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
      {/* Top Status & Hero Banner with Glassmorphism */}
      <div className={`relative overflow-hidden rounded-2xl cyber-panel border p-6 md:p-8 shadow-2xl transition-all duration-300 ${
        isMitmActive ? 'glow-rose border-rose-500/50' : 'glow-emerald border-emerald-500/30'
      }`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        {isMitmActive && (
          <div className="absolute top-0 left-0 -ml-16 -mt-16 w-80 h-80 bg-rose-500/25 rounded-full blur-3xl pointer-events-none"></div>
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
              See what happens <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">behind your payment.</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
              Experience the end-to-end journey of a digital UPI transaction. Understand how communication flows, where a Man-in-the-Middle (MITM) threat intercepts data, and how cryptographic verification protects users.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
            <button
              onClick={() => onStartSimulation(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Normal Payment</span>
            </button>

            <button
              onClick={() => onStartMitmSimulation()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/60 text-rose-200 transition-all active:scale-98 cursor-pointer shadow-lg shadow-rose-950/50"
            >
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Simulate MITM Attack</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Overview Info Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Security Status */}
        <div className="cyber-panel rounded-xl p-5 flex flex-col justify-between transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security State</span>
            <div className={`p-2 rounded-lg ${isMitmActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
              {isMitmActive ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white mb-1">
              {isMitmActive ? 'Threat Injected' : 'Protected (TLS 1.3 + SHA-256)'}
            </div>
            <p className="text-xs text-slate-300">
              {isMitmActive
                ? 'Simulated rogue proxy waiting to tamper with data packets.'
                : 'Cryptographic hashing and digital signatures active.'}
            </p>
          </div>
        </div>

        {/* Card 2: Recent Activity */}
        <div className="cyber-panel rounded-xl p-5 flex flex-col justify-between transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Activity</span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            {recentSimulation ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">₹{recentSimulation.original_amount} → {recentSimulation.original_receiver}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    recentSimulation.final_status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {recentSimulation.final_status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {recentSimulation.risk_summary}
                </p>
              </>
            ) : (
              <>
                <div className="text-base font-bold text-slate-200">Ready for Payment</div>
                <p className="text-xs text-slate-300 mt-1">Start a simulation below to see real-time packet transit.</p>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Educational Hub */}
        <div 
          onClick={onLearnMore}
          className="cyber-panel rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-lg hover:border-emerald-500/60"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Knowledge Base</span>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Learn MITM Concepts</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Visual diagrams on encryption, hashing, nonces, and user defense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
