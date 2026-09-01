import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Terminal, RefreshCw, Layers } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 sm:p-7 shadow-xl space-y-5 bg-white ${
        isApproved ? 'border-emerald-200' : 'border-rose-200'
      }`}>
        {/* Top Icon & Badge */}
        <div className="flex items-center gap-4">
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${
            isApproved 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
              : 'bg-rose-50 text-rose-600 border border-rose-200'
          }`}>
            {isApproved ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <ShieldAlert className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
              {isApproved ? (
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🟢 Payment Secure & Verified
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  🚨 Security Alert Raised
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isApproved ? 'Payment Successful' : 'Simulated Payment Blocked'}
            </h3>
          </div>
        </div>

        {/* Plain Language Summary */}
        <div className={`p-4 rounded-xl text-xs leading-relaxed ${
          isApproved
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}>
          {isApproved ? (
            <p>
              Communication was successfully verified. The digital cryptographic fingerprint created by your device matched the server's verification check perfectly.
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="font-bold text-rose-950">
                Suspicious communication was detected during this simulated transaction.
              </p>
              <p className="text-rose-800">
                The payment information received by the simulated bank server does <strong>NOT match</strong> the original request created on your device.
              </p>
              <p className="text-rose-800 font-medium">
                Your simulated payment has been <strong>safely stopped</strong> to protect your funds.
              </p>
            </div>
          )}
        </div>

        {/* Transaction Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Intended Beneficiary:</span>
            <span className="font-semibold text-slate-900">{originalPayload?.receiver_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Transfer Amount:</span>
            <span className="font-bold text-slate-900">₹{originalPayload?.amount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Transaction ID:</span>
            <span className="font-mono text-blue-700">{originalPayload?.txn_id}</span>
          </div>

          {!isApproved && (
            <div className="flex justify-between pt-1 border-t border-slate-200 text-rose-700 font-medium">
              <span>Intercepted Value:</span>
              <span className="font-bold">
                ₹{receivedPayload?.amount} → {receivedPayload?.receiver_name}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {!isApproved && (
            <button
              onClick={() => {
                onClose();
                onSeeWhatHappened();
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
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
              className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Technical Details</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onReset();
              }}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
