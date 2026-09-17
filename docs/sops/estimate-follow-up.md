# SOP (demo): Estimate follow-up cadence

**Label:** Rebuildable pattern / demo SOP. Not a live client install.

## Business problem

You sent the estimate. Day 3 is quiet. Day 7 the homeowner forgot you exist. Soft leads die from silence, not from a bad quote. The shop needs a cadence that checks in without nagging, and that stops the second a human reply shows up.

## Desired outcome

Enrolled estimates get Day 2 / 5 / 10 touches. Reply pauses automation and hands the thread to a person. STOP is honored immediately. Nothing sends until someone reviewed the templates.

## Conversation / workflow contract

State per contact:

```text
enrolled → day2_sent → day5_sent → day10_sent → completed
                ↘ on inbound reply → paused_human_owned
                ↘ on STOP → opted_out
```

Fields the automation must know:

| Field | Source |
|---|---|
| Contact phone / email | CRM |
| Estimate sent date | Opportunity / custom field |
| Cadence step | Workflow state |
| Last inbound at | Message event |

## Retell role (optional)

Voice is usually not the follow-up channel here. Retell can still create the lead that *starts* enrollment (flagship build in this repo). Keep voice and SMS ownership separate so a failed SMS never gets spoken as “we texted you” unless the send confirmed.

## n8n shape

```text
CRM trigger: estimate marked Sent
  → Wait until Day 2 (business hours)
  → IF no reply since enroll → send soft check-in
  → Wait Day 5 → value nudge
  → Wait Day 10 → break-up / last touch
  → On inbound reply (any channel) → pause + notify owner
```

Dry-run by default. Live send needs an explicit flag or credential environment.

## Failure rules

| Case | System behavior |
|---|---|
| Contact replied | Pause cadence; human owns thread |
| STOP / unsubscribe | Opt out immediately; no more marketing SMS |
| Send API error | Log, retry once with backoff, then flag for human |
| Missing phone | Skip SMS branch; notify dispatcher instead of inventing a channel |

## How to prove it

1. Enroll a demo contact with a fake sent-date.
2. Advance waits (or use short test delays).
3. Send an inbound reply mid-cadence; confirm the next scheduled touch does not fire.
4. Capture execution screenshots with PII blurred.

See also: [`../home-services-automations.md`](../home-services-automations.md), [`../speed-to-lead-mctb.md`](../speed-to-lead-mctb.md).
