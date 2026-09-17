# Speed-to-lead: Missed Call Text-Back (MCTB)

Homeowner calls about no heat. Your tech is on a roof. They hang up and dial the next company on Google.

Speed-to-lead closes that gap. The second the call is missed, a text lands. They stay in your thread instead of calling your competitor.

## What the owner feels

You were busy. The lead did not vanish into silence. A few missed emergency calls a week, at normal HVAC ticket size, is real money walking out the door. MCTB does not replace a tech. It stops the quiet loss between ring and callback.

## What happens

- Missed inbound call fires an immediate SMS (different copy for business hours vs after hours)
- Contact and opportunity update in the CRM (stage: New Missed Call)
- Keywords: `URGENT` escalates to dispatch, `BOOK` sends a booking link, `STOP` ends the sequence
- No reply: Day 0 / 2 / 5 follow-up, then stop

## Sample SMS (fictional: Princeton Heating & Air)

**Business hours**

> Hi! Sorry we missed your call. This is Princeton Heating & Air. How can we help today? Reply here or book: {booking_link}

**After hours**

> Thanks for calling Princeton Heating & Air. We're closed now. Book anytime: {booking_link}. Emergency? Reply URGENT and we'll call you back ASAP. Gas smell / flooding near power → call 911 or your utility emergency line first.

---

## Example A: set it up solely in GoHighLevel

You do not need n8n for a solid MCTB. GHL can own the whole path if the phone number and SMS are already in the location.

### Before you start

- Phone number connected in GHL (LC Phone / Twilio / carrier that posts call status into GHL)
- SMS enabled on that location
- A calendar or booking link you are willing to put in the text
- A pipeline stage such as `New Missed Call`
- Quiet hours / business hours set on the location (or inside the workflow)

### Workflow 1: Missed call → text + CRM

1. **Automation → Workflows → Create Workflow**  
   Name it something plain: `MCTB - Missed Call Text Back`.
2. **Trigger:** `Customer Replied` is wrong here. Use **Inbound Call / Call Status** (wording varies by GHL UI) filtered to **Missed**, **No Answer**, or **Voicemail**.  
   If your sub-account only exposes **Call Status Changed**, filter to missed / no answer.
3. **If / Else (hours):**  
   - Inside business hours → send the business-hours SMS template  
   - Outside business hours → send the after-hours SMS template (include `{booking_link}` and the URGENT line)
4. **Send SMS** to the caller’s phone. Keep it short. One ask.
5. **Create / Update Contact** if the caller is not already a contact (phone is the key).
6. **Add Tag:** `missed-call` (and `after-hours` when that branch fired).
7. **Create Opportunity** on your inbound pipeline, stage `New Missed Call`. Opportunity name can be `{Contact Name} - Missed Call` or just the phone if the name is blank.
8. **Internal notification (optional but smart):** SMS or email the owner / dispatcher: “Missed call from {phone}. Text-back sent.”
9. **Wait → follow-ups if no reply:**  
   - Wait 2 days → If contact has not replied → send Day 2 soft check-in  
   - Wait 3 more days → If still no reply → Day 5 last touch  
   - Then **Remove from Workflow** or clear the follow-up tag so it stops

GHL already honors standard SMS STOP / HELP behavior when messaging compliance is enabled. Do not fight that.

### Workflow 2: Keyword replies (same location, separate or branched workflow)

Trigger on **Customer Replied** / inbound SMS from a contact tagged `missed-call` (or still in the MCTB opportunity stage):

| If reply contains | Then |
|---|---|
| `URGENT` | Tag `urgent`, notify dispatcher now, move opportunity to `Urgent - Needs Callback`, optional task for the on-call person |
| `BOOK` or they ask to schedule | Send booking link again, move stage to `Booking Sent` |
| `STOP` | Remove marketing / MCTB tags, stop the follow-up workflow, leave a note that they opted out |

You can do this with **If/Else** branches on the message body, or with GHL’s keyword / conversation AI tools if the location has them. Keep the rules dumb and readable.

### GHL-only checklist

- [ ] Missed / no-answer call actually fires the trigger (place a real test call and hang up)
- [ ] SMS lands within seconds, not minutes
- [ ] Contact + opportunity show up without duplicates on a second missed call from the same number
- [ ] After-hours template is the one that fires at night
- [ ] `URGENT` pings a human
- [ ] `STOP` stops further MCTB texts
- [ ] Day 2 / Day 5 only send when there was no reply

### When GHL-only is enough

Most HVAC / plumbing shops start here. Phone, SMS, CRM, and booking already live in one sub-account. Ship this first. Prove the feeling. Add n8n later only if you need logging outside GHL, Slack fan-out, retries against flaky API calls, or a bridge into a voice agent.

---

## Example B: GHL + optional n8n

Same owner result. n8n sits beside GHL when you want extra guardrails.

```text
Missed inbound call (GHL / Twilio / carrier)
  → GHL workflow: Call Status = Missed / No Answer
  → Immediate SMS (hours-aware template)
  → Create / update Contact + Opportunity
  → Optional n8n webhook: validate, log, Slack / owner ping
  → Branch on reply (URGENT / BOOK / STOP)
  → No reply → Day 0 / 2 / 5 SMS, then stop
```

**GHL owns:** phone connection, missed-call trigger, SMS, contact, opportunity, booking link, STOP compliance.

**n8n owns (optional):** logging that sticks, schema checks, fan-out to Sheet / Slack / a voice agent, retries when GHL hiccups. Same discipline as the Retell webhook in this repo.

### n8n skeleton (no live credentials)

1. Webhook `POST /mctb/missed-call` with `phone`, optional `caller_id_name`, `missed_at`, `business_hours`
2. Validate required `phone`
3. HTTP → GHL upsert contact by phone
4. HTTP → GHL send SMS (or let native GHL SMS do it and only log here)
5. Respond `{ status: "queued", reference: "MCTB-######" }`
6. Error path → `needs_human` + owner Slack

## Failure rules

| Failure | Behavior |
|---|---|
| Empty / bad phone | Do not SMS; log + human |
| STOP / opt-out | Honor it immediately; no more messages |
| Emergency keyword | Escalate; do not diagnose on SMS |
| SMS provider 4xx/5xx | Retry once; then alert the owner; do not pretend it sent |

## Honesty note

This is a rebuildable pattern, not a claim that a named client is live on it unless you verify that separately. The Retell → n8n chain in this repo is the deepest end-to-end piece. MCTB sits next to it as the missed-call layer. The GHL-only example above is the version most shops can run without adding another tool.
