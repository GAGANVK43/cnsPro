import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Terminal, RefreshCw, Layers } from 'lucide-react';

export default function SecurityAlertModal({
  isOpen,
  onClose,
  finalStatus, // 'APPROVED' or 'BLOCKED'
  originalPayload,
  receivedPayload,
  verificationResult,
  onSeeWhatHappened,
  onOpenTechnicalDetails,
  onReset
}) {
  if (!isOpen) return null;

  const isApproved = finalStatus === 'APPROVED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl space-y-6 ${
        isApproved 
          ? 'bg-slate-900 border-emerald-500/40 glow-emerald'
          : 'bg-slate-900 border-rose-500/50 glow-rose'
      }`}>
        {/* Top Icon & Badge */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            isApproved 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
          }`}>
            {isApproved ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
              {isApproved ? (
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  🟢 Payment Secure & Verified
                </span>
              ) : (
                <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  🚨 Security Alert Raised
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-white tracking-tight">
              {isApproved ? 'Payment Successful' : 'Simulated Payment Blocked'}
            </h3>
          </div>
        </div>

        {/* Plain Language Summary */}
        <div className={`p-4 rounded-xl text-sm leading-relaxed ${
          isApproved
            ? 'bg-emerald-950/30 text-emerald-200 border border-emerald-900/40'
            : 'bg-rose-950/30 text-rose-200 border border-rose-900/40'
        }`}>
          {isApproved ? (
            <p>
              Communication was successfully verified. The digital cryptographic fingerprint created by your device matched the server's verification check perfectly.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="font-semibold text-rose-100">
                Suspicious communication was detected during this simulated transaction.
              </p>
              <p className="text-xs text-rose-300">
                The payment information received by the simulated bank server does <strong>NOT match</strong> the original request created on your device.
              </p>
              <p className="text-xs text-rose-300 font-medium">
                Your simulated payment has been <strong>safely stopped</strong> to protect your funds.
              </p>
            </div>
          )}
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Intended Beneficiary:</span>
            <span className="font-semibold text-white">{originalPayload?.receiver_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Transfer Amount:</span>
            <span className="font-bold text-white">₹{originalPayload?.amount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-mono text-cyan-400">{originalPayload?.txn_id}</span>
          </div>

          {!isApproved && (
            <div className="flex justify-between pt-1 border-t border-slate-800 text-rose-400 font-medium">
              <span>Intercepted Value:</span>
              <span className="font-bold">
                ₹{receivedPayload?.amount} → {receivedPayload?.receiver_name}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {!isApproved && (
            <button
              onClick={() => {
                onClose();
                onSeeWhatHappened();
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>See What Happened (Visual Timeline)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenTechnicalDetails();
              }}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Technical Details</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onReset();
              }}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
