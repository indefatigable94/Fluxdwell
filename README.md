# Habib Olajide · AI Builder Portfolio

I diagnose real business problems and engineer AI solutions with **Retell** and **n8n** (plus GoHighLevel when the CRM hop matters).

This GitHub repo is named `Fluxdwell` for historical reasons. The work here is **personal portfolio proof**, not a company brand pitch.

> Rebuildable demos and wiring. Call something production only after you have checked a real call, the webhook payload, the response, what the agent said back, and at least one failure path. No API keys or real customer data in this repo.

**Site:** https://indefatigable94.github.io/Fluxdwell/

## The problem I solve

Friday night. Phone rings. Nobody picks up. That homeowner does not leave a polite voicemail. They call the next guy on Google.

What the office needs instead: a usable lead by morning. Who called, where they are, what broke, how urgent it is, when they want someone there.

## Featured demo: after-hours voice intake

```text
Caller
  -> Retell voice agent
  -> create_service_request (POST JSON)
  -> n8n webhook
  -> validate types + required fields
  -> [optional] GoHighLevel contact + opportunity
  -> confirmation or needs_human
  -> agent speaks only what the backend confirmed
```

| Artifact | Path |
|---|---|
| Agent prompt | [agent-prompt.md](agent-prompt.md) |
| Tool schema | [tool-schema.json](tool-schema.json) |
| n8n workflow | [n8n-retell-service-request-workflow.json](n8n-retell-service-request-workflow.json) |
| Validation logic (tested) | [lib/validate-service-request.js](lib/validate-service-request.js) |
| Local demo run | [docs/assets/demo-validation-run.json](docs/assets/demo-validation-run.json) |
| Test plan | [test-plan.md](test-plan.md) |

## How I build

1. **Name the business pain** in owner language.
2. **Write the contract** (fields, enums, when the tool may fire).
3. **Wire the tool call** (Retell custom function → n8n webhook).
4. **Validate before any CRM write** (fail closed to a human).
5. **Script the failure path** (timeout, missing field, safety escalation).

## Proof

- `npm test` — golden path, missing phone, bad enums, boolean gate, no PII echo.
- `npm run demo:validate` — writes the same two responses under `docs/assets/`.
- Live Retell / n8n screenshots land in `docs/assets/` when those dashboards are reachable. Until then, the executable local demo is the published proof.

## Mock SOPs (rebuildable patterns)

| SOP | Business problem | Stack |
|---|---|---|
| [After-hours triage](docs/sops/after-hours-triage.md) | Missed evening calls become clean dispatcher tickets | Retell + n8n |
| [Estimate follow-up](docs/sops/estimate-follow-up.md) | Soft quotes die from silence | n8n + CRM cadence |
| [Speed-to-lead (MCTB)](docs/speed-to-lead-mctb.md) | Missed call with no text-back | GHL-only (optional n8n) |

Labeled as demo SOPs, not live client installs.

## Dig deeper

| If you want… | Start here |
|---|---|
| Owner story | [docs/plain-english.md](docs/plain-english.md) |
| Contracts and payloads | [docs/technical-breakdown.md](docs/technical-breakdown.md) |
| GHL hop | [docs/ghl-wiring-summary.md](docs/ghl-wiring-summary.md) |
| Rebuild checklist | [docs/setup-checklist.md](docs/setup-checklist.md) |

Desk utilities I use while building live in [docs/operator-widgets.md](docs/operator-widgets.md). They are not the portfolio pitch.

## Stack

Retell AI · n8n · HTTP webhooks · JSON schemas · GoHighLevel (documented hop) · prompt design

## Contact

Habib Olajide · [holajide@gmail.com](mailto:holajide@gmail.com) · [LinkedIn](https://www.linkedin.com/in/habib-olajide/) · Florence, New Jersey
