// API Client for the Educational UPI Payment Simulator
// Connects to FastAPI backend with graceful fallback to self-contained client-side crypto simulation

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend offline, running in standalone browser simulation mode:', err.message);
  }
  return null;
}

export async function startSimulation() {
  try {
    const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend call failed:', err);
  }
  return { message: 'Local simulation initialized', state: 'IDLE' };
}

export async function submitPayment(paymentData, tamperConfig) {
  try {
    const res = await fetch(`${API_BASE}/simulation/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        req: paymentData,
        tamper_config: tamperConfig
      })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error, executing client-side simulation:', err);
  }

  // Standalone client-side fallback if backend is offline
  return fallbackClientPayment(paymentData, tamperConfig);
}

export async function verifyPayment() {
  try {
    const res = await fetch(`${API_BASE}/simulation/verify`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API verify error:', err);
  }
  return null;
}

export async function getSimulationHistory() {
  try {
    const res = await fetch(`${API_BASE}/simulation/history`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API history fetch failed:', err);
  }
  return { history: [] };
}

export async function resetSimulation() {
  try {
    const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API reset failed:', err);
  }
  return { message: 'Reset successful', state: 'IDLE' };
}

// Client-side SHA-256 fallback implementation
async function sha256Client(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function fallbackClientPayment(paymentData, tamperConfig) {
  const txnId = `UPI${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 14);

  const originalPayload = {
    txn_id: txnId,
    sender_name: paymentData.sender_name || 'You (Demo User)',
    sender_vpa: paymentData.sender_vpa || 'user@okhdfcbank',
    receiver_name: paymentData.receiver_name,
    receiver_vpa: paymentData.receiver_vpa || `${paymentData.receiver_name.toLowerCase().replace(/\s+/g, '')}@oksbi`,
    amount: parseFloat(paymentData.amount),
    currency: 'INR',
    purpose: paymentData.purpose || 'General Transfer',
    timestamp: timestamp,
    nonce: nonce,
    client_app: 'FinSecure UPI v2.4 (Simulated)'
  };

  const serialized = JSON.stringify(originalPayload);
  const originalHash = await sha256Client(serialized);
  originalPayload.sha256_hash = originalHash;
  originalPayload.hmac_signature = await sha256Client(serialized + "_SECRET_KEY");

  let tamperedPayload = JSON.parse(JSON.stringify(originalPayload));
  let tamperDesc = 'No tampering occurred.';

  if (tamperConfig?.is_mitm_enabled) {
    if (tamperConfig.tamper_type === 'RECEIVER_MODIFIED') {
      tamperedPayload.receiver_name = tamperConfig.modified_receiver_name || 'Unknown Attacker (Mallory)';
      tamperedPayload.receiver_vpa = tamperConfig.modified_receiver_vpa || 'attacker@badbank';
      tamperDesc = `Attacker diverted beneficiary from '${originalPayload.receiver_name}' to '${tamperedPayload.receiver_name}'.`;
    } else if (tamperConfig.tamper_type === 'AMOUNT_MODIFIED') {
      tamperedPayload.amount = parseFloat(tamperConfig.modified_amount) || (originalPayload.amount * 10);
      tamperDesc = `Attacker inflated transaction amount from ₹${originalPayload.amount} to ₹${tamperedPayload.amount}.`;
    } else if (tamperConfig.tamper_type === 'PURPOSE_MODIFIED') {
      tamperedPayload.purpose = tamperConfig.modified_purpose || 'Unauthorized Transfer';
      tamperDesc = `Attacker modified transaction purpose to '${tamperedPayload.purpose}'.`;
    } else if (tamperConfig.tamper_type === 'FULL_PAYLOAD_TAMPER') {
      tamperedPayload.receiver_name = tamperConfig.modified_receiver_name || 'Shadow Syndicate';
      tamperedPayload.amount = parseFloat(tamperConfig.modified_amount) || (originalPayload.amount * 5);
      tamperDesc = `Attacker altered both beneficiary and amount.`;
    }
  }

  // Calculate received payload hash
  const receivedFiltered = { ...tamperedPayload };
  delete receivedFiltered.sha256_hash;
  delete receivedFiltered.hmac_signature;
  const receivedSerialized = JSON.stringify(receivedFiltered);
  const receivedHash = await sha256Client(receivedSerialized);

  const isIntegrityIntact = (originalHash === receivedHash);

  // Hash diff indices
  const diffIndices = [];
  const maxLen = Math.max(originalHash.length, receivedHash.length);
  for (let i = 0; i < maxLen; i++) {
    if (originalHash[i] !== receivedHash[i]) {
      diffIndices.push(i);
    }
  }

  const verificationResult = {
    original_hash: originalHash,
    received_hash: receivedHash,
    is_integrity_intact: isIntegrityIntact,
    is_signature_valid: isIntegrityIntact,
    is_nonce_valid: true,
    security_decision: isIntegrityIntact ? 'SECURE' : 'HIGH_RISK',
    threat_description: isIntegrityIntact
      ? 'Communication verified intact. Original cryptographic digest matches received message payload.'
      : `Integrity Failure: The message payload was modified in transit. (${tamperDesc})`,
    hash_diff_indices: diffIndices
  };

  return {
    txn_id: txnId,
    state: isIntegrityIntact ? 'PAYMENT_APPROVED' : 'PAYMENT_BLOCKED',
    original_payload: originalPayload,
    received_payload: tamperedPayload,
    is_mitm_active: tamperConfig?.is_mitm_enabled || false,
    verification_result: verificationResult,
    final_status: isIntegrityIntact ? 'APPROVED' : 'BLOCKED',
    tamper_description: tamperDesc
  };
}
