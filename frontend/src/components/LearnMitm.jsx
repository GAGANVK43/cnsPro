import React, { useState } from 'react';
import { BookOpen, ShieldCheck, ShieldAlert, Lock, Radio, Key, CheckCircle2, HelpCircle, Zap, RefreshCw } from 'lucide-react';

export default function LearnMitm() {
  const [selectedTopic, setSelectedTopic] = useState('what-is-mitm');
  const [diagramMode, setDiagramMode] = useState('normal'); // 'normal' | 'mitm' | 'protected'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const topics = [
    { id: 'what-is-mitm', title: '1. What is MITM?', icon: ShieldAlert },
    { id: 'normal-vs-mitm', title: '2. Normal vs MITM Flow', icon: Radio },
    { id: 'encryption', title: '3. Why Encryption Matters', icon: Lock },
    { id: 'integrity', title: '4. Cryptographic Hashing', icon: Key },
    { id: 'upi-defense', title: '5. How UPI Defends', icon: ShieldCheck },
    { id: 'staying-safe', title: '6. User Best Practices', icon: Zap },
    { id: 'quiz', title: '7. Knowledge Check Quiz', icon: HelpCircle }
  ];

  const handleQuizSelect = (questionId, optionIdx) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: optionIdx });
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'Where does an attacker position themselves in a Man-in-the-Middle (MITM) scenario?',
      options: [
        'Directly inside the bank’s central vault database',
        'Between the user device and the payment server on the communication path',
        'Inside the physical ATM cash dispenser',
        'In the user’s SIM card manufacturer facility'
      ],
      correct: 1,
      explanation: 'MITM occurs when a malicious intermediary intercepts communication packets travelling between the user app and the payment server.'
    },
    {
      id: 'q2',
      question: 'How does cryptographic hashing (e.g. SHA-256) detect if an amount was modified from ₹500 to ₹5000?',
      options: [
        'The bank calls the user by telephone',
        'The hash value calculated on the received text will completely differ from the sender’s sealed hash',
        'The phone screen starts flashing red automatically',
        'The internet router rejects packets with large numbers'
      ],
      correct: 1,
      explanation: 'Due to the avalanche effect in cryptographic hashing, even a tiny change in numbers produces a completely unrecognizable new digest that triggers an integrity failure.'
    },
    {
      id: 'q3',
      question: 'Why is public, unencrypted Wi-Fi (like at airports or cafes) a common MITM vector?',
      options: [
        'Public Wi-Fi slows down phone charging',
        'Attackers on the same unmanaged network can broadcast rogue ARP/DNS signals to route traffic through their device',
        'Public Wi-Fi is illegal in most countries',
        'Public Wi-Fi deletes the user’s UPI app'
      ],
      correct: 1,
      explanation: 'Unsecured public Wi-Fi networks allow attackers on the same local subnet to perform rogue routing and intercept unprotected packets.'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Security Learning Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Understanding MITM Attacks & Defense
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Explore visual diagrams, cryptographic integrity concepts, and how modern fintech architectures safeguard digital transactions.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs h-fit">
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {selectedTopic === 'what-is-mitm' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Concept 01</span>
                <h2 className="text-xl font-bold text-slate-900">What is a Man-in-the-Middle (MITM) Attack?</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A Man-in-the-Middle (MITM) attack occurs when an unauthorized entity positions themselves between two communicating parties (such as your phone and your bank) to secretly eavesdrop on or alter the communication.
                </p>
              </div>

              {/* Real World Analogy Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">💡 The Real-World Analogy</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Imagine writing a check for ₹500 to Rahul and putting it in a mailbox. An attacker intercepts the postal delivery truck, uses special ink to change the recipient to "Mallory" and the amount to ₹50,000, and puts it back in the mailbox. If the bank cannot verify that the check was tampered with, unauthorized loss occurs!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-emerald-800">📱 What the user thinks</div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "I am directly connected to my bank's secure server and sending ₹500 to my friend."
                  </p>
                </div>

                <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-rose-800">🔴 What actually happens during MITM</div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "The communication packet is captured by a rogue intermediary before reaching the destination."
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTopic === 'normal-vs-mitm' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Concept 02</span>
                <h2 className="text-xl font-bold text-slate-900">Visualizing Communication Paths</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Toggle between communication modes to see how packets move across the network.
                </p>
              </div>

              {/* Interactive Diagram Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 max-w-md">
                <button
                  onClick={() => setDiagramMode('normal')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    diagramMode === 'normal' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setDiagramMode('mitm')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    diagramMode === 'mitm' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  MITM Intercepted
                </button>
                <button
                  onClick={() => setDiagramMode('protected')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    diagramMode === 'protected' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Protected (TLS + Hash)
                </button>
              </div>

              {/* Dynamic Diagram Render */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center min-h-[200px] text-center">
                {diagramMode === 'normal' && (
                  <div className="space-y-4">
                    <div className="font-mono text-sm font-bold text-emerald-700 flex items-center justify-center gap-4 flex-wrap">
                      <span className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900">📱 USER</span>
                      <span className="text-slate-400">──────── ➔ ────────</span>
                      <span className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900">🏦 SERVER</span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-md">
                      Data travels directly without interference. No rogue intermediary is present.
                    </p>
                  </div>
                )}

                {diagramMode === 'mitm' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="font-mono text-sm font-bold flex items-center justify-center gap-3 flex-wrap">
                      <span className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900">📱 USER</span>
                      <span className="text-rose-500">── ➔ ──</span>
                      <span className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-bold">
                        🔴 ATTACKER
                      </span>
                      <span className="text-rose-500">── ➔ ──</span>
                      <span className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900">🏦 SERVER</span>
                    </div>
                    <p className="text-xs text-rose-700 max-w-md">
                      Attacker intercepts the packet, modifies data (e.g. changes payee or amount), and forwards tampered info.
                    </p>
                  </div>
                )}

                {diagramMode === 'protected' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="font-mono text-sm font-bold text-blue-700 flex items-center justify-center gap-3 flex-wrap">
                      <span className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900">📱 USER</span>
                      <span className="text-blue-600 font-extrabold">════ 🛡️ (End-to-End Signed) ════</span>
                      <span className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900">🏦 SERVER</span>
                    </div>
                    <p className="text-xs text-blue-700 max-w-md">
                      Cryptographic hashes & digital signatures seal the message. If modified, the bank immediately detects the mismatch and rejects the transaction.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTopic === 'encryption' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Concept 03</span>
                <h2 className="text-xl font-bold text-slate-900">Why Encryption Alone Isn't Enough</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Encryption provides <strong>confidentiality</strong> (scrambles text so eavesdroppers cannot read it), but secure digital payments require the complete Security Triad:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-blue-700">1. Confidentiality</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hides payment data from snooping eyes on public networks using TLS 1.3 encryption.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-700">2. Integrity</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Guarantees that not a single digit or letter was modified in transit using SHA-256 digests.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-amber-700">3. Authentication</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verifies that the message truly originated from the authorized app using HMAC signatures.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTopic === 'integrity' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Concept 04</span>
                <h2 className="text-xl font-bold text-slate-900">How Cryptographic Hashing Catches Tampering</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Cryptographic hash functions like SHA-256 convert any input data into a fixed 64-character hexadecimal digest.
                </p>
              </div>

              {/* Avalanche demonstration */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  The "Avalanche Effect" in Action
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Input: </span>
                    <span className="text-emerald-700 font-bold">"₹500 to Rahul"</span>
                    <div className="text-slate-600 text-xs mt-1 break-all">
                      SHA256: 4f5a89b...e21c (Example Digest A)
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Input: </span>
                    <span className="text-rose-700 font-bold">"₹5000 to Rahul"</span> (just one extra 0!)
                    <div className="text-rose-700 text-xs mt-1 break-all">
                      SHA256: 9b27da1...88ff (Example Digest B - completely different!)
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Because the hash changes completely, the receiving bank server instantly detects the difference and refuses the payment.
                </p>
              </div>
            </div>
          )}

          {selectedTopic === 'upi-defense' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Concept 05</span>
                <h2 className="text-xl font-bold text-slate-900">How Real UPI Systems Prevent MITM</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Real-world Unified Payments Interface (UPI) implementations use multi-layered defense architectures:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-sm">01</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">SSL / TLS Certificate Pinning</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      The mobile app only trusts the hardcoded public certificate of the bank, ignoring fake root certificates installed by rogue intermediaries.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-sm">02</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Device Binding & SIM Binding</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Cryptographic credentials are tied to the physical SIM card and hardware security module on your smartphone.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-sm">03</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication & Cryptographic Nonces</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Each transaction uses a one-time random number (Nonce) so intercepted transactions cannot be duplicated or replayed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTopic === 'staying-safe' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Concept 06</span>
                <h2 className="text-xl font-bold text-slate-900">How Everyday Users Can Stay Safe</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Key security habits for students and non-technical users:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-rose-700">🚫 Avoid Public Wi-Fi for Payments</h4>
                  <p className="text-xs text-slate-600">
                    Use mobile data (5G) instead of unencrypted public Wi-Fi when sending money.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-700">✓ Verify Beneficiary Name</h4>
                  <p className="text-xs text-slate-600">
                    Always double-check the verified payee name shown before confirming.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-amber-700">⚠ Never Share UPI PIN to Receive Money</h4>
                  <p className="text-xs text-slate-600">
                    A UPI PIN is only needed to send money. Receiving money never requires a PIN.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-blue-700">🔒 Keep OS & Apps Updated</h4>
                  <p className="text-xs text-slate-600">
                    Security patches fix network vulnerabilities in TLS and Wi-Fi drivers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTopic === 'quiz' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Knowledge Check</span>
                <h2 className="text-xl font-bold text-slate-900">Interactive MITM Security Quiz</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Test your understanding of communication security and MITM defense concepts.
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-5">
                {quizQuestions.map((q, qIdx) => (
                  <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      {qIdx + 1}. {q.question}
                    </h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = q.correct === optIdx;
                        let optionStyle = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                          }
                        } else if (isSelected) {
                          optionStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-semibold';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => !quizSubmitted && handleQuizSelect(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 font-mono">
                        💡 <strong className="text-blue-700">Explanation: </strong>{q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit / Reset Quiz */}
              <div className="flex gap-3">
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-xs transition-all cursor-pointer"
                  >
                    Check Answers
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
