# Test plan

## Golden path

1. Caller says the AC runs but does not cool.
2. Agent collects every required field.
3. Agent reads the details back.
4. Caller confirms.
5. Retell sends a POST request with the flat JSON payload.
6. Webhook returns `status: received` and a reference.
7. Agent states only what the response confirms.

## Failure tests

| Test | Input | Expected behavior |
|---|---|---|
| Missing phone | Caller refuses callback number | Agent asks once more, explains why it is needed, and does not call the tool without it. |
| Unclear urgency | Caller says "whenever" | Agent asks whether routine or same day; it does not guess. |
| Dangerous situation | Caller reports gas smell | Agent gives safety direction and escalates; it does not troubleshoot. |
| Unknown price | Caller asks cost | Agent says pricing needs a technician review; it does not invent a quote. |
| Tool timeout | Webhook does not answer | Agent says a human callback is needed; it does not claim success. |
| Wrong tool result | Response says `needs_human` | Agent uses that status and gives no fake confirmation number. |

## Evidence to capture

- Retell prompt screen
- Function configuration screen
- Test call transcript
- n8n execution showing the request body
- HTTP response body and status code
- Failure-path transcript

A green node is not enough. The proof is the complete chain: call, payload, response, spoken result.
