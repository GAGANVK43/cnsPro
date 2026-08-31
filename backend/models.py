from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
import time

class SimulationState(str, Enum):
    IDLE = "IDLE"
    PAYMENT_CREATED = "PAYMENT_CREATED"
    COMMUNICATION_STARTED = "COMMUNICATION_STARTED"
    SECURE_TRANSMISSION = "SECURE_TRANSMISSION"
    MITM_INTERCEPTED = "MITM_INTERCEPTED"
    MESSAGE_CHECK = "MESSAGE_CHECK"
    INTEGRITY_VERIFICATION = "INTEGRITY_VERIFICATION"
    SECURITY_DECISION = "SECURITY_DECISION"
    ALERT_GENERATED = "ALERT_GENERATED"
    PAYMENT_APPROVED = "PAYMENT_APPROVED"
    PAYMENT_BLOCKED = "PAYMENT_BLOCKED"

class SecurityDecision(str, Enum):
    SECURE = "SECURE"
    WARNING = "WARNING"
    HIGH_RISK = "HIGH_RISK"

class TamperType(str, Enum):
    NONE = "NONE"
    RECEIVER_MODIFIED = "RECEIVER_MODIFIED"
    AMOUNT_MODIFIED = "AMOUNT_MODIFIED"
    PURPOSE_MODIFIED = "PURPOSE_MODIFIED"
    REPLAY_ATTACK = "REPLAY_ATTACK"
    FULL_PAYLOAD_TAMPER = "FULL_PAYLOAD_TAMPER"

class PaymentRequest(BaseModel):
    receiver_name: str = Field(..., example="Rahul Sharma")
    receiver_vpa: Optional[str] = Field(default="rahul@oksbi", example="rahul@oksbi")
    amount: float = Field(..., gt=0, example=500.0)
    purpose: Optional[str] = Field(default="Food & Dining", example="Food & Dining")
    sender_name: str = Field(default="You (Demo User)", example="You (Demo User)")
    sender_vpa: str = Field(default="user@okhdfcbank", example="user@okhdfcbank")

class TamperConfig(BaseModel):
    is_mitm_enabled: bool = False
    tamper_type: TamperType = TamperType.RECEIVER_MODIFIED
    modified_receiver_name: Optional[str] = "Unknown Attacker (Mallory)"
    modified_receiver_vpa: Optional[str] = "attacker@badbank"
    modified_amount: Optional[float] = 5000.0
    modified_purpose: Optional[str] = "Unauthorized Transfer"

class SecurityVerificationResult(BaseModel):
    original_hash: str
    received_hash: str
    is_integrity_intact: bool
    is_signature_valid: bool
    is_nonce_valid: bool
    security_decision: SecurityDecision
    threat_description: Optional[str] = None
    hash_diff_indices: List[int] = []

class BackgroundEvent(BaseModel):
    id: str
    timestamp: float = Field(default_factory=time.time)
    stage: str
    icon: str
    title: str
    simple_explanation: str
    technical_detail: str
    status: str  # 'info', 'secure', 'warning', 'threat'
    data_snapshot: Optional[Dict[str, Any]] = None

class SimulationHistoryItem(BaseModel):
    transaction_id: str
    timestamp: float
    sender: str
    original_receiver: str
    received_receiver: str
    original_amount: float
    received_amount: float
    purpose: str
    is_mitm_active: bool
    tamper_type: str
    security_decision: str
    final_status: str  # 'APPROVED' | 'BLOCKED'
    risk_summary: str
