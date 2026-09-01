import React, { useState } from 'react';
import { Sliders, RefreshCw, Lock, ShieldCheck, Key, Smartphone, Info } from 'lucide-react';

export default function RiskEngineLab() {
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
  const riskTextColor = grade === 'low' ? 'text-emerald-700' : grade === 'medium' ? 'text-amber-700' : 'text-rose-700';
  const meterColor = grade === 'low' ? '#059669' : grade === 'medium' ? '#d97706' : '#e11d48';

  // Risk drivers
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Risk Engine & Exposure Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            See where a payment can be <span className="text-blue-600">intercepted.</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Configure simulated payment environments, introduce untrusted Wi-Fi conditions, and toggle transport & application-layer controls to see how risk exposure is calculated in real time.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Reset Lab Scenario</span>
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 01 Payment Scenario & 02 Security Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 01: Payment Scenario */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">01</span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Payment Scenario</h3>
              </div>
              <span className="text-xs text-slate-500">Context parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payer Name</label>
                <input
                  type="text"
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payee Name</label>
                <input
                  type="text"
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payer UPI ID</label>
                <input
                  type="text"
                  value={payerVpa}
                  onChange={(e) => setPayerVpa(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payee UPI ID</label>
                <input
                  type="text"
                  value={payeeVpa}
                  onChange={(e) => setPayeeVpa(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Device Trust</label>
                <select
                  value={deviceTrust}
                  onChange={(e) => setDeviceTrust(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="0">Managed / Enterprise (0 pts)</option>
                  <option value="6">Personal Unmanaged (6 pts)</option>
                  <option value="16">Unknown / Jailbroken (16 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Network Connection</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="0">Mobile Network 5G (0 pts)</option>
                  <option value="10">Home Encrypted Wi-Fi (10 pts)</option>
                  <option value="18">Office / Campus Wi-Fi (18 pts)</option>
                  <option value="28">Public Unsecured Wi-Fi (28 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Connection State</label>
                <select
                  value={signal}
                  onChange={(e) => setSignal(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="0">Stable Direct (0 pts)</option>
                  <option value="5">Intermittent / Fluctuating (5 pts)</option>
                  <option value="12">Captive Portal / Proxy Intercept (12 pts)</option>
                </select>
              </div>
            </div>

            {/* VPN & Warning Toggles */}
            <div className="pt-2 space-y-2 border-t border-slate-200">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer text-xs">
                <span className="text-slate-700 font-medium">Trusted VPN Active</span>
                <input
                  type="checkbox"
                  checked={vpn}
                  onChange={(e) => setVpn(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer text-xs">
                <span className="text-slate-700 font-medium">Network Warning Acknowledged</span>
                <input
                  type="checkbox"
                  checked={warningSeen}
                  onChange={(e) => setWarningSeen(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Section 02: Security Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">02</span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Security Controls</h3>
              </div>
              <span className="text-xs text-slate-500">Toggle defenses</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>TLS 1.3 Encrypted Channel</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Encrypts network packets to prevent readable eavesdropping.</p>
                </div>
                <input
                  type="checkbox"
                  checked={tls}
                  onChange={(e) => setTls(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-blue-600"
                />
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Certificate Pinning</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Rejects rogue CA certificates inserted by proxy intermediaries.</p>
                </div>
                <input
                  type="checkbox"
                  checked={pinning}
                  onChange={(e) => setPinning(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-blue-600"
                />
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Signed Payment Request (SHA-256 HMAC)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Cryptographically seals payload to detect in-transit tampering.</p>
                </div>
                <input
                  type="checkbox"
                  checked={signed}
                  onChange={(e) => setSigned(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-blue-600"
                />
              </label>

              <label className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>UPI PIN & Device 2FA Approval</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Blocks unauthorized transaction execution without user consent.</p>
                </div>
                <input
                  type="checkbox"
                  checked={mfa}
                  onChange={(e) => setMfa(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-blue-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: 03 Exposure Readout & 04 Event Trace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 03: Exposure Readout Gauge Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">03</span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Exposure Readout</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                grade === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                grade === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {grade === 'low' ? '🟢 Protected Path' : grade === 'medium' ? '🟡 Controls Incomplete' : '🔴 Unsafe Configuration'}
              </span>
            </div>

            {/* Radial Meter & Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              {/* SVG Radial Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-slate-200 fill-none"
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
                  <span className={`text-3xl font-extrabold tracking-tight ${riskTextColor}`}>{score}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Exposure / 100</span>
                </div>
              </div>

              {/* Classification & Verdict */}
              <div className="space-y-2 text-center sm:text-left max-w-sm">
                <div className={`text-sm font-extrabold tracking-wider uppercase ${riskTextColor}`}>
                  {riskLabel}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {grade === 'low' && 'Layered controls substantially limit interception and modification opportunities.'}
                  {grade === 'medium' && 'Some safeguards are missing. An untrusted network increases the value of a fake endpoint.'}
                  {grade === 'high' && 'The payment path has weak trust signals. Avoid continuing until the network and protections are restored.'}
                </p>
                <div className="text-xs font-mono text-slate-500">
                  Payment: <strong className="text-slate-800">{payer} → {payee}</strong> ({formatINR(amount)})
                </div>
              </div>
            </div>

            {/* Decision Recommendation Box */}
            <div className={`p-4 rounded-xl text-xs font-semibold leading-relaxed border ${
              score < 30
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : score < 62
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
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

            {/* Risk Drivers Detected */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Risk Drivers Detected:</span>
              <div className="flex flex-wrap gap-1.5">
                {drivers.map((d, i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full border ${
                      d.includes('Optimal')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 04: Security Event Trace Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">04</span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Security Event Trace</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Simulated Audit Steps</span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700">
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">1.</span>
                <span><strong>Scenario initialized:</strong> {payer} prepares a fictional {formatINR(amount)} request in {paymentApp}.</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">2.</span>
                <span><strong>Recipient check:</strong> Intended recipient: {payee} · {payeeVpa}.</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">3.</span>
                <span><strong>Network context assessed:</strong> {network >= 28 ? 'Public Wi-Fi' : network >= 18 ? 'Campus Network' : network >= 10 ? 'Home Wi-Fi' : 'Mobile 5G'} ({signal >= 12 ? 'Captive Portal' : signal >= 5 ? 'Intermittent' : 'Stable'}).</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">4.</span>
                <span><strong>Channel evaluation:</strong> {tls ? 'A TLS 1.3 protected session is established and certificate validity is checked.' : 'No encrypted transport protection is modeled for this session (Critical Gap).'}</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">5.</span>
                <span><strong>Integrity evaluation:</strong> {signed ? 'The request carries a signed cryptographic hash check (HMAC-SHA256).' : 'The request has no modeled tamper-evidence layer.'}</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold text-blue-600 shrink-0">6.</span>
                <span><strong>Authorization evaluation:</strong> {mfa ? 'UPI PIN & biometric approval confirmed.' : 'No second confirmation barrier is active.'}</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 font-semibold text-slate-900">
                <span className="font-bold text-emerald-600 shrink-0">7.</span>
                <span><strong>Outcome:</strong> {score < 30 ? 'Interception attempts are strongly constrained by layered controls.' : score < 62 ? 'Risk is measurable; restore missing controls before executing.' : 'High risk! Do not proceed on this network configuration.'}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
