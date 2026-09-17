# Operator widgets (desk tools, not the pitch)

Native macOS tools I built for my own desk. Useful while shipping Retell / n8n work. They are **not** the portfolio focus — the voice intake demo and mock SOPs are.

These are real apps I package and run. I am not claiming named contractor shops already run them in production.

## Study Typewriter · day board

Paste today's jobs and callbacks. Keep the board on top of the screen. Check them off as techs clear. Optional focus rounds for office blocks. Everything mirrors to a markdown log so the day is auditable later.

What I built:

- SwiftUI menu-bar app (`LSUIElement`), no Dock icon
- Dual lists (plan + todo) with live file / vault sync
- Undo, remove one item, clear completed
- Voice insert into lists
- Control channel so other tools can start or stop a focus block
- Packaging script into `~/Applications`

## VoiceFlow · push-to-talk notes

Hold a hotkey, say the job note or callback summary, release. The text drops at the cursor in GHL, email, SMS draft, wherever you are. Beats typing with greasy hands or mid-call.

What I built:

- Fn-hold dictation
- Groq Whisper transcription
- Accessibility paste into any app
- Clipboard save / restore around the paste
- LaunchAgent so it starts at login
- Code signing so Accessibility permissions stay stable

One hard line: VoiceFlow is dictation only. Spoken *task* intents (research, lead drafts, timers) live on a different channel. That split is on purpose.

## Why these sit here

Voice intake and CRM workflows still need a human at a desk. These widgets are how I keep that desk fast without opening five more tabs.
