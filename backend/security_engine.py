import hashlib
import hmac
import json
import uuid
import time
from typing import Dict, Any, Tuple, List
from .models import PaymentRequest, TamperConfig, TamperType, SecurityVerificationResult, SecurityDecision

# Educational Simulated Secret Key for HMAC calculation
EDUCATIONAL_SECRET_KEY = b"UPI_SIMULATED_FINTECH_AUTH_KEY_2026"

class SecurityEngine:
    """
    Educational Security Verification Engine.
    Implements SHA-256 message hashing, HMAC calculation, replay detection,
    and structured risk decision evaluation for UPI payment simulations.
    """

    @staticmethod
    def generate_transaction_id() -> str:
        timestamp_part = int(time.time() * 1000)
        random_part = uuid.uuid4().hex[:8].upper()
        return f"UPI{timestamp_part}{random_part}"

    @staticmethod
    def generate_nonce() -> str:
        return uuid.uuid4().hex[:12]

    @classmethod
    def serialize_payload(cls, payload: Dict[str, Any]) -> str:
        """Standardized JSON serialization for deterministic hashing"""
        # Exclude internal non-deterministic fields when hashing payload body
        filtered = {k: v for k, v in payload.items() if k not in ["signature", "received_at"]}
        return json.dumps(filtered, sort_keys=True, separators=(',', ':'))

    @classmethod
    def compute_sha256(cls, data_str: str) -> str:
        """Compute standard SHA-256 hex digest"""
        return hashlib.sha256(data_str.encode('utf-8')).hexdigest()

    @classmethod
    def compute_hmac(cls, data_str: str, key: bytes = EDUCATIONAL_SECRET_KEY) -> str:
        """Compute HMAC-SHA256 digital authentication tag"""
        return hmac.new(key, data_str.encode('utf-8'), hashlib.sha256).hexdigest()

    @classmethod
    def calculate_hash_diff(cls, hash1: str, hash2: str) -> List[int]:
        """Find index positions where hash1 differs from hash2 for visual highlighting"""
        diff_indices = []
        max_len = max(len(hash1), len(hash2))
        for i in range(max_len):
            char1 = hash1[i] if i < len(hash1) else ''
            char2 = hash2[i] if i < len(hash2) else ''
            if char1 != char2:
                diff_indices.append(i)
        return diff_indices

    @classmethod
    def build_original_payload(cls, req: PaymentRequest, txn_id: str, nonce: str, timestamp: float) -> Dict[str, Any]:
        payload = {
            "txn_id": txn_id,
            "sender_name": req.sender_name,
            "sender_vpa": req.sender_vpa,
            "receiver_name": req.receiver_name,
            "receiver_vpa": req.receiver_vpa or f"{req.receiver_name.lower().replace(' ', '')}@oksbi",
            "amount": req.amount,
            "currency": "INR",
            "purpose": req.purpose or "General Transfer",
            "timestamp": timestamp,
            "nonce": nonce,
            "client_app": "FinSecure UPI v2.4 (Simulated)"
        }
        serialized = cls.serialize_payload(payload)
        payload["sha256_hash"] = cls.compute_sha256(serialized)
        payload["hmac_signature"] = cls.compute_hmac(serialized)
        return payload

    @classmethod
    def apply_mitm_tamper(cls, original_payload: Dict[str, Any], tamper: TamperConfig) -> Tuple[Dict[str, Any], str]:
        """
        Simulate an attacker intercepting the communication packet in transit
        and maliciously altering fields at the application layer.
        """
        tampered = json.loads(json.dumps(original_payload))
        description = "No tampering occurred."

        if not tamper.is_mitm_enabled:
            return tampered, description

        if tamper.tamper_type == TamperType.RECEIVER_MODIFIED:
            tampered["receiver_name"] = tamper.modified_receiver_name or "Attacker (Mallory)"
            tampered["receiver_vpa"] = tamper.modified_receiver_vpa or "attacker@darknet"
            description = f"Attacker diverted beneficiary from '{original_payload['receiver_name']}' to '{tampered['receiver_name']}' ({tampered['receiver_vpa']})."

        elif tamper.tamper_type == TamperType.AMOUNT_MODIFIED:
            tampered["amount"] = tamper.modified_amount or (original_payload["amount"] * 10)
            description = f"Attacker inflated transaction amount from ₹{original_payload['amount']} to ₹{tampered['amount']}."

        elif tamper.tamper_type == TamperType.PURPOSE_MODIFIED:
            tampered["purpose"] = tamper.modified_purpose or "Ransomware / Extortion Payment"
            description = f"Attacker modified transaction memo purpose to '{tampered['purpose']}'."

        elif tamper.tamper_type == TamperType.REPLAY_ATTACK:
            # Replaying with modified timestamp or attempting duplicate submission
            tampered["timestamp"] = original_payload["timestamp"] - 7200  # 2 hours stale
            description = "Attacker replayed an old payment packet with an expired timestamp."

        elif tamper.tamper_type == TamperType.FULL_PAYLOAD_TAMPER:
            tampered["receiver_name"] = tamper.modified_receiver_name or "Shadow Syndicate"
            tampered["receiver_vpa"] = "shadow@exploit"
            tampered["amount"] = tamper.modified_amount or (original_payload["amount"] * 5)
            description = f"Attacker altered both beneficiary ('{tampered['receiver_name']}') and amount (₹{tampered['amount']})."

        return tampered, description

    @classmethod
    def verify_integrity_and_risk(
        cls,
        original_payload: Dict[str, Any],
        received_payload: Dict[str, Any]
    ) -> SecurityVerificationResult:
        """
        Simulated Bank / Payment Server verification.
        Recomputes the cryptographic hash and HMAC over the received data
        and verifies consistency with the original sender's digital digest.
        """
        original_hash = original_payload.get("sha256_hash", "")
        
        # Re-compute digest over received payload contents
        received_serialized = cls.serialize_payload(received_payload)
        computed_received_hash = cls.compute_sha256(received_serialized)
        
        # Also check HMAC authentication
        computed_received_hmac = cls.compute_hmac(received_serialized)
        original_hmac = original_payload.get("hmac_signature", "")

        # Check nonce/timestamp freshness (simulated)
        time_diff = abs(received_payload.get("timestamp", 0) - original_payload.get("timestamp", 0))
        is_nonce_valid = time_diff < 300  # 5 minutes window

        # Integrity matches if the recomputed SHA256 of received content matches the original hash
        is_integrity_intact = (original_hash == computed_received_hash)
        is_signature_valid = (original_hmac == computed_received_hmac)

        diff_indices = cls.calculate_hash_diff(original_hash, computed_received_hash)

        # Risk Decision Matrix
        if is_integrity_intact and is_signature_valid and is_nonce_valid:
            decision = SecurityDecision.SECURE
            threat_desc = "Communication verified intact. Original cryptographic digest matches received message payload."
        elif not is_integrity_intact:
            decision = SecurityDecision.HIGH_RISK
            mismatched_fields = []
            for field in ["receiver_name", "receiver_vpa", "amount", "purpose"]:
                if original_payload.get(field) != received_payload.get(field):
                    mismatched_fields.append(f"{field} (Original: '{original_payload.get(field)}' vs Received: '{received_payload.get(field)}')")
            
            threat_desc = f"Integrity Failure: The message payload was modified in transit. Detected mismatched fields: {', '.join(mismatched_fields)}."
        elif not is_nonce_valid:
            decision = SecurityDecision.WARNING
            threat_desc = "Replay Alert: Message timestamp is stale or duplicate nonce detected."
        else:
            decision = SecurityDecision.WARNING
            threat_desc = "Signature Mismatch: Message authentication code failed verification."

        return SecurityVerificationResult(
            original_hash=original_hash,
            received_hash=computed_received_hash,
            is_integrity_intact=is_integrity_intact,
            is_signature_valid=is_signature_valid,
            is_nonce_valid=is_nonce_valid,
            security_decision=decision,
            threat_description=threat_desc,
            hash_diff_indices=diff_indices
        )
