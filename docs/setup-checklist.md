# Setup checklist

Reproduce the Princeton Heating & Air lead intake chain without guessing.

## Before you start

- [ ] Retell account + workspace you control
- [ ] n8n instance with a **public** webhook URL (localhost will not receive Retell callbacks)
- [ ] Optional: GoHighLevel location + API/private integration token for the CRM hop
- [ ] No real customer data in demos (use the sample Jordan Lee payload)

## 1. Retell agent

- [ ] Create agent named `Princeton Heating & Air - Lead Intake Demo`
- [ ] Choose a clear English voice
- [ ] Paste [`agent-prompt.md`](../agent-prompt.md) into agent instructions
- [ ] Add custom function `create_service_request` (POST)
- [ ] Point the function URL at your n8n production webhook
- [ ] Align argument schema with [`tool-schema.json`](../tool-schema.json)

## 2. n8n workflow

- [ ] Import [`n8n-retell-service-request-workflow.json`](../n8n-retell-service-request-workflow.json)
- [ ] Activate the workflow
- [ ] Copy the production webhook URL into Retell
- [ ] POST [`samples/sample-request.json`](../samples/sample-request.json) with a manual HTTP client and confirm a `received` response
- [ ] POST a payload missing `phone` and confirm `needs_human`

## 3. Optional GHL hop

- [ ] Follow [`ghl-wiring-summary.md`](ghl-wiring-summary.md)
- [ ] Upsert contact by phone after validation succeeds
- [ ] Create opportunity on a demo pipeline/stage
- [ ] Return a searchable `confirmation_reference`
- [ ] Keep secrets out of git and out of spoken responses

## 4. End-to-end proof

- [ ] Golden-path call (AC running, not cooling) per [`test-plan.md`](../test-plan.md)
- [ ] Transcript shows read-back **before** tool call
- [ ] n8n execution shows matching JSON body
- [ ] Agent speaks the returned status only
- [ ] At least one failure test (missing phone, gas smell, unknown price, or tool timeout)

## Done definition

Call, payload, response, and spoken result agree, and one failure path behaves honestly.
