import React from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, BookOpen, Lock, Radio, PlayCircle, Layers } from 'lucide-react';

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
      {/* Hero Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Live Environment Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border">
              {isMitmActive ? (
                <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  <span>Simulated Attack Interceptor: Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Environment Status: Protected</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Analyze communication & identify <span className="text-blue-600">security risks.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              CNS Pro simulates end-to-end payment communications to demonstrate where Man-in-the-Middle (MITM) tampering occurs and how cryptographic verification protects user transactions.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
            <button
              onClick={() => onStartSimulation(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-xs transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start New Analysis</span>
            </button>

            <button
              onClick={() => onStartMitmSimulation()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 border border-slate-300 text-slate-700 transition-all active:scale-98 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-rose-600" />
              <span>Simulate MITM Attack</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Security Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security State</span>
            <div className={`p-2 rounded-xl ${isMitmActive ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {isMitmActive ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 mb-1">
              {isMitmActive ? 'Threat Injected' : 'Protected (TLS 1.3 + SHA-256)'}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isMitmActive
                ? 'A simulated intermediary is positioned to intercept and tamper with message payloads.'
                : 'Direct channel active with cryptographic hashing and signature protection.'}
            </p>
          </div>
        </div>

        {/* Card 2: Recent Analysis */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latest Analysis</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            {recentSimulation ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">₹{recentSimulation.original_amount} → {recentSimulation.original_receiver}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    recentSimulation.final_status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {recentSimulation.final_status === 'APPROVED' ? '🟢 Safe' : '🔴 Blocked'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {recentSimulation.risk_summary}
                </p>
              </>
            ) : (
              <>
                <div className="text-base font-bold text-slate-800">Ready for Analysis</div>
                <p className="text-xs text-slate-500 mt-1">Submit a payment scenario below to observe communication flow.</p>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Educational Hub */}
        <div 
          onClick={onLearnMore}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Principles</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Learn MITM Defense</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visual concepts on encryption, message integrity digests, and nonces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
