import React, { useState } from 'react';
import { Send, Shield, Radio, User, DollarSign, Tag, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';

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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            <span>Simulated Payment Input</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter test transaction details to follow the communication lifecycle.
          </p>
        </div>

        {/* MITM Attack Mode Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-600 pl-2">MITM Simulation:</span>
          <button
            type="button"
            onClick={() => setIsMitmEnabled(!isMitmEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isMitmEnabled
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {isMitmEnabled ? (
              <>
                <Radio className="w-3.5 h-3.5" />
                <span>ENABLED (ATTACK)</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>OFF (SECURE)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MITM Warning Notice if Enabled */}
      {isMitmEnabled && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Simulated Attacker Interceptor Active
            </h4>
            <p className="text-xs text-rose-700 leading-relaxed">
              In this mode, an intermediary node will intercept the payment packet in transit and alter the payload. Watch how cryptographic verification detects the mismatch and blocks the transaction.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quick Contact Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Quick Contact Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {presetContacts.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  receiverName === preset.name
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="font-bold truncate text-slate-900">{preset.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">₹{preset.amount} • {preset.purpose}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Receiver Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Beneficiary Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                required
                placeholder="e.g. Rahul"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
              />
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Amount (₹ INR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
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
                className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
              />
            </div>
          </div>

          {/* Purpose Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Payment Purpose (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Food, Dining"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
              />
            </div>
          </div>
        </div>

        {/* MITM Tamper Selection Sandbox (when enabled) */}
        {isMitmEnabled && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rose-600" />
                <span>Simulated Attacker Interceptor Sandbox</span>
              </span>
              <span className="text-[11px] text-slate-500">Configure what the attacker alters</span>
            </div>

            {/* Tamper Type Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTamperConfig({ ...tamperConfig, tamper_type: 'RECEIVER_MODIFIED' })}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  tamperConfig.tamper_type === 'RECEIVER_MODIFIED'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900">1. Divert Beneficiary</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Replaces receiver with attacker</div>
              </button>

              <button
                type="button"
                onClick={() => setTamperConfig({ ...tamperConfig, tamper_type: 'AMOUNT_MODIFIED' })}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  tamperConfig.tamper_type === 'AMOUNT_MODIFIED'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900">2. Inflate Amount</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Multiplies transfer amount (10x)</div>
              </button>

              <button
                type="button"
                onClick={() => setTamperConfig({ ...tamperConfig, tamper_type: 'FULL_PAYLOAD_TAMPER' })}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  tamperConfig.tamper_type === 'FULL_PAYLOAD_TAMPER'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900">3. Full Tamper</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Changes both payee and amount</div>
              </button>
            </div>

            {/* Live Tamper Payload Preview */}
            <div className="bg-white rounded-xl p-3 text-xs font-mono border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-500">Original Request:</span>{' '}
                <span className="text-emerald-700 font-bold">₹{amount} → {receiverName}</span>
              </div>
              <div className="text-rose-700">
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

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isMitmEnabled
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-98'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
            } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Communication Flow...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {isMitmEnabled ? 'Continue (Test MITM Detection)' : 'Continue (Run Security Analysis)'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
