import React, { useState } from 'react';
import { Send, Shield, Radio, AlertTriangle, User, DollarSign, Tag, RefreshCw, Zap, ShieldAlert } from 'lucide-react';

export default function PaymentSimulator({
  onSubmitPayment,
  isProcessing,
  isMitmEnabled,
  setIsMitmEnabled,
  tamperConfig,
  setTamperConfig
}) {
  const [receiverName, setReceiverName] = useState('Rahul');
  const [amount, setAmount] = useState('500');
  const [purpose, setPurpose] = useState('Food & Dining');

  const presetContacts = [
    { name: 'Rahul', amount: '500', purpose: 'Food & Dining' },
    { name: 'Priya Stores', amount: '250', purpose: 'Stationery' },
    { name: 'Cafe Coffee Day', amount: '380', purpose: 'Coffee' },
    { name: 'Apartment Rent', amount: '12000', purpose: 'Monthly Rent' }
  ];

  const handleApplyPreset = (preset) => {
    setReceiverName(preset.name);
    setAmount(preset.amount);
    setPurpose(preset.purpose);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receiverName || !amount || parseFloat(amount) <= 0) return;

    onSubmitPayment(
      {
        receiver_name: receiverName,
        receiver_vpa: `${receiverName.toLowerCase().replace(/\s+/g, '')}@oksbi`,
        amount: parseFloat(amount),
        purpose: purpose || 'General Payment',
        sender_name: 'You (Demo User)',
        sender_vpa: 'user@okhdfcbank'
      },
      {
        is_mitm_enabled: isMitmEnabled,
        tamper_type: tamperConfig.tamper_type,
        modified_receiver_name: tamperConfig.modified_receiver_name,
        modified_receiver_vpa: tamperConfig.modified_receiver_vpa,
        modified_amount: parseFloat(tamperConfig.modified_amount) || parseFloat(amount) * 10,
        modified_purpose: tamperConfig.modified_purpose
      }
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <span>Fictional Payment Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fill in simulated payment details. No real credentials or bank networks are used.
          </p>
        </div>

        {/* MITM Mode Toggle Pill */}
        <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-400 pl-2">MITM Simulation:</span>
          <button
            type="button"
            onClick={() => setIsMitmEnabled(!isMitmEnabled)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isMitmEnabled
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isMitmEnabled ? (
              <>
                <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
                <span>ENABLED (ATTACK)</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>OFF (SECURE)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MITM Educational Warning Banner if Active */}
      {isMitmEnabled && (
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 animate-subtle-pulse">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Educational MITM Interceptor Active
            </h4>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              In this mode, a simulated intermediary will intercept your payment in transit and alter the payload before it reaches the simulated server. Watch how cryptographic verification flags the mismatch.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quick Pick Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Contact Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetContacts.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  receiverName === preset.name
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="font-bold truncate">{preset.name}</div>
                <div className="text-[11px] opacity-75">₹{preset.amount} • {preset.purpose}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Receiver */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Beneficiary / Receiver Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                required
                placeholder="e.g. Rahul"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Amount (₹ INR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                ₹
              </div>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="e.g. 500"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Purpose (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Food, Groceries"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* MITM Tamper Configuration Sandbox (if enabled) */}
        {isMitmEnabled && (
          <div className="bg-slate-950/90 border border-rose-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rose-500" />
                <span>Simulated Attacker Interceptor Sandbox</span>
              </span>
              <span className="text-[11px] text-slate-400">Configure what the attacker alters</span>
            </div>

            {/* Tamper Type Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTamperConfig({ ...tamperConfig, tamper_type: 'RECEIVER_MODIFIED' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  tamperConfig.tamper_type === 'RECEIVER_MODIFIED'
                    ? 'border-rose-500 bg-rose-500/15 text-rose-200 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold">1. Divert Beneficiary</div>
                <div className="text-[11px] opacity-75">Changes receiver to attacker</div>
              </button>

              <button
                type="button"
                onClick={() => setTamperConfig({ ...tamperConfig, tamper_type: 'AMOUNT_MODIFIED' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  tamperConfig.tamper_type === 'AMOUNT_MODIFIED'
                    ? 'border-rose-500 bg-rose-500/15 text-rose-200 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold">2. Inflate Amount</div>
                <div className="text-[11px] opacity-75">Multiplies transfer amount</div>
              </button>

              <button
                type="button"
                onClick={() => setTamperConfig({ ...tamperConfig, tamper_type: 'FULL_PAYLOAD_TAMPER' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  tamperConfig.tamper_type === 'FULL_PAYLOAD_TAMPER'
                    ? 'border-rose-500 bg-rose-500/15 text-rose-200 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold">3. Full Tamper</div>
                <div className="text-[11px] opacity-75">Changes both payee and amount</div>
              </button>
            </div>

            {/* Live Tamper Payload Preview */}
            <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-slate-300 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-500">Original Request:</span>{' '}
                <span className="text-emerald-400 font-bold">₹{amount} → {receiverName}</span>
              </div>
              <div className="text-rose-400">
                <span className="text-slate-500">Will be modified to:</span>{' '}
                <span className="font-bold underline">
                  {tamperConfig.tamper_type === 'RECEIVER_MODIFIED' && `₹${amount} → ${tamperConfig.modified_receiver_name || 'Attacker (Mallory)'}`}
                  {tamperConfig.tamper_type === 'AMOUNT_MODIFIED' && `₹${parseFloat(amount) * 10} → ${receiverName}`}
                  {tamperConfig.tamper_type === 'FULL_PAYLOAD_TAMPER' && `₹${parseFloat(amount) * 5} → Shadow Syndicate`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Continue Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isMitmEnabled
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-600/20 active:scale-98'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-600/20 active:scale-98'
            } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Payment Transmission...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>
                  {isMitmEnabled ? 'Continue (Test MITM Detection)' : 'Continue (Send Secure Payment)'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
