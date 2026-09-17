# Technical breakdown

The contracts, payloads, and failure boundaries behind the build. If you want the owner story first, start with [plain-english.md](plain-english.md).

## System boundaries

| Component | Owns | Does not own |
|---|---|---|
| Retell voice agent | Conversation state, prompt policy, when to call the tool, what to say after the tool returns | CRM writes, SMS, scheduling truth |
| Custom function `create_service_request` | HTTP POST of flat JSON to a public webhook URL | Field inventing; retries beyond Retell defaults |
| n8n webhook workflow | Validate required fields, optional GHL write, JSON response body | Spoken wording |
| GoHighLevel (intended next hop) | Contact + opportunity persistence, optional SMS | Deciding prices or ETAs the agent may invent |

```text
Caller
  -> Retell voice agent (prompt + tool timing)
  -> POST create_service_request (flat JSON)
  -> n8n webhook
  -> validate required fields
  -> [optional] GHL contact + opportunity
  -> respond { status, confirmation_reference? | missing_fields? }
  -> agent speaks only confirmed status
```

## Prompt architecture

Source: [`agent-prompt.md`](../agent-prompt.md)

| Section | Failure it prevents |
|---|---|
| Role | Agent drifts into technician / salesperson behavior |
| Speaking style | Multi-question dumps that confuse callers |
| Safety rules | Dangerous DIY advice; invented prices/availability |
| Intake sequence | Incomplete payloads |
| Tool rule | Side effects before confirmation |
| Response handling | Claiming success when the tool failed or returned `needs_human` |

Tool call is allowed only after required fields exist **and** the caller confirms the read-back.

## Tool / webhook contract

Source: [`tool-schema.json`](../tool-schema.json)

Required fields:

- `caller_name` (string)
- `phone` (string)
- `address_or_zip` (string)
- `service_type` (`HVAC` | `plumbing` | `electrical` | `other`)
- `issue_summary` (string)
- `urgency` (`emergency` | `same_day` | `routine`)
- `preferred_window` (string)
- `existing_customer` (boolean)

Sample request: [`samples/sample-request.json`](../samples/sample-request.json)

Success response shape:

```json
{
  "status": "received",
  "confirmation_reference": "DEMO-1042",
  "message": "The service request was received for human scheduling review."
}
```

Missing-field / escalation shape:

```json
{
  "status": "needs_human",
  "missing_fields": ["phone"],
  "message": "The service request is missing required information and needs human follow-up."
}
```

## n8n workflow (importable)

Source: [`n8n-retell-service-request-workflow.json`](../n8n-retell-service-request-workflow.json)

Shared validation logic (unit-tested): [`lib/validate-service-request.js`](../lib/validate-service-request.js)

Nodes in the shipped demo:

1. **Retell Webhook:** `POST` path `retell/create-service-request`, response mode `responseNode`
2. **Validate Request:** Code node checks required keys, string non-emptiness, enums (`service_type`, `urgency`), and boolean `existing_customer`; builds `received` or `needs_human`
3. **Respond to Retell:** returns a **minimal** JSON body (no full PII echo)

What the shipped JSON does **not** include yet: live GHL credentials or SMS nodes. The intended GHL hop is documented in [`ghl-wiring-summary.md`](ghl-wiring-summary.md) so the full production path is visible without fake "already live" claims.

### Auth, retries, fail-closed

| Concern | Demo stance | Production note |
|---|---|---|
| Webhook auth | Path obscurity only in the importable JSON | Put a shared secret header (or Retell IP allowlist + secret) in front of n8n before going live |
| Retries | Retell may retry on timeout; the Code node is idempotent for validation | Deduplicate CRM writes with an external idempotency key if you add GHL nodes |
| Fail-closed | Missing/invalid fields → `needs_human`; never invent `received` | Same rule after CRM errors: return `needs_human`, do not speak success |
| PII in responses | Success/failure bodies omit the lead payload | Keep logs redacted; blur IDs in any published screenshot |

Run `npm test` and `npm run demo:validate` for local proof without a live n8n host.

## Failure isolation method

When a run looks wrong:

1. Capture the Retell transcript (what was said and when the tool fired).
2. Inspect the raw POST body n8n received.
3. Compare keys to the schema (name, nesting, empty strings).
4. Fix the smallest failing boundary (prompt timing, schema field, expression, or GHL mapping).
5. Retest that node with known input, then rerun the full call.

A green n8n node is not proof. Proof is call + payload + response + spoken result agreeing.

## Tests

See [`test-plan.md`](../test-plan.md) for golden path and failure cases (missing phone, gas smell, unknown price, tool timeout, `needs_human`).
