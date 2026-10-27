# Habib Olajide: AI Voice Intake & Operational Triage Portfolio

Practical voice agents, resilient webhook queues, and automated dispatch workflows using Retell AI, n8n, AWS, and GoHighLevel.

This repository documents personal engineering proof, system designs, and rebuildable demos.

> Rebuildable demos and wiring. Call something production only after you have checked a real call, the webhook payload, the response, what the agent said back, and at least one failure path. No API keys or real customer data live in this repository.

**Live Demo Site:** https://indefatigable94.github.io/Fluxdwell/

---

## 1. Plain-English Problem & Fix

### The Problem
Friday night. The phone rings at a medical clinic or contractor office. Nobody picks up. That caller doesn't leave a polite voicemail. They hang up and call the next company on Google.

### How We Fix It
An AI phone helper answers on the first ring and asks four simple questions: who you are, where you are, what broke, and how urgent it is. It writes those answers onto a neat checklist for the morning crew. If someone has a real emergency, it connects their call straight to a live person right away.

---

## 2. AWS & Technical Synopsis

- **Voice & Webhook Pipeline:** **Retell AI** captures caller speech and fires a structured `create_service_request` JSON webhook over HTTPS.
- **Resilient Waiting Line (Queue):** Webhooks hit **Amazon API Gateway** backed by **Amazon SQS** and an **S3 Dead-Letter Queue (DLQ)** before reaching **n8n** and **GoHighLevel CRM**. If the CRM or database restarts for maintenance, calls wait safely in line and never drop.
- **Strict Validation Gate:** The voice agent only confirms booking details after the backend validates phone numbers, required enums, and service categories.
- **Cybersecurity Controls:**
  - **Webhook Signatures:** Verifies **HMAC-SHA256** headers on every call to block fake traffic.
  - **Secret Rotation:** Stores API keys in **AWS Secrets Manager** with zero hardcoded tokens in code.
  - **PII Protection:** Masks sensitive caller fields before writing to error logs.

```
Caller
  ➔ Retell Voice Agent
  ➔ create_service_request (POST JSON)
  ➔ API Gateway + SQS Waiting Line (S3 Dead-Letter Backup)
  ➔ n8n Validation Worker
  ➔ GoHighLevel CRM / Epic Inbox Write
  ➔ Spoken Confirmation (or Immediate Live Transfer on Emergency)
```

| Artifact | Path |
|---|---|
| Agent prompt | [agent-prompt.md](agent-prompt.md) |
| Tool schema | [tool-schema.json](tool-schema.json) |
| n8n workflow | [n8n-retell-service-request-workflow.json](n8n-retell-service-request-workflow.json) |
| Validation logic (tested) | [lib/validate-service-request.js](lib/validate-service-request.js) |
| Local demo run | [docs/assets/demo-validation-run.json](docs/assets/demo-validation-run.json) |
| Test plan | [test-plan.md](test-plan.md) |

---

## 3. Real-World Business Use Cases

### Healthcare & Epic Systems Integration
- **Nighttime Nurse Triage:** When a sick patient calls the clinic after hours, the phone helper gathers their symptoms and writes a clean **SOAP note** (Subjective, Objective, Assessment, Plan) right into the nurse's **Epic In Basket**. If the caller mentions red-flag symptoms like chest pain or trouble breathing, the system skips the form and rings the on-call nurse immediately.

### Home Services & B2B Tech Revenue
- **Capturing Missed Calls ($10k+/Mo Saved):** Turns missed evening calls into booked morning jobs for HVAC, plumbing, and roofing teams.
- **24/7 Incident Dispatch for Tech Teams:** Takes urgent outage calls from enterprise clients, verifies their account tier, and pages the right on-call engineer with a clean summary ticket.

---

## 4. How I Build

1. **Name the business pain** in plain owner language.
2. **Write the contract** (fields, enums, tool boundaries).
3. **Wire the tool call** (Retell custom function to webhook queue).
4. **Validate before any CRM write** (fail closed to a human dispatcher).
5. **Script the failure path** (timeout, missing field, emergency transfer).

---

## 5. Verification & Test Suite

- `npm test`: Checks standard golden path, missing phone numbers, bad enum values, boolean gates, and PII masking.
- `npm run demo:validate`: Runs local test payloads and saves verified JSON outputs under `docs/assets/`.

---

## 6. Rebuildable Operational Patterns

| SOP | Business Problem | Technical Stack |
|---|---|---|
| [After-hours triage](docs/sops/after-hours-triage.md) | Missed evening calls become clean dispatcher tickets | Retell + n8n + SQS |
| [Estimate follow-up](docs/sops/estimate-follow-up.md) | Open quotes stall without follow-up | n8n + CRM cadence |
| [Speed-to-lead (MCTB)](docs/speed-to-lead-mctb.md) | Missed calls without fast text-back lose buyers | GoHighLevel + Webhooks |

---

## 7. Deep-Dive Docs

| Documentation | Focus Area |
|---|---|
| [Owner Overview](docs/plain-english.md) | Plain-English business ROI and operations |
| [Contracts & Payloads](docs/technical-breakdown.md) | JSON schemas and webhook contracts |
| [CRM Integration](docs/ghl-wiring-summary.md) | GoHighLevel auth and field mapping |
| [Deployment Checklist](docs/setup-checklist.md) | Step-by-step rollout checklist |

Development scripts and desktop utilities live in [docs/operator-widgets.md](docs/operator-widgets.md).

---

## Contact

Habib Olajide  
Email: [holajide@gmail.com](mailto:holajide@gmail.com)  
LinkedIn: [linkedin.com/in/habib-olajide-62346a102](https://www.linkedin.com/in/habib-olajide-62346a102/)  
Location: Bordentown / Florence, New Jersey
