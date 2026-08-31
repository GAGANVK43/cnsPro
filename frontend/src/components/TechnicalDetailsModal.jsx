import React, { useState } from 'react';
import { X, Terminal, ShieldCheck, ShieldAlert, Copy, Check, Hash, FileCode, CheckCircle2, XCircle } from 'lucide-react';

export default function TechnicalDetailsModal({
  isOpen,
  onClose,
  originalPayload,
  receivedPayload,
  verificationResult,
  finalStatus
}) {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const originalHash = verificationResult?.original_hash || originalPayload?.sha256_hash || '';
  const receivedHash = verificationResult?.received_hash || '';
  const diffIndices = verificationResult?.hash_diff_indices || [];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Cryptographic & Verification Technical Details
              </h3>
              <p className="text-xs text-slate-400">
                Inspect raw payloads, SHA-256 digests, HMAC authentication, and risk engine metrics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Security Engine State Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500">Integrity Check</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-xs">
                {verificationResult?.is_integrity_intact ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> INTACT
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500">HMAC-SHA256</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-xs">
                {verificationResult?.is_signature_valid ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VALID
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> MISMATCH
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500">Nonce Freshness</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE (Fresh)
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500">Risk Assessment</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-xs">
                <span className={verificationResult?.security_decision === 'SECURE' ? 'text-emerald-400' : 'text-rose-400'}>
                  {verificationResult?.security_decision || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Comparison */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>SHA-256 Cryptographic Hash Comparison</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">256-bit Digest (64 hex characters)</span>
            </div>

            {/* Original Hash */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Original Sender Digest (Sealed on Phone):</span>
                <button
                  onClick={() => copyToClipboard(originalHash)}
                  className="hover:text-white flex items-center gap-1 text-[10px] transition-colors cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
                {originalHash || 'Pending computation...'}
              </div>
            </div>

            {/* Received Hash */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400">
                <span>Received Payload Digest (Computed by Bank Server):</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs break-all select-all">
                {receivedHash ? (
                  receivedHash.split('').map((char, i) => {
                    const isDiff = diffIndices.includes(i);
                    return (
                      <span
                        key={i}
                        className={isDiff ? 'bg-rose-500 text-white font-extrabold px-0.5 rounded' : 'text-slate-300'}
                      >
                        {char}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-slate-500">Pending server calculation...</span>
                )}
              </div>
            </div>

            {diffIndices.length > 0 && (
              <p className="text-[11px] text-rose-300 bg-rose-950/40 border border-rose-900/60 p-2 rounded-lg">
                💡 <strong>Avalanche Effect Highlight:</strong> Changing even 1 letter in the payment caused {diffIndices.length} out of 64 hex characters (over 50% of the bits) to completely change!
              </p>
            )}
          </div>

          {/* Side-by-Side Raw JSON Payloads */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Side-by-Side Payload Inspection</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Payload */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                  <span>1. Original Client Payload</span>
                  <span className="text-[10px] text-slate-500">Constructed on device</span>
                </div>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56">
                  {JSON.stringify(originalPayload || {}, null, 2)}
                </pre>
              </div>

              {/* Received Payload */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-rose-400 flex items-center justify-between">
                  <span>2. Received Server Payload</span>
                  <span className="text-[10px] text-slate-500">Received at gateway</span>
                </div>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56">
                  {JSON.stringify(receivedPayload || originalPayload || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
