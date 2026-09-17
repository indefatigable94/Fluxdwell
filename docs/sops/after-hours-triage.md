# SOP (demo): After-hours triage routing

**Label:** Rebuildable pattern / demo SOP. Not a live client install.

## Business problem

A trade shop closes at 5. Calls keep coming. Voicemail fills up. By morning the best jobs already booked someone else. The owner does not need a chatbot personality. They need a clean triage: what broke, how urgent, who to call back first.

## Desired outcome

After hours, every non-emergency caller gets a calm intake. Emergencies get safety direction and a human path. Everything else lands as a structured request a dispatcher can open without replaying a 4-minute voicemail.

## Conversation / workflow contract

Collect and confirm before any side effect:

| Field | Why it matters |
|---|---|
| `caller_name` | Who to address on callback |
| `phone` | Reachability |
| `address_or_zip` | Routing / territory |
| `service_type` | Which tech bench |
| `issue_summary` | Dispatcher context |
| `urgency` | `emergency` \| `same_day` \| `routine` |
| `preferred_window` | Scheduling hint |
| `existing_customer` | Account path vs new lead |

Spoken rules: one question at a time, read-back before tool call, never invent price or ETA.

## Retell shape

- Prompt sections: role → style → safety → intake → tool timing → honest result
- Custom function: `create_service_request` (see [`tool-schema.json`](../tool-schema.json))
- Tool fires only after caller confirms the read-back

## n8n shape

```text
Webhook POST /retell/create-service-request
  → Validate types + required fields (fail closed)
  → Optional CRM upsert (documented hop)
  → Respond { status: received | needs_human, ... }
```

Minimal response only. Do not echo full PII back into the voice turn.

## Failure rules

| Case | System behavior |
|---|---|
| Gas / smoke / flood near power | Safety first; escalate; no DIY troubleshooting |
| Missing or invalid field | `needs_human`; agent does not invent success |
| Tool timeout | Apologize; promise a human callback; never claim ticket created |
| Caller refuses phone | Explain why it is needed; do not call the tool |

## How to prove it

1. Golden call with full fields → `status: received` + confirmation reference spoken.
2. Missing phone → tool not called, or `needs_human` spoken honestly.
3. Compare Retell transcript, n8n payload, response body.

See also: [`../agent-prompt.md`](../agent-prompt.md), [`../test-plan.md`](../test-plan.md).
