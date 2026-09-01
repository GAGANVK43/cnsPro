import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PaymentSimulator from './components/PaymentSimulator';
import PaymentJourney from './components/PaymentJourney';
import BackgroundActivity from './components/BackgroundActivity';
import SecurityAlertModal from './components/SecurityAlertModal';
import ForensicTimeline from './components/ForensicTimeline';
import TechnicalDetailsModal from './components/TechnicalDetailsModal';
import LearnMitm from './components/LearnMitm';
import PresentationMode from './components/PresentationMode';
import SimulationHistory from './components/SimulationHistory';
import RiskEngineLab from './components/RiskEngineLab';
import CryptoLearningLab from './components/CryptoLearningLab';

import {
  submitPayment,
  verifyPayment,
  getSimulationHistory,
  resetSimulation,
  checkBackendHealth
} from './services/api';

export default function App() {
  // Navigation & Tabs: 'simulator' | 'risk-lab' | 'crypto-lab' | 'learn' | 'history' | 'forensics'
  const [activeTab, setActiveTab] = useState('simulator');
  const [isGuidedMode, setIsGuidedMode] = useState(true);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isTechDetailsOpen, setIsTechDetailsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Simulation State
  const [simulationStep, setSimulationStep] = useState(0); // 0 to 6
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMitmEnabled, setIsMitmEnabled] = useState(false);
  const [tamperConfig, setTamperConfig] = useState({
    is_mitm_enabled: false,
    tamper_type: 'RECEIVER_MODIFIED',
    modified_receiver_name: 'Unknown Attacker (Mallory)',
    modified_receiver_vpa: 'attacker@badbank',
    modified_amount: 5000.0,
    modified_purpose: 'Unauthorized Transfer'
  });

  const [originalPayload, setOriginalPayload] = useState(null);
  const [receivedPayload, setReceivedPayload] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [finalStatus, setFinalStatus] = useState(null); // 'APPROVED' | 'BLOCKED'
  const [events, setEvents] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch initial history
  useEffect(() => {
    async function init() {
      await checkBackendHealth();
      const histData = await getSimulationHistory();
      if (histData?.history) {
        setHistory(histData.history);
      }
    }
    init();
  }, []);

  // Handler: Payment Execution Flow
  const handlePaymentSubmit = async (paymentData, customTamperConfig) => {
    setIsProcessing(true);
    setSimulationStep(1);
    setFinalStatus(null);

    const activeTamper = {
      ...customTamperConfig,
      is_mitm_enabled: isMitmEnabled
    };

    // Step 1: Created & Digest Generated
    const result = await submitPayment(paymentData, activeTamper);
    setOriginalPayload(result.original_payload);
    
    // Animate stage transitions
    setTimeout(() => {
      // Step 2: Communication started
      setSimulationStep(2);

      setTimeout(() => {
        // Step 3: Transit / Interception
        setSimulationStep(3);
        setReceivedPayload(result.received_payload);

        setTimeout(() => {
          // Step 4: Server Reception
          setSimulationStep(4);

          setTimeout(async () => {
            // Step 5: Verification & Decision
            setSimulationStep(5);
            const verifyRes = await verifyPayment() || result;
            
            const vResult = verifyRes.verification_result || result.verification_result;
            const status = verifyRes.final_status || result.final_status;
            
            setVerificationResult(vResult);
            setFinalStatus(status);
            setSimulationStep(6);
            setIsProcessing(false);

            // Fetch updated history
            const histData = await getSimulationHistory();
            if (histData?.history?.length > 0) {
              setHistory(histData.history);
            } else if (result) {
              // Standalone fallback history append
              const newHistItem = {
                transaction_id: result.txn_id,
                timestamp: Date.now() / 1000,
                sender: result.original_payload.sender_name,
                original_receiver: result.original_payload.receiver_name,
                received_receiver: result.received_payload.receiver_name,
                original_amount: result.original_payload.amount,
                received_amount: result.received_payload.amount,
                purpose: result.original_payload.purpose,
                is_mitm_active: isMitmEnabled,
                tamper_type: activeTamper.tamper_type,
                security_decision: vResult.security_decision,
                final_status: status,
                risk_summary: vResult.threat_description
              };
              setHistory(prev => [newHistItem, ...prev]);
            }

            // Sync events
            if (verifyRes.events) {
              setEvents(verifyRes.events);
            } else {
              generateClientEvents(result.original_payload, result.received_payload, vResult, isMitmEnabled, status);
            }

            // Trigger success confetti or open alert modal
            if (status === 'APPROVED') {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
            
            // Pop alert dialog after short moment
            setTimeout(() => {
              setIsAlertOpen(true);
            }, 600);

          }, 900);
        }, 900);
      }, 900);
    }, 700);
  };

  const generateClientEvents = (orig, recv, vRes, mitm, status) => {
    const evts = [
      {
        id: '1',
        timestamp: Date.now() / 1000,
        stage: 'PAYMENT_CREATED',
        icon: '📱',
        title: 'Payment Request Created',
        simple_explanation: `You created a payment for ₹${orig.amount} to ${orig.receiver_name}.`,
        technical_detail: `Constructed UPI payment request body. TxnID: ${orig.txn_id}.`,
        status: 'info'
      },
      {
        id: '2',
        timestamp: Date.now() / 1000,
        stage: 'CRYPTO_DIGEST',
        icon: '🔐',
        title: 'Cryptographic Fingerprint Sealed',
        simple_explanation: 'Sealed payment details with a SHA-256 cryptographic hash digest.',
        technical_detail: `SHA-256 Digest calculated: ${orig.sha256_hash.substring(0, 16)}...`,
        status: 'secure'
      },
      {
        id: '3',
        timestamp: Date.now() / 1000,
        stage: 'COMMUNICATION_STARTED',
        icon: '🌐',
        title: 'Dispatched Across Network',
        simple_explanation: 'The encrypted payment packet is travelling through the communication channel.',
        technical_detail: 'Serialized as JSON payload and transmitted via TCP/IP.',
        status: 'info'
      }
    ];

    if (mitm) {
      evts.push({
        id: '4',
        timestamp: Date.now() / 1000,
        stage: 'MITM_INTERCEPTED',
        icon: '🔴',
        title: 'Communication Intercepted by Attacker',
        simple_explanation: 'A simulated intermediary intercepted the packet in transit and modified values.',
        technical_detail: `Modified receiver to ${recv.receiver_name} and amount to ₹${recv.amount}.`,
        status: 'threat'
      });
      evts.push({
        id: '5',
        timestamp: Date.now() / 1000,
        stage: 'INTEGRITY_CHECK',
        icon: '⚠',
        title: 'Integrity Verification Failed!',
        simple_explanation: 'Mismatch detected! Received data does not match the sealed cryptographic hash.',
        technical_detail: `Original Hash: ${vRes.original_hash.substring(0, 12)}... ≠ Received Hash: ${vRes.received_hash.substring(0, 12)}...`,
        status: 'threat'
      });
      evts.push({
        id: '6',
        timestamp: Date.now() / 1000,
        stage: 'PAYMENT_BLOCKED',
        icon: '🛑',
        title: 'Simulated Payment Blocked',
        simple_explanation: 'Payment stopped to protect user funds from tampering.',
        technical_detail: 'Decision: HIGH RISK. Aborted before execution.',
        status: 'threat'
      });
    } else {
      evts.push({
        id: '4',
        timestamp: Date.now() / 1000,
        stage: 'SECURE_TRANSMISSION',
        icon: '🛡️',
        title: 'Secure Channel Traversed',
        simple_explanation: 'Packet arrived safely at the bank server without interception.',
        technical_detail: 'Integrity maintained directly end-to-end.',
        status: 'secure'
      });
      evts.push({
        id: '5',
        timestamp: Date.now() / 1000,
        stage: 'INTEGRITY_CHECK',
        icon: '✓',
        title: 'Integrity Verification Passed',
        simple_explanation: 'Cryptographic hash matched! Zero data modifications occurred.',
        technical_detail: `Original Hash == Received Hash (${vRes.original_hash.substring(0, 12)}...).`,
        status: 'secure'
      });
      evts.push({
        id: '6',
        timestamp: Date.now() / 1000,
        stage: 'PAYMENT_APPROVED',
        icon: '🟢',
        title: 'Payment Approved & Verified',
        simple_explanation: `₹${orig.amount} safely credited to ${orig.receiver_name}.`,
        technical_detail: 'Risk Score: 0.0 (CLEAN). Settled successfully.',
        status: 'secure'
      });
    }

    setEvents(evts);
  };

  const handleReset = async () => {
    await resetSimulation();
    setSimulationStep(0);
    setIsProcessing(false);
    setIsMitmEnabled(false);
    setOriginalPayload(null);
    setReceivedPayload(null);
    setVerificationResult(null);
    setFinalStatus(null);
    setEvents([]);
    setIsAlertOpen(false);
  };

  const handleRunPresentationStep = (stepObj) => {
    if (stepObj.actionType === 'RESET_CLEAN') {
      handleReset();
    } else if (stepObj.actionType === 'SEND_NORMAL') {
      setIsMitmEnabled(false);
      handlePaymentSubmit(
        { receiver_name: 'Rahul', amount: 500, purpose: 'Food & Dining' },
        { is_mitm_enabled: false, tamper_type: 'NONE' }
      );
    } else if (stepObj.actionType === 'ENABLE_MITM') {
      setIsMitmEnabled(true);
      setSimulationStep(0);
      setIsAlertOpen(false);
    } else if (stepObj.actionType === 'SEND_TAMPERED') {
      setIsMitmEnabled(true);
      handlePaymentSubmit(
        { receiver_name: 'Rahul', amount: 500, purpose: 'Food & Dining' },
        {
          is_mitm_enabled: true,
          tamper_type: 'RECEIVER_MODIFIED',
          modified_receiver_name: 'Unknown Attacker (Mallory)',
          modified_amount: 5000
        }
      );
    } else if (stepObj.actionType === 'TRIGGER_ALERT') {
      setIsAlertOpen(true);
    } else if (stepObj.actionType === 'SHOW_FORENSICS') {
      setIsAlertOpen(false);
      setActiveTab('forensics');
    } else if (stepObj.actionType === 'SUMMARY') {
      setActiveTab('learn');
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col cyber-bg-overlay transition-colors duration-500 ${
      isMitmEnabled ? 'ring-1 ring-rose-500/20' : ''
    }`}>
      {/* Subtle Scanline Layer */}
      <div className="fixed inset-0 pointer-events-none cyber-grid-lines opacity-40 z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isGuidedMode={isGuidedMode}
        setIsGuidedMode={setIsGuidedMode}
        onStartPresentation={() => setIsPresentationOpen(true)}
        onResetSimulation={handleReset}
        isMitmActive={isMitmEnabled}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Guided Mode Callout Banner */}
        {isGuidedMode && activeTab === 'simulator' && (
          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                💡
              </span>
              <div>
                <span className="font-bold text-cyan-300">Guided Step {simulationStep === 0 ? '1 of 3' : simulationStep < 5 ? '2 of 3' : '3 of 3'}: </span>
                <span className="text-cyan-100/90">
                  {simulationStep === 0 && 'Select a contact or enter a simulated payment below. Toggle "MITM Simulation" to test attack detection!'}
                  {simulationStep > 0 && simulationStep < 6 && 'Watch the payment request travel across the network. Notice the cryptographic hash calculated on your device.'}
                  {simulationStep >= 6 && finalStatus === 'APPROVED' && 'Payment verified! The bank server checked the cryptographic hash and confirmed zero tampering.'}
                  {simulationStep >= 6 && finalStatus === 'BLOCKED' && 'Payment blocked! The security engine detected that the intercepted payload did not match the original hash.'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsGuidedMode(false)}
              className="text-slate-400 hover:text-white shrink-0 text-[11px] underline cursor-pointer"
            >
              Hide Guide
            </button>
          </div>
        )}

        {/* Tab 1: Primary Payment Simulator View */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <Dashboard
              isMitmActive={isMitmEnabled}
              onStartSimulation={(mitm) => {
                setIsMitmEnabled(mitm);
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              onStartMitmSimulation={() => {
                setIsMitmEnabled(true);
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              onLearnMore={() => setActiveTab('learn')}
              recentSimulation={history[0]}
              onViewForensics={() => setActiveTab('forensics')}
            />

            {/* Payment Input Simulator Card */}
            <PaymentSimulator
              onSubmitPayment={handlePaymentSubmit}
              isProcessing={isProcessing}
              isMitmEnabled={isMitmEnabled}
              setIsMitmEnabled={setIsMitmEnabled}
              tamperConfig={tamperConfig}
              setTamperConfig={setTamperConfig}
            />

            {/* Interactive Visual Payment Journey */}
            <PaymentJourney
              simulationStep={simulationStep}
              isMitmActive={isMitmEnabled}
              originalPayload={originalPayload}
              receivedPayload={receivedPayload}
              isBlocked={finalStatus === 'BLOCKED'}
              isApproved={finalStatus === 'APPROVED'}
              onOpenTechnicalDetails={() => setIsTechDetailsOpen(true)}
            />

            {/* Real-Time "What's happening in the background?" Feed */}
            <BackgroundActivity
              events={events}
              onOpenTechnicalDetails={() => setIsTechDetailsOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Interactive Risk Engine Lab (0-100 Meter & Scenario Configurator) */}
        {activeTab === 'risk-lab' && (
          <RiskEngineLab />
        )}

        {/* Tab 3: Interactive Cryptography Learning Lab (Diffie-Hellman, AES-GCM, SHA-256) */}
        {activeTab === 'crypto-lab' && (
          <CryptoLearningLab />
        )}

        {/* Tab 4: Forensic Timeline ("See What Happened") */}
        {activeTab === 'forensics' && (
          <ForensicTimeline
            originalPayload={originalPayload || history[0]?.original_payload}
            receivedPayload={receivedPayload || history[0]?.received_payload}
            verificationResult={verificationResult}
            onOpenTechnicalDetails={() => setIsTechDetailsOpen(true)}
            onBackToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {/* Tab 5: Learn MITM Interactive Center */}
        {activeTab === 'learn' && <LearnMitm />}

        {/* Tab 6: Simulation Session History */}
        {activeTab === 'history' && (
          <SimulationHistory
            history={history}
            onSelectHistoryItem={(item) => {
              setOriginalPayload({
                txn_id: item.transaction_id,
                sender_name: item.sender,
                receiver_name: item.original_receiver,
                amount: item.original_amount,
                purpose: item.purpose
              });
              setReceivedPayload({
                receiver_name: item.received_receiver,
                amount: item.received_amount
              });
              setFinalStatus(item.final_status);
              setIsTechDetailsOpen(true);
            }}
            onClearHistory={() => setHistory([])}
          />
        )}
      </main>

      {/* Security Alert Modal */}
      <SecurityAlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        finalStatus={finalStatus}
        originalPayload={originalPayload}
        receivedPayload={receivedPayload}
        verificationResult={verificationResult}
        onSeeWhatHappened={() => setActiveTab('forensics')}
        onOpenTechnicalDetails={() => setIsTechDetailsOpen(true)}
        onReset={handleReset}
      />

      {/* Technical Details Inspector Modal */}
      <TechnicalDetailsModal
        isOpen={isTechDetailsOpen}
        onClose={() => setIsTechDetailsOpen(false)}
        originalPayload={originalPayload}
        receivedPayload={receivedPayload}
        verificationResult={verificationResult}
        finalStatus={finalStatus}
      />

      {/* Presentation Mode Automated Controller */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onRunStep={handleRunPresentationStep}
        onReset={handleReset}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            UPI Payment Communication Visualizer • Educational Cybersecurity Simulation Platform
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>TLS 1.3 + Diffie-Hellman + AES-GCM + SHA-256</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('learn')}
              className="hover:text-emerald-400 underline cursor-pointer"
            >
              Security Documentation & Quiz
            </button>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
