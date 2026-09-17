# GoHighLevel wiring summary

**Status:** intended production hop after n8n validation. The importable n8n file in this repo validates and responds; GHL write is the documented next node, not a shipped credentialed integration.

## Plain English

Once the call produces a clean service request, the office still needs it in the CRM they already live in. For a lot of home-services teams that is GoHighLevel: contact, opportunity on a pipeline, maybe a confirmation text. Humans should open GHL and see a usable lead, not a dump of transcript text.

## Technical mapping

After the Validate Request node returns `status: received`, add an HTTP / GHL node sequence before Respond to Retell:

```text
Validate Request (status=received)
  -> Upsert Contact (phone as primary key)
  -> Create Opportunity (pipeline + stage)
  -> Optional: Send SMS confirmation
  -> Respond to Retell with confirmation_reference
```

If validation returns `needs_human`, skip CRM create (or create a tagged "incomplete intake" task) and still return an honest JSON status so the agent does not invent a confirmation number.

### Suggested contact fields

| Intake field | GHL target |
|---|---|
| `caller_name` | Contact first/last (split or full name custom) |
| `phone` | Phone (lookup / dedupe key) |
| `address_or_zip` | Postal code or address custom field |
| `service_type` | Tag or custom field `service_type` |
| `issue_summary` | Opportunity notes / custom field |
| `urgency` | Tag (`urgency:same_day`) or custom field |
| `preferred_window` | Custom field / appointment note |
| `existing_customer` | Tag `existing` / `new` |

### Suggested opportunity defaults (demo)

- Pipeline: `Inbound Service Requests`
- Stage: `New AI Intake` (or `Needs Human` when status is `needs_human`)
- Source: `Retell Voice Agent`
- Name: `{caller_name} - {service_type}`

### Confirmation back to Retell

Prefer returning a stable reference the office can search:

```json
{
  "status": "received",
  "confirmation_reference": "GHL-OPPORTUNITY-ID-OR-DEMO-CODE",
  "message": "The service request was received for human scheduling review."
}
```

Do not return secrets, API keys, or internal webhook URLs in the spoken path.

## Failure notes specific to GHL

| Failure | Isolation | Safe agent behavior |
|---|---|---|
| 401/403 from GHL | Check location token / scopes | `needs_human` + apologize; no fake confirmation |
| Duplicate contact | Upsert by phone before create | Merge; still return one reference |
| Pipeline/stage missing | Verify IDs in a test location | Fail closed to human |
| SMS provider error | Lead already in CRM | Say request was received; SMS may follow |

## Why GHL is in the story

Retell handles the conversation. n8n handles validation and HTTP. GHL is where someone on the desk actually works the lead. The open-source demo stops at validation + response. This note fills in the CRM hop that completes the path.
