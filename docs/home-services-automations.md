# Home-services automations

The quieter systems next to voice intake. Estimates that go cold. No-answer SMS. Keeping the CRM clean after a lead lands.

I keep internal lead-discovery pipelines off this page on purpose. Useful for me. Not the answer to "how does my HVAC shop stop losing jobs?"

## What is here

| Automation | Why an owner cares | How it is built |
|---|---|---|
| Quote / estimate follow-up | Soft leads die by day 5-10; Day 2 / 5 / 10 check-ins keep the job warm | Enroll → tick steps → pause on reply → human takes over · [SOP](sops/estimate-follow-up.md) |
| Outbound SMS (HVAC / plumbing) | No-answer after voicemail still gets a second shot without living in your phone | Immediate → 24h → 72h break-up; STOP aware |
| Lead intake → CRM validation | Flagship Retell path in this repo; same "fail closed to a human" rule | Schema gate before any CRM write · [after-hours SOP](sops/after-hours-triage.md) |

## In owner language

You sent the estimate. Silence starts killing it. The system checks in so the job does not go cold. If they reply, automation stops and a human owns the thread. That is not spam. That is refusing to let quiet cost you the job.

## In engineer language

- State machine per contact
- Dry-run by default; live send needs an explicit flag
- Pause on inbound reply
- Separate tracks when needed (for example SMS-only for some ICPs)
- Templates reviewed before anything goes out

Typical estimate track:

```text
Day 0   estimate sent / enrolled
Day 2   soft check-in SMS or email
Day 5   value nudge
Day 10  break-up / last touch
Reply   pause cadence; human owns the thread
STOP    honor immediately
```

## How this ties to the voice build

Voice intake puts clean fields in the CRM. Cadence and MCTB keep the lead warm after the call. Same rules: validate before write, fail closed to a human, never invent success.

See also:

- [Speed-to-lead (MCTB)](speed-to-lead-mctb.md)
- [GHL wiring summary](ghl-wiring-summary.md)
- [Technical breakdown](technical-breakdown.md)
