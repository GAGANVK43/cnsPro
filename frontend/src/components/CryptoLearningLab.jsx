import React, { useState } from 'react';
import { Cpu, RefreshCw, Lock, Key, Hash, CheckCircle2 } from 'lucide-react';

export default function CryptoLearningLab() {
  // Module 01: Diffie-Hellman State
  const [dhPrime, setDhPrime] = useState(23);
  const [dhGenerator, setDhGenerator] = useState(5);
  const [dhAlice, setDhAlice] = useState(6);
  const [dhBob, setDhBob] = useState(15);
  const [dhResult, setDhResult] = useState(null);

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Cryptography Learning Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Make the security protections <span className="text-blue-600">visible.</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Hands-on interactive building blocks behind a protected payment session. Run real Diffie-Hellman key derivation, AES-GCM symmetric encryption, and SHA-256 integrity hashing right in your browser.
          </p>
        </div>
      </div>

      {/* 3 Cryptography Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Diffie-Hellman Key Agreement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">01</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Key Agreement</span>
                <h3 className="text-base font-bold text-slate-900">Diffie–Hellman Exchange</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Two endpoints calculate the exact same shared secret key across an unsecure network without ever transmitting that secret over the wire.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Prime (p)</label>
                <input
                  type="number"
                  value={dhPrime}
                  onChange={(e) => setDhPrime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Generator (g)</label>
                <input
                  type="number"
                  value={dhGenerator}
                  onChange={(e) => setDhGenerator(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Payer Private (a)</label>
                <input
                  type="number"
                  value={dhAlice}
                  onChange={(e) => setDhAlice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bank Private (b)</label>
                <input
                  type="number"
                  value={dhBob}
                  onChange={(e) => setDhBob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleRunDiffieHellman}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
            >
              Run Key Exchange Calculation
            </button>

            {/* Output Box */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 min-h-[90px]">
              {dhResult ? (
                <>
                  <div className="text-slate-600">PUBLIC: <span className="text-slate-900 font-bold">p={dhResult.p}, g={dhResult.g}</span></div>
                  <div className="text-slate-600">EXCHANGED: <span className="text-blue-700 font-bold">A={dhResult.A}, B={dhResult.B}</span></div>
                  <div className="text-emerald-700 font-bold">
                    SHARED SECRET: <span className="underline">{dhResult.secretAlice}</span> ✓ MATCH!
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-xs pt-4 text-center">
                  Click "Run Key Exchange" to see mathematical derivation.
                </div>
              )}
            </div>

            {/* Step Explanation List */}
            {dhResult && (
              <ol className="space-y-1.5 text-xs font-mono text-slate-600 pt-1 border-t border-slate-200">
                <li>1. Payer computes: <strong className="text-slate-900">A = {dhResult.g}^{dhResult.a} mod {dhResult.p} = {dhResult.A}</strong></li>
                <li>2. Bank computes: <strong className="text-slate-900">B = {dhResult.g}^{dhResult.b} mod {dhResult.p} = {dhResult.B}</strong></li>
                <li>3. Both calculate: <strong className="text-emerald-700">Secret = {dhResult.secretAlice}</strong></li>
              </ol>
            )}
          </div>
        </div>

        {/* Card 2: AES-GCM Confidentiality */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">02</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Confidentiality</span>
                <h3 className="text-base font-bold text-slate-900">AES-256 GCM Encryption</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Encrypts payment payload with an authenticated session key. Intermediaries only see unreadable ciphertext.
            </p>

            {/* Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Payment Payload to Encrypt</label>
              <textarea
                rows="3"
                value={aesMessage}
                onChange={(e) => setAesMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAesEncrypt}
                className="py-2.5 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
              >
                Generate Key & Encrypt
              </button>

              <button
                onClick={handleAesDecrypt}
                className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all cursor-pointer"
              >
                Decrypt Ciphertext
              </button>
            </div>

            {/* Output */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-2 min-h-[90px]">
              {aesCiphertextHex ? (
                <>
                  <div className="text-slate-500 text-[10px] font-semibold">
                    CIPHERTEXT (HEX):
                  </div>
                  <div className="text-blue-700 break-all text-xs select-all max-h-16 overflow-y-auto">
                    {aesCiphertextHex}
                  </div>
                  {aesDecrypted && (
                    <div className="pt-2 border-t border-slate-200 text-emerald-700 font-semibold text-xs">
                      DECRYPTED: "{aesDecrypted}"
                    </div>
                  )}
                </>
              ) : (
                <div className="text-slate-500 text-xs pt-4 text-center">
                  No ciphertext generated yet.
                </div>
              )}
            </div>

            {aesStatus && (
              <p className="text-xs font-mono text-slate-500">
                💡 {aesStatus}
              </p>
            )}
          </div>
        </div>

        {/* Card 3: SHA-256 Message Integrity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">03</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Message Integrity</span>
                <h3 className="text-base font-bold text-slate-900">SHA-256 Cryptographic Hash</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computes a 256-bit mathematical fingerprint. Any single letter or number alteration completely scrambles the output.
            </p>

            {/* Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Message to Fingerprint</label>
              <textarea
                rows="3"
                value={hashInput}
                onChange={async (e) => {
                  setHashInput(e.target.value);
                  const h = await calculateSha256(e.target.value);
                  setHashOutput(h);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <button
              onClick={handleHashRun}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer"
            >
              Calculate SHA-256 Digest
            </button>

            {/* Output */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-2 min-h-[90px]">
              {hashOutput ? (
                <>
                  <div className="text-slate-500 text-[10px] font-semibold">
                    256-BIT DIGEST (64 HEX CHARACTERS):
                  </div>
                  <div className="text-slate-900 break-all text-xs font-bold select-all">
                    {hashOutput}
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-xs pt-4 text-center">
                  Type text above to observe instant hashing.
                </div>
              )}
            </div>

            <p className="text-xs font-mono text-slate-500">
              📊 Input: {hashByteCount} bytes • Output: 32 bytes (256 bits). One-way mathematical hash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
