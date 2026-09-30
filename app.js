/* Reserv Glance-styled claims exception queue prototype.
   Synthetic claims only. No carrier systems, no accounts.
   Flow: exception -> AI-drafted adjuster action with claim-doc citation -> Approve or Deny. */

"use strict";

/* ---------- synthetic data ---------- */

const CASES = [
  {
    id: "CLM-2026-01247",
    lob: "Commercial Auto · Collision",
    age: "18 days old",
    status: "Ready for adjuster",
    claim: {
      policy: "POL-CA-44812",
      insured: "Brightline Logistics LLC",
      lossDate: "Sep 11, 2026",
      exposure: "$12,400 est.",
    },
    exception:
      "Duplicate invoice line detected. Invoice CPN-1182 line 3 repeats line 1 (front bumper cover, part R-3391, $412.00).",
    drafts: [
      {
        v: 1,
        text: "Remove duplicate line 3 from Invoice CPN-1182 and reduce the recommended payment by $412.00 before check issue. Post a claim note: duplicate invoiced line suppressed; front bumper cover paid once at $412.00. [1][2]",
        cites: [
          {
            doc: "Invoice CPN-1182.pdf",
            loc: "p.2 · line 3",
            excerpt: "3 | R-3391 Front bumper cover | $412.00",
            note: "Matches line 1 of the same invoice exactly.",
          },
          {
            doc: "Invoice CPN-1182.pdf",
            loc: "p.2 · line 1",
            excerpt: "1 | R-3391 Front bumper cover | $412.00",
            note: "Original line; the payment already covers this part once.",
          },
        ],
      },
    ],
  },
  {
    id: "CLM-2026-01598",
    lob: "Commercial Property · Roof",
    age: "31 days old",
    status: "Needs review",
    claim: {
      policy: "POL-CP-88730",
      insured: "Midvale Plaza Holdings",
      lossDate: "Aug 29, 2026",
      exposure: "$61,200 est. repair",
    },
    exception:
      "Reserve change suggested. The AI draft increases the roof reserve by $18,400; the adjuster must confirm before the reserve posts.",
    drafts: [
      {
        v: 1,
        text: "Increase the roof reserve by $18,400 (26%) to match the repair estimate scope. [1]",
        cites: [
          {
            doc: "Repair Estimate Q-661.pdf",
            loc: "p.4 · Roof replacement line",
            excerpt: "Roof replacement, full: $61,200",
            note: "Draft reads this as new spend; check the reserve sheet before posting.",
          },
        ],
      },
      {
        v: 2,
        text: "Keep the roof reserve at $58,900, already held in full on the reserve sheet. Add a $2,300 code-compliance allowance for the roof, pending permit confirmation. [1][2]",
        cites: [
          {
            doc: "Reserve sheet RV-204",
            loc: "field 14 · Roof replacement",
            excerpt: "14 | Roof replacement | reserved $58,900",
            note: "Full roof replacement is already reserved; no increase needed.",
          },
          {
            doc: "Repair Estimate Q-661.pdf",
            loc: "p.4 · Roof replacement line",
            excerpt: "Roof replacement, full: $61,200",
            note: "The gap against the reserve is a code-compliance allowance, not new scope.",
          },
        ],
      },
    ],
  },
];

/* ---------- state ---------- */

const state = {
  waiting: CASES.map((c) => ({ ...c, decisions: [], drafts: [c.drafts[0]], extraDrafts: c.drafts.slice(1) })),
  resolved: [],
  selectedId: CASES[0].id,
  activeCite: null,
  notes: {},
  denyArmed: {},
};

/* ---------- helpers ---------- */

const $ = (sel) => document.querySelector(sel);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

function citeTokens(text) {
  return esc(text).replace(/\[(\d)\]/g, '<span class="ref" data-n="$1">[$1]</span>');
}

function lastDecision(c) {
  return c.decisions.length ? c.decisions[c.decisions.length - 1] : null;
}

/* ---------- top bar ---------- */

function renderDate() {
  $("#top-date").textContent = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

/* ---------- pills ---------- */

function statusPill(c) {
  const dec = lastDecision(c);
  if (dec && dec.kind === "approve") return '<span class="pill done">Resolved</span>';
  if (c.status === "Escalated") return '<span class="pill review">Escalated · supervisor</span>';
  if (c.status === "Needs review") return '<span class="pill review">Needs review</span>';
  return '<span class="pill ready">Ready for adjuster</span>';
}

/* ---------- queue rail ---------- */

function qrow(c) {
  const selected = c.id === state.selectedId ? " on" : "";
  const rev = c.drafts.length > 1 ? `<span class="v-badge revised">v${c.drafts.length}</span>` : "";
  return `
    <button type="button" class="qrow${selected}" data-id="${esc(c.id)}" role="option" aria-selected="${selected ? "true" : "false"}">
      <div class="qrow-top">
        <span class="q-id">${esc(c.id)}</span>
        <span class="q-age">${esc(c.age)}</span>
      </div>
      <div class="q-lob">${esc(c.lob)}</div>
      <div class="q-exc">${esc(c.exception.length > 90 ? c.exception.slice(0, 90) + "..." : c.exception)}</div>
      <div class="q-foot">
        ${rev}
        ${statusPill(c)}
      </div>
    </button>`;
}

function renderQueue() {
  $("#queue-note").textContent = state.waiting.length ? `${state.waiting.length} waiting` : "clear";
  $("#q-rows").innerHTML = state.waiting.length
    ? state.waiting.map(qrow).join("")
    : '<p class="muted" style="padding: 8px 2px;">Queue clear. Waiting on new exceptions.</p>';

  $("#resolved-head").hidden = state.resolved.length === 0;
  $("#resolved-note").textContent = state.resolved.length
    ? `${state.resolved.length} posted to claim file`
    : "";
  $("#r-rows").innerHTML = state.resolved.map(qrow).join("");

  const handled = state.waiting.length + state.resolved.length;
  $("#queue-foot").textContent = `${handled} exception${handled === 1 ? "" : "s"} handled · Glance AI drafts with citations`;
}

/* ---------- detail column ---------- */

function citeChip(cit, i, active) {
  const on = active === i ? " on" : "";
  return `<button type="button" class="cite-chip${on}" data-cite="${i}">
    <span class="sup">[${i + 1}]</span>${esc(cit.doc)} <span class="loc">· ${esc(cit.loc)}</span>
  </button>`;
}

function excerptHtml(cit) {
  return `
    <div class="cited-excerpt">
      <div class="src">Cited source · ${esc(cit.doc)} · ${esc(cit.loc)}</div>
      <div><mark>${esc(cit.excerpt)}</mark></div>
      ${cit.note ? `<div class="muted" style="margin-top:4px;">${esc(cit.note)}</div>` : ""}
    </div>`;
}

function renderDetail(c) {
  const draft = c.drafts[c.drafts.length - 1];
  const active = state.activeCite;
  const decisions = c.decisions
    .slice()
    .reverse()
    .map((d) => `
      <div class="decision ${d.kind}">
        <span class="who">${d.kind === "approve" ? "Approved" : "Denied"}</span>
        <span class="when"> · ${esc(d.when)} · ${esc(d.who)}</span>
        <div class="txt">${esc(d.note)}</div>
      </div>`)
    .join("");

  const badge = draft.v > 1
    ? `<span class="v-badge revised" title="Re-drafted after the adjuster denied v1">v${draft.v} · re-drafted</span>`
    : `<span class="v-badge">AI draft v${draft.v}</span>`;

  $("#detail").innerHTML = `
    <section class="claim-head">
      <div class="claim-top">
        <span class="claim-id">${esc(c.id)}</span>
        ${statusPill(c)}
      </div>
      <div class="claim-meta">
        <span>${esc(c.lob)}</span>
        <span>${esc(c.claim.policy)}</span>
        <span>${esc(c.claim.insured)}</span>
        <span>Loss ${esc(c.claim.lossDate)}</span>
        <span>${esc(c.claim.exposure)}</span>
        <span>${esc(c.age)}</span>
      </div>
    </section>

    <div class="exception-box">
      <div class="k">Exception</div>
      <div class="v">${esc(c.exception)}</div>
    </div>

    <section class="sec">
      <div class="sec-head"><h3>AI-drafted adjuster action</h3>${badge}</div>
      <div class="draft-card">
        <div class="draft-text">${citeTokens(draft.text)}</div>
        <div class="cites">${draft.cites.map((cit, i) => citeChip(cit, i, active)).join("")}</div>
        ${active !== null && draft.cites[active] ? excerptHtml(draft.cites[active]) : ""}
      </div>
      ${draft.v > 1 ? `<p class="revised-note"><b>Revised after your note.</b> The draft now reconciles the reserve sheet with the estimate instead of double-counting the roof.</p>` : ""}
    </section>

    ${decisions ? `<section class="sec">
      <div class="sec-head"><h3>Adjuster decisions · audit</h3></div>
      <div class="decisions">${decisions}</div>
    </section>` : ""}`;
}

/* ---------- action rail ---------- */

function renderActions(c) {
  const dec = lastDecision(c);
  if (dec && dec.kind === "approve") {
    const next = state.waiting.find((w) => w.id !== c.id);
    $("#actions").innerHTML = `
      <h3>Action</h3>
      <p class="sub">Draft posted to the claim file.</p>
      <div class="posted">
        <span class="tick">✓</span> <b>${esc(c.id)}</b> approved. The AI draft and your note are in the claim note, and the exception left the queue.
        ${next ? `<span class="go-next"><button type="button" id="next-btn">Next exception →</button></span>` : ""}
      </div>`;
    $("#next-btn")?.addEventListener("click", () => selectCase(next.id, true));
    return;
  }

  const draft = c.drafts[c.drafts.length - 1];
  const denied = !!state.denyArmed[c.id];
  const escalated = c.status === "Escalated";

  $("#actions").innerHTML = `
    <h3>Adjuster action</h3>
    <p class="sub">${draft.v > 1
      ? "Draft re-issued after your denial. Approve it or deny again with a sharper note."
      : "Approve posts the AI draft to the claim file. Deny sends the draft back with your note."}</p>
    <button type="button" class="btn btn-approve" id="approve-btn">Approve draft</button>
    <button type="button" class="btn btn-deny" id="deny-btn" ${escalated ? "disabled" : ""}>${denied ? "Deny again" : "Deny, ask AI to re-draft"}</button>
    <hr class="rail-divider">
    <div class="note-wrap">
      <label for="note-input">One-line note${denied ? " · required on Deny, cite the doc" : ""}</label>
      <input id="note-input" type="text" maxlength="160" autocomplete="off"
        placeholder="${c.id === "CLM-2026-01598" ? "e.g. Reserve sheet RV-204 field 14 already covers this" : "e.g. Duplicate confirmed against invoice line 1"}"
        value="${esc(state.notes[c.id] || "")}">
      <div class="note-hint">Required on Deny: one line with a claim-doc citation (doc + page or field). Optional on Approve; posts to the claim note.</div>
      <div class="note-err" id="note-err" hidden></div>
    </div>
    ${escalated ? `<p class="revised-note"><b>Escalated.</b> Draft unchanged after a second denial. The case stays in the queue for a supervisor review; you can still approve it.</p>` : ""}`;

  const noteInput = $("#note-input");
  noteInput.addEventListener("input", () => {
    state.notes[c.id] = noteInput.value;
    const err = $("#note-err");
    if (!err.hidden) err.hidden = true;
  });
}

/* ---------- actions ---------- */

function validateDenyNote(note) {
  if (!note || note.trim().length < 12) return "Add a one-line why before denying.";
  if (!/(p\.\s?\d+|page \d+|field \d+|line \d+|sheet|pdf)/i.test(note))
    return "Cite the source: add a doc name plus page or field (e.g. Estimate Q-661.pdf p.4).";
  return null;
}

function doApprove(c) {
  const note = (state.notes[c.id] || "").trim() || "Approved the draft as posted.";
  c.decisions.push({ kind: "approve", who: "Ami · Adjuster", when: "just now", note });
  state.resolved.unshift(c);
  state.waiting = state.waiting.filter((w) => w.id !== c.id);
  state.activeCite = null;
  renderQueue();
  renderDetail(c);
  renderActions(c);
  toast(`Approved ${c.id}. Posted to the claim note.`, "ok");
  if (!state.waiting.length) {
    setTimeout(() => toast("Queue clear. Glance waits on new exceptions.", "ok"), 1100);
  }
}

function doDeny(c) {
  const note = (state.notes[c.id] || "").trim();
  const err = validateDenyNote(note);
  if (err) {
    const el = $("#note-err");
    el.textContent = err;
    el.hidden = false;
    $("#note-input").focus();
    return;
  }
  c.decisions.push({ kind: "deny", who: "Ami · Adjuster", when: "just now", note });

  if (c.extraDrafts.length) {
    c.drafts.push(c.extraDrafts.shift());
  } else {
    c.status = "Escalated";
    state.activeCite = null;
    renderQueue();
    renderDetail(c);
    renderActions(c);
    toast(`Denied again. ${c.id} escalated for supervisor review.`, "warn");
    return;
  }

  delete state.notes[c.id];
  delete state.denyArmed[c.id];
  state.activeCite = null;
  renderQueue();
  renderDetail(c);
  renderActions(c);
  toast(`Denied ${c.id}. AI re-drafted with your note.`, "warn");
}

function selectCase(id, scroll) {
  const c = state.waiting.find((w) => w.id === id) || state.resolved.find((r) => r.id === id);
  if (!c) return;
  state.selectedId = id;
  state.activeCite = null;
  renderQueue();
  renderDetail(c);
  renderActions(c);
  if (scroll && window.matchMedia("(max-width: 1100px)").matches) {
    $("#detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- wire ---------- */

function toast(msg, kind) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

function resetAll() {
  state.waiting = CASES.map((c) => ({
    ...c,
    decisions: [],
    drafts: [c.drafts[0]],
    extraDrafts: c.drafts.slice(1),
  }));
  state.resolved = [];
  state.selectedId = CASES[0].id;
  state.activeCite = null;
  state.notes = {};
  state.denyArmed = {};
  renderAll();
  toast("Queue reset. Synthetic exceptions reloaded.");
}

function renderAll() {
  renderDate();
  renderQueue();
  const c =
    state.waiting.find((w) => w.id === state.selectedId) ||
    state.waiting[0] ||
    state.resolved.find((r) => r.id === state.selectedId);
  if (c) {
    renderDetail(c);
    renderActions(c);
  } else {
    $("#detail").innerHTML =
      '<div class="placeholder"><p>Queue clear.</p><p class="muted">Reset the queue to walk the loop again.</p></div>';
    $("#actions").innerHTML = "";
  }
}

$("#q-rows").addEventListener("click", (e) => {
  const row = e.target.closest(".qrow");
  if (row) selectCase(row.dataset.id, true);
});
$("#r-rows").addEventListener("click", (e) => {
  const row = e.target.closest(".qrow");
  if (row) selectCase(row.dataset.id, true);
});
$("#detail").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-cite]");
  if (!chip) return;
  const c = state.waiting.find((w) => w.id === state.selectedId);
  if (!c) return;
  state.activeCite = Number(chip.dataset.cite) === state.activeCite ? null : Number(chip.dataset.cite);
  renderDetail(c);
});
$("#actions").addEventListener("click", (e) => {
  if (e.target.closest("#approve-btn")) {
    const c = state.waiting.find((w) => w.id === state.selectedId) || state.resolved.find((r) => r.id === state.selectedId);
    if (c && lastDecision(c)?.kind !== "approve") doApprove(c);
    return;
  }
  if (e.target.closest("#deny-btn")) {
    const c = state.waiting.find((w) => w.id === state.selectedId);
    if (!c) return;
    if (!state.denyArmed[c.id]) {
      state.denyArmed[c.id] = true;
      renderActions(c);
      $("#note-input").focus();
      return;
    }
    doDeny(c);
  }
});
$("#reset-btn").addEventListener("click", resetAll);

renderAll();
