# Habib Olajide: AI Systems & Voice Intake Portfolio

Production-ready voice agents, webhook integrations, and automated CRM workflows using Retell AI, n8n, and GoHighLevel.

This repository documents personal engineering proof, system architectures, and rebuildable demos.

> Rebuildable demos and wiring. Call something production only after you have checked a real call, the webhook payload, the response, what the agent said back, and at least one failure path. No API keys or real customer data in this repository.

**Live Demo Site:** https://indefatigable94.github.io/Fluxdwell/

---

## The Business Problem

When a customer calls an emergency clinic or home services contractor after hours and hits voicemail, they do not leave a message. They call the next provider on Google.

The business needs an immediate, structured record by morning: caller identity, location, equipment issue, urgency level, and preferred service window.

---

## Featured Demo: After-Hours Voice Intake with Circuit Breaker

```
Caller
  ➔ Retell Voice Agent
  ➔ create_service_request (POST JSON)
  ➔ API Gateway + SQS Buffer
  ➔ n8n Validation Worker
  ➔ GoHighLevel Opportunity Write
  ➔ Structured Confirmation
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

## How I Build

1. **Name the business pain** in operator language.
2. **Write the contract** (fields, enums, tool execution boundaries).
3. **Wire the tool call** (Retell custom function to n8n webhook).
4. **Validate before any CRM write** (fail closed to a human dispatcher).
5. **Script the failure path** (timeout, missing field, safety escalation).

---

## Verification & Test Suite

- `npm test`: Validates standard golden path, missing phone numbers, invalid enum flags, boolean gates, and PII masking.
- `npm run demo:validate`: Executes local mock runs and outputs verified JSON responses under `docs/assets/`.
- Executable test plans and schema contracts documented in `tool-schema.json` and `test-plan.md`.

---

## Rebuildable Operational Patterns

| SOP | Business Problem | Technical Stack |
|---|---|---|
| [After-hours triage](docs/sops/after-hours-triage.md) | Missed evening calls become clean dispatcher tickets | Retell + n8n |
| [Estimate follow-up](docs/sops/estimate-follow-up.md) | Soft quotes stall without systematic follow-up | n8n + CRM cadence |
| [Speed-to-lead (MCTB)](docs/speed-to-lead-mctb.md) | Missed calls without automated text response lose deals | GoHighLevel + Webhooks |

These SOPs represent tested reference implementations for client deployments.

---

## Architecture Deep Dives

| Documentation | Focus Area |
|---|---|
| [Owner Overview](docs/plain-english.md) | Plain-English business ROI and operations |
| [Contracts & Payloads](docs/technical-breakdown.md) | Strict JSON schemas and payload contracts |
| [CRM Integration](docs/ghl-wiring-summary.md) | GoHighLevel authentication and field mapping |
| [Deployment Checklist](docs/setup-checklist.md) | Step-by-step production rollout guide |

Development scripts and desktop utilities are documented in [docs/operator-widgets.md](docs/operator-widgets.md).

---

## Technical Stack

Retell AI, n8n, AWS API Gateway, HTTP Webhooks, JSON Schema, GoHighLevel CRM, Python/Node.js, Git.

---

## Contact

Habib Olajide  
Email: [holajide@gmail.com](mailto:holajide@gmail.com)  
LinkedIn: [linkedin.com/in/habib-olajide-62346a102](https://www.linkedin.com/in/habib-olajide-62346a102/)  
Location: Florence, New Jersey
