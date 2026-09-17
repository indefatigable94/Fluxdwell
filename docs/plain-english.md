# Plain English walkthrough

For anyone who wants to know what this demo *does* before they care how it is wired. Personal AI-builder portfolio — not a company product brochure.

## The feeling, not the tool list

Phone rings at 6pm. Nobody picks up. That job usually goes to whoever answers first.

Incomplete intake is almost as bad. The tech shows up without a ZIP, an urgency, or a callback number, and the office spends the morning playing phone tag.

This build is a voice intake agent for a fictional shop, **Princeton Heating & Air**. It answers the call, grabs the facts a dispatcher actually needs, and only claims success when the backend says the request landed.

What you are buying, if you were buying it, is not "AI." It is the relief of knowing Friday night did not silently hand a job to your competitor.

## How a call feels end to end

1. Homeowner calls about an AC that runs but does not cool.
2. Maya asks one clear question at a time: name, phone, address or ZIP, what is wrong, urgency, new vs existing, preferred window.
3. She reads it back. Wrong detail? She fixes it before anything permanent happens.
4. She sends a structured service request into n8n.
5. n8n checks required fields. If they are there, it can create or update a contact and opportunity in GoHighLevel and send back a confirmation reference. If not, it returns `needs_human` instead of pretending.
6. Maya tells the caller only what the system confirmed. No invented prices. No fake arrival times.

## What "good" looks like here

| Owner cares about | How this build handles it |
|---|---|
| Missed or messy calls | Same intake every time |
| Junk in the CRM | Required fields before any write |
| Confident wrong answers | Agent only speaks confirmed backend status |
| Emergencies | Safety first; escalate; do not troubleshoot gas/smoke/flood near power |
| Trust | Human callback path when tools fail |

## Honest status

This repo is a rebuild guide. Prompt, schema, sample payloads, n8n import, GHL notes. Treat it as live production only after you have verified: real call → real webhook payload → confirmed response → spoken result, plus at least one failure path.

## Where to go next

- Step-by-step setup: [setup-checklist.md](setup-checklist.md)
- How Retell, n8n, and the JSON contract fit: [technical-breakdown.md](technical-breakdown.md)
- How the lead would land in GoHighLevel: [ghl-wiring-summary.md](ghl-wiring-summary.md)

## Related builds in this repo

- [Speed-to-lead (MCTB)](speed-to-lead-mctb.md)
- [Home-services automations](home-services-automations.md)
- [Operator widgets](operator-widgets.md)
