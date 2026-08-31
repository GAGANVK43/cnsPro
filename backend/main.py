from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
import time
import uuid

from .models import (
    SimulationState,
    SecurityDecision,
    PaymentRequest,
    TamperConfig,
    TamperType,
    SecurityVerificationResult,
    BackgroundEvent,
    SimulationHistoryItem
)
from .security_engine import SecurityEngine

app = FastAPI(
    title="UPI Payment Communication Visualizer API",
    description="Educational simulation API for UPI payment communication flow and MITM threat detection.",
    version="1.0.0"
)

# CORS middleware for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory simulation state
class SimulationStore:
    def __init__(self):
        self.reset()
        self.history: List[SimulationHistoryItem] = [
            # Seed demo historical transaction for immediate rich UI experience
            SimulationHistoryItem(
                transaction_id="UPI1725109200000A1B2",
                timestamp=time.time() - 3600,
                sender="You (Demo User)",
                original_receiver="Priya Stores",
                received_receiver="Priya Stores",
                original_amount=250.0,
                received_amount=250.0,
                purpose="Stationery & Books",
                is_mitm_active=False,
                tamper_type="NONE",
                security_decision="SECURE",
                final_status="APPROVED",
                risk_summary="Standard secure transaction. All cryptographic checks passed."
            )
        ]

    def reset(self):
        self.state: SimulationState = SimulationState.IDLE
        self.txn_id: Optional[str] = None
        self.original_payload: Optional[Dict[str, Any]] = None
        self.tampered_payload: Optional[Dict[str, Any]] = None
        self.tamper_config: TamperConfig = TamperConfig()
        self.verification_result: Optional[SecurityVerificationResult] = None
        self.events: List[BackgroundEvent] = []
        self.tamper_description: str = ""

    def add_event(self, stage: str, icon: str, title: str, simple_exp: str, tech_detail: str, status: str, snapshot: Optional[Dict[str, Any]] = None):
        event = BackgroundEvent(
            id=str(uuid.uuid4())[:8],
            timestamp=time.time(),
            stage=stage,
            icon=icon,
            title=title,
            simple_explanation=simple_exp,
            technical_detail=tech_detail,
            status=status,
            data_snapshot=snapshot
        )
        self.events.append(event)
        return event

store = SimulationStore()

@app.get("/")
def read_root():
    return {
        "service": "UPI Payment Communication Visualizer API",
        "status": "online",
        "mode": "Educational Simulation",
        "disclaimer": "No real money or banking credentials are used."
    }

@app.post("/simulation/start")
def start_simulation():
    """Initializes/resets simulation to ready state."""
    store.reset()
    store.state = SimulationState.IDLE
    store.add_event(
        stage="INIT",
        icon="⚡",
        title="Simulation Environment Initialized",
        simple_exp="The sandbox communication channel is ready for payment initiation.",
        tech_detail="TLS 1.3 channel context initialized with elliptic curve cipher suite (Simulated).",
        status="info"
    )
    return {"message": "Simulation initialized", "state": store.state}

@app.post("/simulation/payment")
def create_payment(req: PaymentRequest, tamper_config: Optional[TamperConfig] = None):
    """
    Step 1: User creates payment. Original payload and cryptographic digest are generated.
    """
    store.reset()
    if tamper_config:
        store.tamper_config = tamper_config

    txn_id = SecurityEngine.generate_transaction_id()
    nonce = SecurityEngine.generate_nonce()
    timestamp = time.time()

    store.txn_id = txn_id
    store.original_payload = SecurityEngine.build_original_payload(req, txn_id, nonce, timestamp)
    store.state = SimulationState.PAYMENT_CREATED

    store.add_event(
        stage="PAYMENT_CREATED",
        icon="📱",
        title="Payment Request Created",
        simple_exp=f"You requested to send ₹{req.amount} to {req.receiver_name}.",
        tech_detail=f"Constructed UPI payment request body. TxnID: {txn_id}, Nonce: {nonce}.",
        status="info",
        snapshot={"amount": req.amount, "receiver": req.receiver_name}
    )

    # Step 2: Digital Digest & Integrity Tag Generation
    digest = store.original_payload["sha256_hash"]
    store.add_event(
        stage="CRYPTO_DIGEST",
        icon="🔐",
        title="Cryptographic Fingerprint Generated",
        simple_exp="Your device sealed the payment details with a unique mathematical fingerprint (SHA-256 hash).",
        tech_detail=f"SHA-256 Digest calculated: {digest[:16]}...{digest[-8:]}. HMAC authentication tag appended.",
        status="secure",
        snapshot={"sha256": digest}
    )

    # Step 3: Transmission through Network Channel
    store.state = SimulationState.COMMUNICATION_STARTED
    store.add_event(
        stage="COMMUNICATION_STARTED",
        icon="🌐",
        title="Request Dispatched to Network",
        simple_exp="The encrypted payment packet is now travelling through the communication channel.",
        tech_detail="Data serialized as standardized payload and transmitted via simulated TCP/IP socket.",
        status="info"
    )

    # Step 4: Check if MITM Intercepts
    if store.tamper_config.is_mitm_enabled:
        store.state = SimulationState.MITM_INTERCEPTED
        tampered_data, desc = SecurityEngine.apply_mitm_tamper(store.original_payload, store.tamper_config)
        store.tampered_payload = tampered_data
        store.tamper_description = desc

        store.add_event(
            stage="MITM_INTERCEPTED",
            icon="🔴",
            title="Communication Intercepted by Intermediary",
            simple_exp="A simulated rogue actor intercepted the payment packet before it reached the bank.",
            tech_detail=f"Interception event: {desc}",
            status="threat",
            snapshot={"tamper_type": store.tamper_config.tamper_type, "modified_payload": tampered_data}
        )
    else:
        store.state = SimulationState.SECURE_TRANSMISSION
        store.tampered_payload = json.loads(json.dumps(store.original_payload))
        store.tamper_description = "Direct secure transit."
        store.add_event(
            stage="SECURE_TRANSMISSION",
            icon="🛡️",
            title="Secure Channel Traversed",
            simple_exp="The payment travelled directly to the bank without unauthorized interception.",
            tech_detail="Channel integrity maintained without packet drop or proxy redirection.",
            status="secure"
        )

    return {
        "txn_id": store.txn_id,
        "state": store.state,
        "original_payload": store.original_payload,
        "is_mitm_active": store.tamper_config.is_mitm_enabled,
        "events": store.events
    }

@app.post("/simulation/verify")
def verify_payment():
    """
    Step 5 & 6: Bank/Payment Server runs cryptographic verification & risk decision.
    """
    if not store.original_payload or not store.tampered_payload:
        raise HTTPException(status_code=400, detail="No active payment simulation to verify.")

    store.state = SimulationState.INTEGRITY_VERIFICATION

    store.add_event(
        stage="SERVER_RECEPTION",
        icon="🏦",
        title="Payment Received by Server",
        simple_exp="The simulated banking server received the incoming payment request packet.",
        tech_detail=f"Received payload from client IP. Proceeding to cryptographic integrity validation.",
        status="info"
    )

    # Perform integrity check
    result = SecurityEngine.verify_integrity_and_risk(store.original_payload, store.tampered_payload)
    store.verification_result = result

    if result.is_integrity_intact:
        store.add_event(
            stage="INTEGRITY_CHECK",
            icon="✓",
            title="Integrity Verification Passed",
            simple_exp="The cryptographic fingerprint matches! The payment was NOT altered in transit.",
            tech_detail=f"Original Hash == Received Hash ({result.original_hash[:12]}...). HMAC valid.",
            status="secure"
        )
        store.state = SimulationState.PAYMENT_APPROVED
        store.add_event(
            stage="PAYMENT_APPROVED",
            icon="🟢",
            title="Payment Approved & Verified",
            simple_exp=f"₹{store.original_payload['amount']} was safely credited to {store.original_payload['receiver_name']}.",
            tech_detail="Risk Score: 0.0 (CLEAN). Transaction settled successfully.",
            status="secure"
        )
        final_status = "APPROVED"
    else:
        store.add_event(
            stage="INTEGRITY_CHECK",
            icon="⚠",
            title="Integrity Verification Failed!",
            simple_exp="Mismatch detected! The payment info received does not match what the sender created.",
            tech_detail=f"Hash Mismatch! Original: {result.original_hash[:16]}... vs Received: {result.received_hash[:16]}...",
            status="threat"
        )
        store.state = SimulationState.ALERT_GENERATED
        store.add_event(
            stage="SECURITY_ALERT",
            icon="🚨",
            title="Security Alert Raised",
            simple_exp="High risk communication anomaly detected. Simulated MITM tampering triggered instant block.",
            tech_detail=f"Security Engine decision: {result.security_decision}. Reason: {result.threat_description}",
            status="threat"
        )
        store.state = SimulationState.PAYMENT_BLOCKED
        store.add_event(
            stage="PAYMENT_BLOCKED",
            icon="🛑",
            title="Simulated Payment Blocked",
            simple_exp="The payment was stopped to protect user funds from unauthorized tampering.",
            tech_detail="Execution halted. Transaction marked ABORTED_RISK_DETECTED. No funds deducted.",
            status="threat"
        )
        final_status = "BLOCKED"

    # Save to history
    history_item = SimulationHistoryItem(
        transaction_id=store.txn_id or "UNKNOWN",
        timestamp=time.time(),
        sender=store.original_payload["sender_name"],
        original_receiver=store.original_payload["receiver_name"],
        received_receiver=store.tampered_payload["receiver_name"],
        original_amount=store.original_payload["amount"],
        received_amount=store.tampered_payload["amount"],
        purpose=store.original_payload["purpose"],
        is_mitm_active=store.tamper_config.is_mitm_enabled,
        tamper_type=store.tamper_config.tamper_type.value if store.tamper_config.is_mitm_enabled else "NONE",
        security_decision=result.security_decision.value,
        final_status=final_status,
        risk_summary=result.threat_description or "Clean transaction."
    )
    store.history.insert(0, history_item)

    return {
        "state": store.state,
        "verification_result": result,
        "original_payload": store.original_payload,
        "received_payload": store.tampered_payload,
        "final_status": final_status,
        "events": store.events
    }

@app.get("/simulation/status")
def get_status():
    return {
        "state": store.state,
        "txn_id": store.txn_id,
        "original_payload": store.original_payload,
        "received_payload": store.tampered_payload,
        "tamper_config": store.tamper_config,
        "tamper_description": store.tamper_description,
        "verification_result": store.verification_result,
        "events_count": len(store.events)
    }

@app.get("/simulation/events")
def get_events():
    return {"events": store.events}

@app.get("/simulation/history")
def get_history():
    return {"history": store.history}

@app.post("/simulation/reset")
def reset_simulation():
    store.reset()
    return {"message": "Simulation state reset successfully", "state": store.state}
