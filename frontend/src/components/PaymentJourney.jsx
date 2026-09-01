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
      color: 'blue',
      status: simulationStep >= 1 ? 'active' : 'idle',
      detail: originalPayload ? `${originalPayload.sender_name}` : 'Sender Device'
    },
    {
      id: 2,
      title: 'PAYMENT REQUEST',
      icon: CreditCard,
      color: 'blue',
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
      detail: isBlocked ? '🛑 Threat Prevented' : isApproved ? '🟢 Safe & Transferred' : 'Final Verdict'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Interactive Payment Journey</span>
          </h3>
          <p className="text-xs text-slate-500">
            Follow the live path of your payment communication from phone to banking gateway.
          </p>
        </div>

        {originalPayload?.sha256_hash && (
          <button
            onClick={onOpenTechnicalDetails}
            className="text-xs text-blue-700 hover:text-blue-800 font-mono bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Digest:</span>
            <span className="font-bold underline">{originalPayload.sha256_hash.substring(0, 10)}...</span>
          </button>
        )}
      </div>

      {/* Visual Journey Nodes */}
      <div className="relative py-4">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 rounded-full hidden md:block z-0"></div>

        {/* Animated Progress Line */}
        <div 
          className={`absolute top-1/2 left-8 -translate-y-1/2 h-1 rounded-full hidden md:block transition-all duration-700 z-0 ${
            isBlocked ? 'bg-rose-500' : 'bg-blue-600'
          }`}
          style={{
            width: `${Math.min(100, Math.max(0, (simulationStep / 5) * 88))}%`
          }}
        ></div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 relative z-10">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isCurrent = simulationStep === index + 1;
            const isPassed = simulationStep > index + 1;

            return (
              <div
                key={node.id}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-50/70 border-blue-600 shadow-xs ring-2 ring-blue-600/10'
                    : isPassed
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-white border-slate-200/70 text-slate-400 opacity-60'
                }`}
              >
                {/* Node Icon Circle */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-all ${
                  node.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : node.color === 'rose'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : node.color === 'amber'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : node.color === 'blue'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : node.color === 'indigo'
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Node Title */}
                <div className="font-bold text-xs text-slate-900 tracking-tight uppercase">
                  {node.title}
                </div>

                {/* Node Detail */}
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {node.detail}
                </div>

                {/* Active Pill */}
                {isCurrent && (
                  <div className="mt-2 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                    Processing...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MITM Intermediary Callout (When MITM active and reached step 3) */}
        {isMitmActive && simulationStep >= 2 && (
          <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                      Simulated Intermediary (Attacker Node)
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200 font-semibold">
                      Interception In Progress
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 mt-0.5">
                    The payment packet was intercepted in the middle of network transit.
                  </p>
                </div>
              </div>

              {/* Intercepted comparison snippet */}
              <div className="bg-white border border-rose-200 rounded-lg p-2.5 text-xs font-mono flex items-center gap-3">
                <div className="text-slate-600">
                  <span>Sent: </span>
                  <span className="text-emerald-700 font-bold">₹{originalPayload?.amount} → {originalPayload?.receiver_name}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
                <div className="text-rose-700 font-bold">
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
