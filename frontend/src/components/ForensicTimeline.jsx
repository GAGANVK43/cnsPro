import React from 'react';
import { Smartphone, Wifi, Radio, ShieldAlert, ShieldCheck, XCircle, CheckCircle2, ArrowDown, Terminal, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ForensicTimeline({
  originalPayload,
  receivedPayload,
  verificationResult,
  onOpenTechnicalDetails,
  onBackToSimulator
}) {
  const steps = [
    {
      id: 1,
      title: 'Your Original Payment',
      subtitle: `₹${originalPayload?.amount} → ${originalPayload?.receiver_name}`,
      description: 'You initiated a payment request on your mobile app.',
      icon: Smartphone,
      color: 'emerald',
      badge: 'Original'
    },
    {
      id: 2,
      title: 'Communication Started',
      subtitle: 'Dispatched to Network',
      description: 'Your phone computed a unique SHA-256 fingerprint of your payment and transmitted it.',
      icon: Wifi,
      color: 'cyan',
      badge: 'Protected'
    },
    {
      id: 3,
      title: '🔴 Simulated Interception',
      subtitle: `Modified to: ₹${receivedPayload?.amount} → ${receivedPayload?.receiver_name}`,
      description: 'In this simulation, an unauthorized intermediary intercepted the packet in transit and modified the payload.',
      icon: Radio,
      color: 'rose',
      badge: 'Attacker Tamper'
    },
    {
      id: 4,
      title: 'Security Verification by Bank',
      subtitle: 'Fingerprint Comparison',
      description: 'The simulated bank server recalculated the cryptographic hash of the received message.',
      icon: ShieldAlert,
      color: 'amber',
      badge: 'Integrity Check'
    },
    {
      id: 5,
      title: '⚠ Information Mismatch Detected',
      subtitle: 'Original Digest ≠ Received Digest',
      description: 'Because the text was altered, the mathematical hashes did not match.',
      icon: XCircle,
      color: 'rose',
      badge: 'Mismatch'
    },
    {
      id: 6,
      title: '🛑 Simulated Payment Blocked',
      subtitle: 'Zero Money Lost',
      description: 'The security decision engine aborted the transaction immediately and alerted the user.',
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'Funds Protected'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToSimulator}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Simulation</span>
          </button>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            See What Happened (Forensic Timeline)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual step-by-step autopsy of how the MITM tampering was detected and safely blocked.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTechnicalDetails}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Technical Details</span>
          </button>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative max-w-3xl mx-auto space-y-6">
        {/* Connecting line */}
        <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-slate-800 hidden sm:block"></div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="relative flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              {/* Icon / Marker */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 z-10 ${
                step.color === 'emerald'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : step.color === 'rose'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : step.color === 'amber'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Step Content */}
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Step {step.id}</span>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {step.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    step.color === 'emerald'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : step.color === 'rose'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : step.color === 'amber'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}>
                    {step.badge}
                  </span>
                </div>

                <div className="font-mono text-xs font-semibold text-slate-200">
                  {step.subtitle}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Explainer Footer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center max-w-3xl mx-auto space-y-2">
        <p className="text-sm font-semibold text-white">
          Why did the payment stop?
        </p>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xl mx-auto">
          The security system detected that the payment information received during transit did not match what you originally signed. Because of cryptographic hashing, even a 1-character change completely alters the verification output.
        </p>
        <div className="pt-2">
          <button
            onClick={onBackToSimulator}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Try Another Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
