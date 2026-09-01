import React from 'react';
import { Smartphone, Wifi, Radio, ShieldAlert, ShieldCheck, XCircle, ArrowLeft, Terminal } from 'lucide-react';

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
      description: 'You initiated a payment request on your mobile device.',
      icon: Smartphone,
      color: 'blue',
      badge: 'Original'
    },
    {
      id: 2,
      title: 'Communication Started',
      subtitle: 'Dispatched Across Network',
      description: 'Your device computed a unique SHA-256 fingerprint of your payment and transmitted it.',
      icon: Wifi,
      color: 'blue',
      badge: 'Protected'
    },
    {
      id: 3,
      title: 'Simulated Interception',
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
      description: 'The simulated bank server recalculated the cryptographic hash over the received message.',
      icon: ShieldAlert,
      color: 'amber',
      badge: 'Integrity Check'
    },
    {
      id: 5,
      title: 'Information Mismatch Detected',
      subtitle: 'Original Digest ≠ Received Digest',
      description: 'Because the text was altered, the mathematical hashes did not match.',
      icon: XCircle,
      color: 'rose',
      badge: 'Mismatch'
    },
    {
      id: 6,
      title: 'Simulated Payment Blocked',
      subtitle: 'Zero Money Lost',
      description: 'The security decision engine aborted the transaction immediately and alerted the user.',
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'Funds Protected'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToSimulator}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Simulation</span>
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            See What Happened (Forensic Timeline)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual step-by-step autopsy of how the MITM tampering was detected and safely blocked.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTechnicalDetails}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>Technical Details</span>
          </button>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative max-w-3xl mx-auto space-y-5">
        {/* Connecting line */}
        <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-slate-200 hidden sm:block"></div>

        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="relative flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              {/* Icon / Marker */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 z-10 ${
                step.color === 'emerald'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : step.color === 'rose'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : step.color === 'amber'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
              }`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Step Content */}
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Step {step.id}</span>
                    <h4 className="text-base font-bold text-slate-900 tracking-tight">
                      {step.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    step.color === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : step.color === 'rose'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : step.color === 'amber'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {step.badge}
                  </span>
                </div>

                <div className="font-mono text-xs font-semibold text-slate-800">
                  {step.subtitle}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Explainer Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center max-w-3xl mx-auto space-y-2">
        <p className="text-sm font-bold text-slate-900">
          Why was the payment stopped?
        </p>
        <p className="text-xs text-slate-600 leading-relaxed max-w-xl mx-auto">
          The security system detected that the payment information received during transit did not match what you originally signed. Because of cryptographic hashing, even a 1-character change completely alters the verification output.
        </p>
        <div className="pt-2">
          <button
            onClick={onBackToSimulator}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer"
          >
            Try Another Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
