import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PresentationMode({
  isOpen,
  onClose,
  onRunStep,
  onReset
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const presentationSteps = [
    {
      step: 1,
      title: 'Introduction & Safe Environment',
      narrator: 'Welcome to the UPI Payment Communication Visualizer. Our goal is to demonstrate what happens behind the scenes of a digital payment and how cryptographic integrity defends against Man-in-the-Middle (MITM) attacks.',
      actionType: 'RESET_CLEAN',
      status: 'info'
    },
    {
      step: 2,
      title: 'Scenario 1: Normal Secure Payment Flow',
      narrator: 'The user initiates a ₹500 payment to Rahul. The smartphone constructs the payment body and computes a cryptographic SHA-256 digital fingerprint to seal the message.',
      actionType: 'SEND_NORMAL',
      status: 'secure'
    },
    {
      step: 3,
      title: 'Direct Transmission & Verification',
      narrator: 'The payment packet travels across the network. The bank server recalculates the hash over the received payload. The digests match perfectly (Original Hash == Received Hash), and the payment is safely approved.',
      actionType: 'VERIFY_NORMAL',
      status: 'secure'
    },
    {
      step: 4,
      title: 'Scenario 2: Introducing the MITM Attacker',
      narrator: 'Now, we introduce a simulated rogue intermediary (such as an attacker on an unencrypted public Wi-Fi network) situated between the sender and the bank.',
      actionType: 'ENABLE_MITM',
      status: 'threat'
    },
    {
      step: 5,
      title: 'Payload Interception & Tampering',
      narrator: 'The user attempts a payment. In transit, the attacker intercepts the unverified packet and alters the beneficiary from Rahul to "Attacker (Mallory)" and inflates the amount.',
      actionType: 'SEND_TAMPERED',
      status: 'threat'
    },
    {
      step: 6,
      title: 'Cryptographic Detection & Instant Block',
      narrator: 'The bank receives the tampered packet and recalculates the SHA-256 digest. Because of the Avalanche Effect, the hash is completely mismatched! The security engine triggers an immediate risk alert and halts the transaction.',
      actionType: 'TRIGGER_ALERT',
      status: 'threat'
    },
    {
      step: 7,
      title: 'Forensic Timeline & Technical Deep-Dive',
      narrator: 'The user receives a plain-language explanation of what happened. Evaluators can inspect the exact character-level hash differences and raw JSON payload comparison in the Technical Details modal.',
      actionType: 'SHOW_FORENSICS',
      status: 'info'
    },
    {
      step: 8,
      title: 'Conclusion & Defense Summary',
      narrator: 'In production UPI networks, multi-layered defenses like SSL Certificate Pinning, Hardware SIM Binding, and HMAC signatures ensure that unauthorized tampering is mathematically impossible.',
      actionType: 'SUMMARY',
      status: 'secure'
    }
  ];

  const currentStep = presentationSteps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        if (currentStepIndex < presentationSteps.length - 1) {
          handleNext();
        } else {
          setIsPlaying(false);
        }
      }, 7000); // 7 seconds per slide
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, isOpen]);

  const handleNext = () => {
    if (currentStepIndex < presentationSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onRunStep(presentationSteps[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onRunStep(presentationSteps[prevIdx]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/50 rounded-2xl p-5 shadow-2xl shadow-indigo-950/50 space-y-4">
        {/* Top bar with Step Counter & Controls */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Presentation / Demo Mode
              </span>
              <span className="text-slate-500 text-xs ml-2">
                (Slide {currentStep.step} of {presentationSteps.length})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === presentationSteps.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
              title="Exit presentation mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Title & Narrator Script */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{currentStep.title}</span>
          </h4>

          {/* Narrator Voiceover Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{currentStep.narrator}"
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / presentationSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
