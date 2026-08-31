import React from 'react';
import { Smartphone, CreditCard, Wifi, ShieldAlert, Landmark, ShieldCheck, CheckCircle2, XCircle, Lock, ArrowRight, Radio } from 'lucide-react';

export default function PaymentJourney({
  simulationStep, // 0: Idle, 1: Created, 2: Channel, 3: MITM/Transit, 4: Server, 5: Verify, 6: Decision
  isMitmActive,
  originalPayload,
  receivedPayload,
  isBlocked,
  isApproved,
  onOpenTechnicalDetails
}) {
  const nodes = [
    {
      id: 1,
      title: 'YOU (App)',
      icon: Smartphone,
      color: 'emerald',
      status: simulationStep >= 1 ? 'active' : 'idle',
      detail: originalPayload ? `${originalPayload.sender_name}` : 'Sender Device'
    },
    {
      id: 2,
      title: 'PAYMENT REQUEST',
      icon: CreditCard,
      color: 'cyan',
      status: simulationStep >= 1 ? 'active' : 'idle',
      detail: originalPayload ? `₹${originalPayload.amount} → ${originalPayload.receiver_name}` : 'Payload Sealed'
    },
    {
      id: 3,
      title: 'COMMUNICATION',
      icon: Wifi,
      color: isMitmActive ? 'rose' : 'blue',
      status: simulationStep >= 2 ? 'active' : 'idle',
      detail: isMitmActive ? 'Intercepted Link' : 'Secure TLS 1.3'
    },
    {
      id: 4,
      title: 'PAYMENT SERVER',
      icon: Landmark,
      color: 'indigo',
      status: simulationStep >= 4 ? 'active' : 'idle',
      detail: 'Banking Gateway'
    },
    {
      id: 5,
      title: 'SECURITY CHECK',
      icon: ShieldCheck,
      color: isBlocked ? 'rose' : isApproved ? 'emerald' : 'amber',
      status: simulationStep >= 5 ? 'active' : 'idle',
      detail: 'SHA-256 Digest'
    },
    {
      id: 6,
      title: isBlocked ? 'PAYMENT BLOCKED' : isApproved ? 'PAYMENT VERIFIED' : 'DECISION',
      icon: isBlocked ? XCircle : isApproved ? CheckCircle2 : ShieldCheck,
      color: isBlocked ? 'rose' : isApproved ? 'emerald' : 'slate',
      status: simulationStep >= 6 ? 'active' : 'idle',
      detail: isBlocked ? '🛑 Threat Prevented' : isApproved ? '🟢 Money Transferred' : 'Final Verdict'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Interactive Payment Journey</span>
          </h3>
          <p className="text-xs text-slate-400">
            Watch the live path of your payment communication from your phone to the bank.
          </p>
        </div>

        {originalPayload?.sha256_hash && (
          <button
            onClick={onOpenTechnicalDetails}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-950/40 border border-cyan-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>SHA-256 Digest:</span>
            <span className="font-bold underline">{originalPayload.sha256_hash.substring(0, 10)}...</span>
          </button>
        )}
      </div>

      {/* Visual Journey Architecture */}
      <div className="relative py-6 px-2">
        {/* Connection Background Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-800 rounded-full hidden md:block z-0"></div>

        {/* Animated Progress Line */}
        <div 
          className={`absolute top-1/2 left-8 -translate-y-1/2 h-1 rounded-full hidden md:block transition-all duration-700 z-0 ${
            isBlocked ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400'
          }`}
          style={{
            width: `${Math.min(100, Math.max(0, (simulationStep / 5) * 88))}%`
          }}
        ></div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isCurrent = simulationStep === index + 1;
            const isPassed = simulationStep > index + 1;

            return (
              <div
                key={node.id}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-slate-800/90 border-emerald-400/80 shadow-lg scale-105 ring-2 ring-emerald-500/20'
                    : isPassed
                    ? 'bg-slate-900/80 border-slate-700/80 text-slate-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                {/* Node Icon Circle */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-all ${
                  node.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : node.color === 'rose'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : node.color === 'amber'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : node.color === 'cyan'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : node.color === 'indigo'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  <Icon className={`w-6 h-6 ${isCurrent ? 'animate-bounce' : ''}`} />
                </div>

                {/* Node Title */}
                <div className="font-bold text-xs text-white tracking-tight uppercase">
                  {node.title}
                </div>

                {/* Node Detail subtitle */}
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {node.detail}
                </div>

                {/* Status Indicator */}
                {isCurrent && (
                  <div className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse border border-emerald-500/20">
                    Processing...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MITM Intermediary Visual Dropdown Node (When MITM active and reached step 3) */}
        {isMitmActive && simulationStep >= 2 && (
          <div className="mt-6 bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/60 border border-rose-500/50 rounded-xl p-4 shadow-lg animate-in fade-in slide-in-from-top duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                      Simulated Intermediary (Attacker / Rogue Proxy)
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30">
                      Tampering Active
                    </span>
                  </div>
                  <p className="text-xs text-rose-200/80 mt-0.5">
                    The payment packet was intercepted in the middle of transit.
                  </p>
                </div>
              </div>

              {/* Intercepted comparison snippet */}
              <div className="bg-slate-950/80 border border-rose-900/60 rounded-lg p-2.5 text-xs font-mono flex items-center gap-3">
                <div className="text-slate-400">
                  <span>Sent: </span>
                  <span className="text-emerald-400 font-bold">₹{originalPayload?.amount} → {originalPayload?.receiver_name}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                <div className="text-rose-400 font-bold">
                  <span>Tampered: </span>
                  <span>₹{receivedPayload?.amount || originalPayload?.amount} → {receivedPayload?.receiver_name || 'Attacker'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
