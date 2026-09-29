# GOAL.md - Reserv (2-hour build)


## Standing rules (keep in every GOAL.md)

### Prototype, not demo-as-deliverable
Build a working prototype Ami can walk through in 90 seconds. The deliverable is the prototype. The 90-second demo is only how Ami presents that prototype. Do not treat a demo as the thing you ship.

### UI observation (mandatory)
Public sources only: website screenshots, demo videos (with timestamps), product tours, docs, help center, app-store screenshots, changelog images. Never sign up, create accounts, or log in.

Every GOAL.md must include `## Their UI` before Acceptance criteria, with subsections in this order:
1. Sources
2. Layout
3. Visual style
4. Tone of UI copy
5. The exact screen where my proposed improvement would live
6. Build instruction (match their visual style and terminology so the prototype looks like a feature inside their product)

Be honest: if only marketing illustrations are visible, say "marketing UI only" and infer carefully. If no UI is publicly visible, say so, describe what can be inferred from docs, and default to a clean neutral style.

Writing: simple English. No em dashes or en dashes.

## Role this GOAL targets
- **Open role:** Product Manager
- JD: https://ats.rippling.com/reserv/jobs/239d4e94-a3c2-43ee-a99d-3e399708c10d
- Location: Remote US. Rippling lists Remote (Atlanta, GA) as the posting location. **Location caveat:** candidates must reside in an eligible U.S. state throughout employment. Reserv cannot hire candidates in California, Alaska, Hawaii, U.S. territories, or outside the United States. Ami is in Baltimore, MD (eligible).
- Comp (public): not listed on this Rippling JD
- Core job (from JD): drive development of **data-centric products** supporting insurance claims services and operations. Strategy, execution, and delivery of data solutions; collaborate with eng, data science, ops, and business; lifecycle from requirements to launch; optimize performance. Classic PM checklist (vision buy-in, pricing / positioning, requirements, prioritization, launches, evangelism, customer visits) with a clear data / analytics tilt.
- Bar notes: **5+ years** PM focused on data-driven products, ideally insurance or financial services. Data architecture / analytics platforms fluency. Agile backlog / sprint ownership. Role reads more **data PM** than pure Agent PM. Be honest about years bar and data tilt in outreach; claims automation + HITL exception UX is still on-thesis for Ami's builder craft.
- Sponsorship: Unknown from public JD. US residence is required; non-US blocked. Confirm H-1B / transfer willingness in process (US-only employment constraint is the hard public signal).

## /goal
Build a working **claims exception queue** prototype for Reserv: load a synthetic P&C claim exception, show an AI-drafted adjuster action with a **claim-doc citation**, then let the adjuster **Approve** or **Deny** with a one-line cited why. Prove Ami can productize Reserv's claims automation wedge (automate the mundane, humanize the complex), not a generic underwriting eval harness. Ami must walk through this prototype in 90 seconds.

**Hard product rule:** Do NOT make the hero an eval packet, scorecard, Rubric Lens strip, or underwriting autonomy ladder. Light status chips (Ready for adjuster / Needs review) are OK as secondary chrome only. The hero is exception queue → AI draft + citation → Approve / Deny.

## Live demo
- Status: not built yet
- Link: TBD
- What it is: Reserv-styled claims exception queue (claim exception → AI-drafted action + citation → Approve / Deny)

## Scope (fits 2 hours)
- Synthetic inputs only (no real claim files, no signed-in Reserv Glance, no carrier claim systems, never create an account).
- 1 primary happy path: synthetic auto or property claim exception (example: duplicate invoice line, missing estimate page, or reserve change suggestion) → AI drafts adjuster action with citation into the claim note / attachment → adjuster Approves or Denies with one-line why → queue advances.
- Optional second exception that Denies and returns a clearer ask to the AI draft (shows the loop is not auto-approve theater).
- Queue shows: claim header (id, line of business, age), exception reason, AI draft card with doc citation, Approve / Deny CTAs, adjuster note.
- Out of scope: live FNOL intake, payment rails, production Glance migrations, real reserve math engines, eval harness packets, Rubric Lens, underwriting submission flows.

## Reuse first
- Reuse **HITL + cited evidence** craft from Prior Auth / portfolio agent UX on https://amiteshdwivedijhu-ship-it.github.io/ (AI draft, citation, human Approve / Deny). Map to claims adjuster language, not underwriting.
- Do **not** force Shepherd-style autonomy ladders, Gyde voice deploy, or Rubric Lens into the Reserv hero. Claims exception queue only.
- Vocabulary to prefer: claim, exception queue, adjuster, AI draft, citation, Approve, Deny, reserve, estimate, FNOL (only if needed), Glance, automate the mundane, humanize the complex, TPA. Avoid: scorecard, Rubric Lens, Auto-price, underwriting submission, golden-set eval table as hero.

## Their UI

**Honesty note:** marketing UI only. Homepage and careers show TPA / claims marketing: Data Advantages for MGAs, P&C focus, analytics, global reach, AI-driven engine, white-glove service, Reserv Glance named in press. No signed-in Glance console, adjuster desktop, or exception queue screenshots were observed on public pages. Never created an account or logged in. Optional local assets under `ui/` are public OG image, favicon, hero art, and logo SVG (no login). Infer an internal adjuster exception queue carefully from homepage AI language + Series C Glance description. Say when something is inferred.

### Sources
- Homepage (We create Data Advantages; AI-Driven Engine; automate the mundane and humanize the complex): https://reserv.com/
- Careers (Join our squad; remote work environment): https://reserv.com/careers
- Series C press ($125M led by KKR; Reserv Glance claims platform; explainable AI; nearly 200 clients; 500+ adjusters): https://www.businesswire.com/news/home/20260504407536/en/Reserv-Announces-%24125-Million-Series-C-Financing-Led-by-KKR-to-Accelerate-AI-Driven-Transformation-of-Insurance-Claims
- Product Manager JD: https://ats.rippling.com/reserv/jobs/239d4e94-a3c2-43ee-a99d-3e399708c10d
- ATS board: https://ats.rippling.com/reserv/jobs
- Optional saved public assets: `ui/og-image.jpg`, `ui/favicon.jpg`, `ui/hero.png`, `ui/logo.svg`, `ui/icon-group.svg`

### Layout
- Marketing homepage: green-forward brand hero, solution cards (P&C Focus, Analytics and Reporting, Global Reach, AI-Driven Engine, Strategic Thought Partner), how-we-help pillars, customer quotes from brokers / MGAs. Source: https://reserv.com/
- Press product cue: Reserv Glance consolidates historical and open claims, uses explainable AI to analyze and act, lets clients choose automation level from simple claims to complex supported cases.
- Inferred product surface for this prototype: an **adjuster exception queue** inside Glance-style claims ops: left = queue list of exceptions; center = claim context + AI-drafted action with doc citation; right = Approve / Deny + note. (Inferred from homepage "automate the mundane, humanize the complex" + Glance press language; not a logged-in screenshot.)

### Visual style
- Colors (from public site cues): deep forest green ink (~#295025, #0C1F19), bright mint / green accent (~#22D690, #80EFA3), muted teal-gray supporting text (~#6B7E80), light gray paper (#f0f0f0), white cards.
- Typography: clean sans for UI and marketing headlines.
- Density: medium. Queue row + one draft card + Approve / Deny. Not a dense BI spreadsheet (even though the JD is data-heavy).
- Components: rounded cards, green primary Approve CTA, secondary Deny / ghost, citation chips (doc name / page / field), exception reason pills, status chips (Ready for adjuster, Needs review).
- Mode: light mode in all public materials observed.

### Tone of UI copy
- Claims ops language: claim, exception, adjuster, AI draft, citation, Approve, Deny, reserve, estimate, cycle time, automate the mundane, humanize the complex.
- Press / product words to reuse where they fit: Glance, explainable AI, supported approach for complex cases.
- Calm, operational, evidence-first. No underwriting Auto-price language. No eval-lab Pass / Fail hero.

### The exact screen where my proposed improvement would live
- The inferred **claims exception queue** an adjuster opens when AI has drafted an action that still needs a human gate: after automation flags or drafts, before the action posts to the claim file. This matches Reserv's public promise to automate the mundane and keep humans on the complex, and it is a product surface Ami can own even on a data-PM-leaning JD.

### Build instruction
- Match Reserv closely enough that the prototype looks like an internal Glance / adjuster feature: white cards, forest green + mint accents, sans labels, citation chips, Approve / Deny CTAs.
- Use their terminology: claim, exception queue, adjuster, AI draft, citation, Approve, Deny, automate the mundane, humanize the complex, Glance (optional label).
- Walk left-to-right or top-to-bottom: queue → draft + citation → Approve / Deny. Keep any Ready/Needs-review chip secondary. No eval table as hero.
- Rejected pattern: do not rebuild underwriting eval harnesses, autonomy ladders, or Rubric Lens as the hero.

## Acceptance criteria (must work when Ami demos the prototype in 90 seconds)
1. Load a synthetic claim exception → show claim header + exception reason.
2. Show an AI-drafted adjuster action with a claim-doc citation (doc name + page or field pointer).
3. Adjuster can **Approve** or **Deny**; Deny requires a one-line cited why.
4. Optional second exception path that Denies and requests a clearer draft, proving the queue is not auto-approve theater.
5. Hero is the exception queue, not an eval scorecard, Rubric Lens strip, or underwriting Auto-price flow.
6. Walkthrough proves exception → cited AI draft → Approve / Deny in ~90 seconds.

## What the 90-second walkthrough proves about THEIR problem
Reserv is an AI-native P&C TPA and claims technology company that raised a $125M Series C led by KKR to scale claims capacity with Reserv Glance and explainable AI, while keeping adjusters on complex judgment (https://reserv.com/ ; https://www.businesswire.com/news/home/20260504407536/en/Reserv-Announces-%24125-Million-Series-C-Financing-Led-by-KKR-to-Accelerate-AI-Driven-Transformation-of-Insurance-Claims). The Product Manager JD leans data products, but the company story is claims automation with humans on exceptions (https://ats.rippling.com/reserv/jobs/239d4e94-a3c2-43ee-a99d-3e399708c10d). Walking through this prototype shows Ami can productize that exception moment: AI drafts with citations, adjuster Approves or Denies, the mundane clears and the complex stays human.

## TIMEBOX
If the prototype is not walkthrough-ready at 2 hours: LIGHT pitch fallback = open Prior Auth / HITL citation craft from https://amiteshdwivedijhu-ship-it.github.io/ + 2 mapping lines:
1) "Your claims story is automate the mundane and humanize the complex; Glance-scale AI only wins if adjusters get a cited draft they can Approve or Deny."
2) "The 2-hour extension is a Reserv-styled exception queue: claim exception → AI draft + citation → Approve / Deny."
Do not fall back to Rubric Lens or underwriting eval tables as the story. Note MD eligibility and the 5+ years / data-PM tilt honestly if asked.
