# Reserv Glance · Claims exception queue prototype

Unofficial, Reserv-styled product prototype: a claims exception queue where a synthetic
P&C claim exception loads, Glance AI drafts an adjuster action with a claim-doc citation
(doc name + page or field), and the adjuster Approves or Denies with a one-line cited why.

## What it demonstrates

- Exception queue -> AI draft + citation -> Approve / Deny, the HITL gate before an
  automated action posts to a claim file
- Deny path that sends the draft back with a cited note and returns a clearer draft,
  proving the queue is not auto-approve theater
- Light status chips only (Ready for adjuster / Needs review / Escalated); no eval
  scorecard as the hero

## Run it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then walk: approve the duplicate-invoice exception, deny the reserve-change draft with
a cited note, watch the draft re-issue, approve it, and watch the queue advance.

## Data and branding

All claims, invoices, estimates, and reserves are synthetic. No carrier claim systems
were accessed and no accounts were created. Visual style and terminology (claim,
exception queue, adjuster, AI draft, citation, reserve, estimate, Glance, automate the
mundane, humanize the complex) are matched from public Reserv marketing material
(reserv.com) so the prototype reads like a feature inside their product; it is not
affiliated with or endorsed by Reserv. Brand assets are public assets served by
reserv.com.
