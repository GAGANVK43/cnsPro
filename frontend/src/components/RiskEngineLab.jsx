import React, { useState, useId } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Sliders, Smartphone, Wifi, Lock, Zap, RefreshCw, Key, Radio, Info } from 'lucide-react';

export default function RiskEngineLab({ onQuickLoadToJourney }) {
  // Scenario Inputs
  const [payer, setPayer] = useState('Aarav');
  const [payee, setPayee] = useState('Nisha Stores');
  const [payerVpa, setPayerVpa] = useState('aarav@bank');
  const [payeeVpa, setPayeeVpa] = useState('nisha.stores@bank');
  const [amount, setAmount] = useState('1250');
  const [deviceTrust, setDeviceTrust] = useState(6); // 0: Managed, 6: Personal, 16: Unknown
  const [paymentApp, setPaymentApp] = useState('UPI app');
  const [paymentTime, setPaymentTime] = useState(5); // 0: Daytime, 5: Evening, 12: Late night
  const [network, setNetwork] = useState(28); // 0: Mobile, 10: Home, 28: Public, 18: Campus
  const [signal, setSignal] = useState(5); // 0: Stable, 5: Intermittent, 12: Captive
  const [vpn, setVpn] = useState(false);
  const [warningSeen, setWarningSeen] = useState(true);

  // Security Controls
  const [tls, setTls] = useState(true);
  const [pinning, setPinning] = useState(true);
  const [signed, setSigned] = useState(true);
  const [mfa, setMfa] = useState(true);

  // Calculate Risk Score (0 - 100)
  const calculateScore = () => {
    let score = Number(network) + Number(signal) + Number(deviceTrust) + Number(paymentTime);
    if (!vpn) score += 8;
    if (!warningSeen) score += 7;
    if (!tls) score += 27;
    if (!pinning) score += 22;
    if (!signed) score += 18;
    if (!mfa) score += 15;
    return Math.max(4, Math.min(98, score));
  };

  const score = calculateScore();
  const grade = score < 30 ? 'low' : score < 62 ? 'medium' : 'high';

  const riskLabel = grade === 'low' ? 'LOW EXPOSURE' : grade === 'medium' ? 'ELEVATED EXPOSURE' : 'HIGH EXPOSURE';
  const riskColor = grade === 'low' ? 'text-emerald-400' : grade === 'medium' ? 'text-amber-400' : 'text-rose-400';
  const meterColor = grade === 'low' ? '#34d399' : grade === 'medium' ? '#fbbf24' : '#f87171';

  // Risk drivers list
  const getRiskDrivers = () => {
    const drivers = [];
    if (Number(network) >= 18) drivers.push('Shared / Public network');
    if (Number(signal) >= 5) drivers.push('Untrusted connection state');
    if (Number(deviceTrust) >= 6) drivers.push('Device trust not managed');
    if (Number(paymentTime) >= 5) drivers.push('Unusual payment time');
    if (!vpn) drivers.push('No trusted VPN');
    if (!warningSeen) drivers.push('Network warning ignored');
    if (!tls) drivers.push('TLS 1.3 encryption off (Severe)');
    if (!pinning) drivers.push('Certificate pinning disabled');
    if (!signed) drivers.push('Request signature missing');
    if (!mfa) drivers.push('UPI PIN / MFA disabled');
    return drivers.length ? drivers : ['No material risk drivers detected — Optimal Configuration'];
  };

  const drivers = getRiskDrivers();

  const handleResetDefaults = () => {
    setPayer('Aarav');
    setPayee('Nisha Stores');
    setPayerVpa('aarav@bank');
    setPayeeVpa('nisha.stores@bank');
    setAmount('1250');
    setDeviceTrust(6);
    setPaymentApp('UPI app');
    setPaymentTime(5);
    setNetwork(28);
    setSignal(5);
    setVpn(false);
    setWarningSeen(true);
    setTls(true);
    setPinning(true);
    setSigned(true);
    setMfa(true);
  };

  const formatINR = (val) => '₹' + Number(val || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Risk Engine & Exposure Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            See where a payment can be <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">intercepted.</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Configure simulated payment environments, introduce untrusted Wi-Fi conditions, and toggle transport & application-layer controls to see how risk exposure is calculated in real time.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Lab Scenario</span>
        </button>
      </div>

      {/* Main 3-Column Configuration & Readout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 01 Payment Scenario & 02 Security Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 01: Payment Scenario */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">01</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payment Scenario</h3>
              </div>
              <span className="text-[11px] text-slate-400">Context parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Payer Name</label>
                <input
                  type="text"
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Payee Name</label>
                <input
                  type="text"
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Payer UPI ID</label>
                <input
                  type="text"
                  value={payerVpa}
                  onChange={(e) => setPayerVpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Payee UPI ID</label>
                <input
                  type="text"
                  value={payeeVpa}
                  onChange={(e) => setPayeeVpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Device Trust</label>
                <select
                  value={deviceTrust}
                  onChange={(e) => setDeviceTrust(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="0">Managed / Enterprise (0 pts)</option>
                  <option value="6">Personal Unmanaged (6 pts)</option>
                  <option value="16">Unknown / Jailbroken (16 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Network Connection</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="0">Mobile Network 5G (0 pts)</option>
                  <option value="10">Home Encrypted Wi-Fi (10 pts)</option>
                  <option value="18">Office / Campus Wi-Fi (18 pts)</option>
                  <option value="28">Public Unsecured Wi-Fi (28 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Connection State</label>
                <select
                  value={signal}
                  onChange={(e) => setSignal(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="0">Stable Direct (0 pts)</option>
                  <option value="5">Intermittent / Fluctuating (5 pts)</option>
                  <option value="12">Captive Portal / Proxy Intercept (12 pts)</option>
                </select>
              </div>
            </div>

            {/* VPN & Warning Toggles */}
            <div className="pt-2 space-y-2 border-t border-slate-800">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs">
                <span className="text-slate-300 font-medium">Trusted VPN Active</span>
                <input
                  type="checkbox"
                  checked={vpn}
                  onChange={(e) => setVpn(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs">
                <span className="text-slate-300 font-medium">Network Warning Acknowledged</span>
                <input
                  type="checkbox"
                  checked={warningSeen}
                  onChange={(e) => setWarningSeen(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>

          {/* Section 02: Security Controls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">02</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Security Controls</h3>
              </div>
              <span className="text-[11px] text-slate-400">Toggle defenses</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TLS 1.3 Encrypted Channel</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Encrypts network packets to prevent readable eavesdropping.</p>
                </div>
                <input
                  type="checkbox"
                  checked={tls}
                  onChange={(e) => setTls(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Certificate Pinning</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Rejects rogue CA certificates inserted by rogue proxy nodes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={pinning}
                  onChange={(e) => setPinning(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Signed Payment Request (SHA-256 HMAC)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Cryptographically seals payload to detect in-transit tampering.</p>
                </div>
                <input
                  type="checkbox"
                  checked={signed}
                  onChange={(e) => setSigned(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                    <span>UPI PIN & Device 2FA Approval</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Blocks unauthorized transaction execution without user consent.</p>
                </div>
                <input
                  type="checkbox"
                  checked={mfa}
                  onChange={(e) => setMfa(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: 03 Exposure Readout & 04 Event Trace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 03: Exposure Readout Gauge Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">03</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Exposure Readout</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                grade === 'low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                grade === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {grade === 'low' ? 'Protected Path' : grade === 'medium' ? 'Controls Incomplete' : 'Unsafe Configuration'}
              </span>
            </div>

            {/* Radial Meter & Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              {/* SVG Radial Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="fill-none transition-all duration-700 ease-out"
                    strokeWidth="10"
                    strokeLinecap="round"
                    stroke={meterColor}
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 * (1 - score / 100)}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className={`text-3xl font-extrabold tracking-tight ${riskColor}`}>{score}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Exposure / 100</span>
                </div>
              </div>

              {/* Classification & Verdict */}
              <div className="space-y-2 text-center sm:text-left max-w-sm">
                <div className={`text-sm font-extrabold tracking-wider uppercase ${riskColor}`}>
                  {riskLabel}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {grade === 'low' && 'Layered controls substantially limit interception and modification opportunities.'}
                  {grade === 'medium' && 'Some safeguards are missing. An untrusted network increases the value of a fake endpoint.'}
                  {grade === 'high' && 'The payment path has weak trust signals. Avoid continuing until the network and protections are restored.'}
                </p>
                <div className="text-[11px] font-mono text-slate-400">
                  Payment: <strong className="text-white">{payer} → {payee}</strong> ({formatINR(amount)})
                </div>
              </div>
            </div>

            {/* Decision Recommendation Box */}
            <div className={`p-4 rounded-xl text-xs font-semibold leading-relaxed border ${
              score < 30
                ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40'
                : score < 62
                ? 'bg-amber-950/30 text-amber-300 border-amber-500/40'
                : 'bg-rose-950/30 text-rose-300 border-rose-500/40'
            }`}>
              <div className="flex items-start gap-2">
                <span className="text-base">
                  {score < 30 ? '✓' : score < 62 ? '△' : '×'}
                </span>
                <div>
                  <strong className="block mb-0.5">Recommended Action:</strong>
                  {score < 30 && '✓ Continue only after verifying the payee name and UPI ID in your app.'}
                  {score >= 30 && score < 62 && '△ Pause and use mobile data or a trusted network; turn on every missing security control first.'}
                  {score >= 62 && '× Stop this simulated payment! Do not enter a PIN on this path—switch to mobile data (5G) or a known trusted network immediately.'}
                </div>
              </div>
            </div>

            {/* Risk Drivers Detected Pills */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Risk Drivers Detected:</span>
              <div className="flex flex-wrap gap-1.5">
                {drivers.map((d, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                      d.includes('Optimal')
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-950 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 04: Security Event Trace Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">04</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Security Event Trace</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Simulated Audit Steps</span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-300">
              <li className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <span className="font-bold text-emerald-400 shrink-0">1.</span>
                <span><strong>Scenario initialized.</strong> {payer} prepares a fictional {formatINR(amount)} request in {paymentApp}.</span>
              </li>
              <li className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <span className="font-bold text-cyan-400 shrink-0">2.</span>
                <span><strong>Recipient check.</strong> Intended recipient: {payee} · {payeeVpa}.</span>
              </li>
              <li className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <span className="font-bold text-amber-400 shrink-0">3.</span>
                <span><strong>Network context assessed.</strong> {network >= 28 ? 'Public Wi-Fi' : network >= 18 ? 'Campus Network' : network >= 10 ? 'Home Wi-Fi' : 'Mobile 5G'} ({signal >= 12 ? 'Captive Portal' : signal >= 5 ? 'Intermittent' : 'Stable'}).</span>
              </li>
              <li className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <span className="font-bold text-purple-400 shrink-0">4.</span>
                <span><strong>Channel evaluation.</strong> {tls ? 'A TLS 1.3 protected session is established and certificate validity is checked.' : 'No encrypted transport protection is modeled for this session (Critical Gap).'}</span>
              </li>
              <li className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <span className="font-bold text-indigo-400 shrink-0">5.</span>
                <span><strong>Integrity evaluation.</strong> {signed ? 'The request carries a signed cryptographic hash check (HMAC-SHA256).' : 'The request has no modeled tamper-evidence layer.'}</span>
              </li>
              <li className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <span className="font-bold text-rose-400 shrink-0">6.</span>
                <span><strong>Authorization evaluation.</strong> {mfa ? 'UPI PIN & biometric approval confirmed.' : 'No second confirmation barrier is active.'}</span>
              </li>
              <li className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5 font-semibold text-white">
                <span className="font-bold text-emerald-400 shrink-0">7.</span>
                <span><strong>Outcome:</strong> {score < 30 ? 'Interception attempts are strongly constrained by layered controls.' : score < 62 ? 'Risk is measurable; restore missing controls before executing.' : 'High risk! Do not proceed on this network configuration.'}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
