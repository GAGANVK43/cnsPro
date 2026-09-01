import React, { useState } from 'react';
import { Key, Lock, Hash, ShieldCheck, Cpu, RefreshCw, CheckCircle2, Play, Sparkles } from 'lucide-react';

export default function CryptoLearningLab() {
  // Module 01: Diffie-Hellman State
  const [dhPrime, setDhPrime] = useState(23);
  const [dhGenerator, setDhGenerator] = useState(5);
  const [dhAlice, setDhAlice] = useState(6);
  const [dhBob, setDhBob] = useState(15);
  const [dhResult, setDhResult] = useState(null);

  // Fast Modular Exponentiation: (base^exp) % mod
  const modPow = (base, exp, mod) => {
    let res = 1n;
    let b = BigInt(base) % BigInt(mod);
    let e = BigInt(exp);
    const m = BigInt(mod);
    while (e > 0n) {
      if (e % 2n === 1n) res = (res * b) % m;
      b = (b * b) % m;
      e /= 2n;
    }
    return Number(res);
  };

  const handleRunDiffieHellman = () => {
    const p = Number(dhPrime) || 23;
    const g = Number(dhGenerator) || 5;
    const a = Number(dhAlice) || 6;
    const b = Number(dhBob) || 15;

    const A = modPow(g, a, p); // Alice Public
    const B = modPow(g, b, p); // Bob Public

    const secretAlice = modPow(B, a, p);
    const secretBob = modPow(A, b, p);

    setDhResult({
      p, g, a, b, A, B, secretAlice, secretBob,
      match: secretAlice === secretBob
    });
  };

  // Module 02: AES-GCM State
  const [aesMessage, setAesMessage] = useState('Pay ₹1,250 to Nisha Stores — reference: DEMO-042');
  const [aesKey, setAesKey] = useState(null);
  const [aesIv, setAesIv] = useState(null);
  const [aesCiphertextHex, setAesCiphertextHex] = useState('');
  const [aesDecrypted, setAesDecrypted] = useState('');
  const [aesStatus, setAesStatus] = useState('');

  const handleAesEncrypt = async () => {
    try {
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const data = encoder.encode(aesMessage);

      const ciphertextBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        data
      );

      const cipherArray = Array.from(new Uint8Array(ciphertextBuffer));
      const hex = cipherArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setAesKey(key);
      setAesIv(iv);
      setAesCiphertextHex(hex);
      setAesDecrypted('');
      setAesStatus(`Encrypted with 256-bit AES-GCM • IV: ${Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')}`);
    } catch (err) {
      setAesStatus('Encryption error: ' + err.message);
    }
  };

  const handleAesDecrypt = async () => {
    if (!aesKey || !aesIv || !aesCiphertextHex) {
      setAesStatus('No ciphertext generated yet. Click "Generate Key & Encrypt" first.');
      return;
    }
    try {
      const match = aesCiphertextHex.match(/.{1,2}/g);
      if (!match) return;
      const cipherBytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: aesIv },
        aesKey,
        cipherBytes
      );

      const decoder = new TextDecoder();
      const text = decoder.decode(decryptedBuffer);
      setAesDecrypted(text);
      setAesStatus('Decryption successful! Plaintext verified intact.');
    } catch (err) {
      setAesStatus('Decryption error: ' + err.message);
    }
  };

  // Module 03: SHA-256 State
  const [hashInput, setHashInput] = useState('UPI payment request: DEMO-042 | ₹1,250 | Nisha Stores');
  const [hashOutput, setHashOutput] = useState('');
  const [hashByteCount, setHashByteCount] = useState(0);

  const calculateSha256 = async (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    setHashByteCount(data.length);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleHashRun = async () => {
    const hash = await calculateSha256(hashInput);
    setHashOutput(hash);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Cryptography Learning Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Make the security protections <span className="bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">visible.</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Hands-on interactive building blocks behind a protected payment session. Run real Diffie-Hellman key derivation, AES-GCM symmetric encryption, and SHA-256 integrity hashing right in your browser.
          </p>
        </div>
      </div>

      {/* 3 Cryptography Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Diffie-Hellman Key Agreement */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">01</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Key Agreement</span>
                <h3 className="text-base font-bold text-white">Diffie–Hellman Exchange</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Two endpoints calculate the exact same shared secret key across an unsecure network without ever sending that secret.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Prime (p)</label>
                <input
                  type="number"
                  value={dhPrime}
                  onChange={(e) => setDhPrime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Generator (g)</label>
                <input
                  type="number"
                  value={dhGenerator}
                  onChange={(e) => setDhGenerator(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Payer Private (a)</label>
                <input
                  type="number"
                  value={dhAlice}
                  onChange={(e) => setDhAlice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Bank Private (b)</label>
                <input
                  type="number"
                  value={dhBob}
                  onChange={(e) => setDhBob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleRunDiffieHellman}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Run Key Exchange Calculation
            </button>

            {/* Output Box */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 min-h-[90px]">
              {dhResult ? (
                <>
                  <div className="text-slate-400">PUBLIC: <span className="text-white">p={dhResult.p}, g={dhResult.g}</span></div>
                  <div className="text-slate-400">EXCHANGED: <span className="text-cyan-400">A={dhResult.A}, B={dhResult.B}</span></div>
                  <div className="text-emerald-400 font-bold">
                    SHARED SECRET: <span className="underline">{dhResult.secretAlice}</span> ✓ MATCH!
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-[11px] pt-4 text-center">
                  Click "Run Key Exchange" to see derivation.
                </div>
              )}
            </div>

            {/* Step Explanation List */}
            {dhResult && (
              <ol className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                <li>1. Payer computes: <strong className="text-slate-200">A = {dhResult.g}^{dhResult.a} mod {dhResult.p} = {dhResult.A}</strong></li>
                <li>2. Bank computes: <strong className="text-slate-200">B = {dhResult.g}^{dhResult.b} mod {dhResult.p} = {dhResult.B}</strong></li>
                <li>3. Both calculate: <strong className="text-emerald-400">Secret = {dhResult.secretAlice}</strong></li>
              </ol>
            )}
          </div>
        </div>

        {/* Card 2: AES-GCM Confidentiality */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">02</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">Confidentiality</span>
                <h3 className="text-base font-bold text-white">AES-256 GCM Encryption</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Encrypts payment payload with an authenticated session key. Intermediaries only see unreadable ciphertext.
            </p>

            {/* Input */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Payment Payload to Encrypt</label>
              <textarea
                rows="3"
                value={aesMessage}
                onChange={(e) => setAesMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAesEncrypt}
                className="py-2.5 px-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Generate Key & Encrypt
              </button>

              <button
                onClick={handleAesDecrypt}
                className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
              >
                Decrypt Ciphertext
              </button>
            </div>

            {/* Output */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-2 min-h-[90px]">
              {aesCiphertextHex ? (
                <>
                  <div className="text-slate-400 text-[10px]">
                    CIPHERTEXT (HEX):
                  </div>
                  <div className="text-cyan-400 break-all text-[11px] select-all max-h-16 overflow-y-auto">
                    {aesCiphertextHex}
                  </div>
                  {aesDecrypted && (
                    <div className="pt-2 border-t border-slate-800 text-emerald-400 font-semibold text-[11px]">
                      DECRYPTED: "{aesDecrypted}"
                    </div>
                  )}
                </>
              ) : (
                <div className="text-slate-500 text-[11px] pt-4 text-center">
                  No ciphertext generated yet.
                </div>
              )}
            </div>

            {aesStatus && (
              <p className="text-[10px] font-mono text-slate-400">
                💡 {aesStatus}
              </p>
            )}
          </div>
        </div>

        {/* Card 3: SHA-256 Message Integrity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">03</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Message Integrity</span>
                <h3 className="text-base font-bold text-white">SHA-256 Cryptographic Hash</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes a 256-bit mathematical fingerprint. Any single letter or number alteration completely scrambles the output.
            </p>

            {/* Input */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Message to Fingerprint</label>
              <textarea
                rows="3"
                value={hashInput}
                onChange={async (e) => {
                  setHashInput(e.target.value);
                  const h = await calculateSha256(e.target.value);
                  setHashOutput(h);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <button
              onClick={handleHashRun}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              Calculate SHA-256 Digest
            </button>

            {/* Output */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-2 min-h-[90px]">
              {hashOutput ? (
                <>
                  <div className="text-slate-400 text-[10px]">
                    256-BIT DIGEST (64 HEX CHARACTERS):
                  </div>
                  <div className="text-amber-400 break-all text-[11px] font-bold select-all">
                    {hashOutput}
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-[11px] pt-4 text-center">
                  Type text above to observe instant hashing.
                </div>
              )}
            </div>

            <p className="text-[10px] font-mono text-slate-400">
              📊 Input: {hashByteCount} bytes • Output: 32 bytes (256 bits). One-way mathematical hash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
