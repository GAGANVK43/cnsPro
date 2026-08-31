# UPI Payment Communication Visualizer
### *Interactive MITM Risk Awareness & Security Simulation Platform*

An educational, presentation-ready fintech security simulator for college Computer Science and Cybersecurity projects.

> **Educational Simulation Notice**: This project is built solely for education and conceptual demonstration. It does **not** connect to real UPI infrastructure, banks, or real-money payment networks, and does **not** collect real UPI PINs, bank passwords, or financial credentials.

---

## 🌟 Key Features

1. **Fintech UI/UX**: Clean, accessible, modern interface inspired by top fintech platforms (not an intimidating SOC dashboard).
2. **Interactive Payment Journey Visualizer**: Animated multi-node communication path:
   `📱 YOU` ➔ `💳 PAYMENT REQUEST` ➔ `🌐 COMMUNICATION` ➔ (`🔴 SIMULATED INTERMEDIARY`) ➔ `🏦 PAYMENT SERVER` ➔ `🛡️ SECURITY CHECK` ➔ `✓ / 🛑 VERDICT`.
3. **"What's happening in the background?" Live Feed**: Real-time event log with simple one-line explanations, status badges, and expandable technical details.
4. **Dual Simulation Modes**:
   - **🟢 Normal Secure Payment**: Cryptographic SHA-256 hash digest is generated and verified intact at the bank server.
   - **🔴 MITM Attack Simulation**: Visual intermediary drops in and tampers with beneficiary/amount. Bank detects hash mismatch and halts payment.
5. **Attacker Sandbox**: Customize what the simulated intermediary modifies (Divert Beneficiary, Inflate Amount, Tamper Memo, Full Tamper) to observe exact cryptographic reactions.
6. **Plain-Language Alert System**: Clear alerts explaining what occurred in human terms rather than raw code.
7. **"See What Happened" Forensic Timeline**: Visual step-by-step autopsy of the attack lifecycle from creation to interception, mismatch detection, and instant block.
8. **Expandable Technical Details**: Side-by-side JSON payload inspection and 64-character SHA-256 hash comparison with visual diff highlighting (demonstrating the Avalanche Effect).
9. **"Learn MITM" Academy**: 7 visual interactive chapters with diagrams, comparison toggles, real-world UPI defenses (TLS pinning, SIM binding, nonces), and an interactive knowledge check quiz.
10. **Presentation / Demo Mode**: Automated 2-3 minute guided walkthrough with speaker narrator captions, perfect for project presentations and viva evaluation.

---

## 🏗️ Architecture

```
├── backend/
│   ├── main.py             # FastAPI REST endpoints, state machine, history
│   ├── models.py           # Pydantic schemas (PaymentRequest, TamperConfig, Events)
│   └── security_engine.py  # Cryptographic SHA-256, HMAC, Risk Decision Engine
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header, mode toggles, safety banner
│   │   │   ├── Dashboard.jsx            # Status hero & quick triggers
│   │   │   ├── PaymentSimulator.jsx     # Safe input form & MITM sandbox
│   │   │   ├── PaymentJourney.jsx       # Animated communication path
│   │   │   ├── BackgroundActivity.jsx   # Real-time background feed
│   │   │   ├── SecurityAlertModal.jsx   # Plain-language alert dialog
│   │   │   ├── ForensicTimeline.jsx     # "See What Happened" visual timeline
│   │   │   ├── TechnicalDetailsModal.jsx# Hash diff & JSON payload inspector
│   │   │   ├── LearnMitm.jsx            # Visual academy & interactive quiz
│   │   │   ├── PresentationMode.jsx     # Auto-demo presentation controller
│   │   │   └── SimulationHistory.jsx    # Audit trail table
│   │   ├── services/
│   │   │   └── api.js                   # API client with browser-native fallback
│   │   ├── App.jsx                      # Main orchestrator
│   │   └── index.css                    # Tailwind CSS v4 styling & glow effects
│   └── package.json
├── run_backend.py          # Root backend launcher
├── start_servers.bat       # 1-click Windows startup batch script
└── README.md
```

---

## 🚀 Quick Start Guide

### Option 1: 1-Click Windows Launch
Double-click `start_servers.bat` in the project root. It will automatically start both the backend API and frontend dev server and open `http://localhost:5173`.

### Option 2: Manual Terminal Startup

**1. Start the Backend API:**
```bash
python run_backend.py
```
*Backend runs on `http://127.0.0.1:8000` (Docs at `/docs`)*

**2. Start the Frontend:**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🎓 2-Minute College Viva / Demo Script

1. **Open the App**: Notice the clean fintech dashboard displaying *"Payment Environment Secure"*.
2. **Normal Payment Demonstration**:
   - Enter **Receiver: Rahul**, **Amount: ₹500**.
   - Click **Continue (Send Secure Payment)**.
   - Watch the animated packet travel across the communication channel.
   - Note the **"What's happening in the background?"** feed showing digest generation and verification.
   - Confetti triggers with **🟢 Payment Secure & Verified**.
3. **Simulate MITM Attack**:
   - Toggle **"Simulate MITM Attack"** (or click the Attack CTA).
   - Notice the **🔴 Simulated Intermediary** node appear in the channel.
   - Choose a tamper option (e.g. *Divert Beneficiary to "Attacker Mallory"* or *Inflate Amount*).
   - Click **Continue (Test MITM Detection)**.
   - Watch the packet get intercepted in transit.
   - Security verification recalculates the SHA-256 hash and detects mismatch.
   - **🚨 Security Alert** triggers: *"Simulated Payment Blocked — Suspicious communication detected"*.
4. **Forensics & Technical Deep-Dive**:
   - Click **"See What Happened"** to display the visual step-by-step forensic autopsy.
   - Click **"Technical Details"** to inspect the character-level SHA-256 hash diff highlighting the Avalanche Effect.
5. **Presentation & Quiz**:
   - Click **"Demo Mode"** on the top bar to run the automated presentation slides with narrator captions.
   - Switch to **"Learn MITM"** tab and complete the interactive security quiz.
