/* ---------------------------------------------------------------------------
 * Data and Code Management — Autumn 2026
 *
 * A dependency-free static site. No build step, no framework, no backend.
 *
 * Structure
 *   course.json        structured course content (identity, pillars, schedule,
 *                      assessment, tools, nav) — the file you edit weekly
 *   content/*.md       prose pages, with a small `--- key: value ---` header
 *   content/lectures/  one optional Markdown note per teaching week
 *
 * Routing is HASH-based on purpose: every URL is index.html plus a fragment, so
 * deep links and refreshes work on GitHub Pages with no rewrite rules, under a
 * custom domain or a /repo/ subpath, and on any other static host.
 * ------------------------------------------------------------------------- */

"use strict";

/* ============================ integration boundary ======================== */

let COURSE = null;
const mdCache = new Map();

async function loadCourse() {
  const res = await fetch("course.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`course.json (HTTP ${res.status})`);
  return res.json();
}

/** Fetch a Markdown file once; returns { meta, body }. */
async function loadMarkdown(path) {
  if (mdCache.has(path)) return mdCache.get(path);
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path} (HTTP ${res.status})`);
  const parsed = parseFrontMatter(await res.text());
  mdCache.set(path, parsed);
  return parsed;
}

/* Minimal front matter: a leading `---` block of `key: value` lines. Values may
 * be quoted. Deliberately tiny — enough for a title and a lede, nothing more. */
function parseFrontMatter(text) {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim());
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    meta[kv[1]] = v;
  }
  return { meta, body: text.slice(m[0].length) };
}

/* ================================== helpers =============================== */

const $ = (sel, root = document) => root.querySelector(sel);

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else if (k === "style") node.setAttribute("style", v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Pillar / group accent colour, as a CSS custom property value. */
function groupColor(groupId) {
  const g = (COURSE.groups || []).find((x) => x.id === groupId);
  const key = g && g.pillar ? g.pillar : null;
  return key ? `var(--p-${key})` : "var(--p-neutral)";
}

function groupName(groupId) {
  const g = (COURSE.groups || []).find((x) => x.id === groupId);
  return g ? g.name : "";
}

function pillarColor(pillarId) { return `var(--p-${pillarId})`; }
function pillarName(pillarId) {
  const p = (COURSE.pillars || []).find((x) => x.id === pillarId);
  return p ? p.name : pillarId;
}

/** Today at local midnight — used to mark past / upcoming sessions. */
function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function sessionDate(row) {
  const [y, m, d] = row.date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/* ================================== icons ================================= */
/* The four stage marks come straight from the 2026 lecture deck, so the site
   and the slides use the same visual shorthand for each stage. */

const STAGE_ICONS = {
  code:        '<path d="M17 13 6 24l11 11m14-22 11 11-11 11M28 9l-8 30"/>',
  data:        '<rect x="6" y="8" width="36" height="32" rx="4"/><path d="M6 19h36M6 29h36M19 8v32"/>',
  engineering: '<rect x="5" y="5" width="16" height="16" rx="3"/><rect x="27" y="27" width="16" height="16" rx="3"/><path d="M21 13h14v14M13 21v14h14m-18-22 4 4 7-8"/>',
  production:  '<rect x="4" y="7" width="40" height="32" rx="4"/><path d="M4 17h40M11 32l8-9 9 6 9-8"/>',
};

function stageIcon(id, size = 30) {
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${STAGE_ICONS[id] || ""}</svg>`;
}

/** A small pie showing a grade weight. 25 % starts at 12 o'clock. */
function weightPie(pct) {
  const arc = pct >= 50
    ? "M24 24 L24 4 A20 20 0 1 1 24 44 Z"
    : "M24 24 L24 4 A20 20 0 0 1 44 24 Z";
  return `<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true">
    <circle cx="24" cy="24" r="20" fill="currentColor" opacity=".16"/>
    <path d="${arc}" fill="currentColor"/>
  </svg>`;
}

const ICON_PDF = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>';
const ICON_LINK = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>';

/* ============================ Markdown rendering ========================== */

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

function addHeadingIds(container) {
  const seen = new Set();
  container.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
    if (h.id) return;
    const base = slugify(h.textContent);
    if (!base) return;
    let slug = base, n = 2;
    while (seen.has(slug)) slug = `${base}-${n++}`;
    seen.add(slug);
    h.id = slug;
  });
}

/* Wrap each code block so a Copy button can sit still while the <pre> scrolls. */
function addCopyButtons(container) {
  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.parentElement && pre.parentElement.classList.contains("code-wrap")) return;
    const wrap = el("div", { class: "code-wrap" });
    pre.parentNode.insertBefore(wrap, pre);
    wrap.append(pre);
    wrap.append(el("button", {
      type: "button", class: "copy-btn", "aria-label": "Copy code to clipboard", text: "Copy",
    }));
  });
}

/* Tables get their own horizontal scroll container so the page never does. */
function wrapTables(container) {
  container.querySelectorAll("table").forEach((t) => {
    if (t.parentElement && t.parentElement.classList.contains("table-wrap")) return;
    const wrap = el("div", { class: "table-wrap" });
    t.parentNode.insertBefore(wrap, t);
    wrap.append(t);
  });
}

/* External links open in a new tab and say so to assistive tech. */
function markExternalLinks(container) {
  container.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (a.hostname === location.hostname) return;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
}

function renderMarkdownInto(target, md) {
  marked.setOptions({ gfm: true, breaks: false });
  target.innerHTML = marked.parse(md);
  addHeadingIds(target);
  wrapTables(target);
  addCopyButtons(target);
  markExternalLinks(target);
}

/* ================================ fragments =============================== */

function sectionHead(title, aside) {
  return el("div", { class: "section-head" },
    el("h2", { text: title }),
    aside ? el("span", { class: "section-aside", html: aside }) : null
  );
}

/** The signature graphic: four stages over one full-width AI band. */
function courseMap({ linkStages = true } = {}) {
  const stages = el("div", { class: "coursemap-stages" });

  COURSE.pillars.forEach((p) => {
    const inner = [
      el("p", { class: "stage-n", text: p.n }),
      el("div", { class: "stage-icon", html: stageIcon(p.id) }),
      el("h3", { text: p.name }),
      el("p", { class: "stage-purpose", text: p.purpose }),
      el("p", { class: "stage-blurb", text: p.blurb }),
      el("p", { class: "stage-detail", text: p.detail }),
    ];
    const attrs = { class: "stage", style: `--stage-color: ${pillarColor(p.id)}` };
    if (linkStages) {
      stages.append(el("a", Object.assign({ href: `#/schedule#${p.id}` }, attrs), inner));
    } else {
      stages.append(el("div", attrs, inner));
    }
  });

  const stems = el("div", { class: "coursemap-stems", "aria-hidden": "true" },
    COURSE.pillars.map(() => el("span")));

  const band = el("div", { class: "ai-band" },
    el("div", {},
      el("p", { class: "ai-band-title", text: `05 · ${COURSE.ai.label}` }),
      el("p", { class: "ai-band-sub", text: COURSE.ai.tagline })
    ),
    el("ul", { class: "ai-band-actions" },
      COURSE.ai.actions.map((a) => el("li", { text: a })))
  );

  return el("div", { class: "coursemap" }, stages, stems, band);
}

function assessmentCards({ link = true } = {}) {
  const wrap = el("div", { class: "assess" });
  COURSE.assessment.forEach((a) => {
    const covers = el("div", { class: "covers" },
      a.covers.map((c) => el("span", {
        style: `--tag-color: ${pillarColor(c)}`, text: pillarName(c),
      })));

    const inner = [
      el("div", { class: "assess-top" },
        el("div", {},
          el("div", { class: "assess-label", text: a.label }),
          el("div", { class: "assess-mode", text: `${a.mode} · ${a.when}` })
        ),
        el("span", {
          class: "weight",
          role: "img",
          "aria-label": `${a.weight} per cent of the final grade`,
          html: `${weightPie(a.weight)}<span aria-hidden="true">${a.weight}%</span>`,
        })
      ),
      el("h3", { text: a.name }),
      el("p", { class: "assess-q", text: a.question }),
      el("p", { class: "assess-text", text: a.summary }),
      covers,
    ];

    const href = a.id === "project" ? "#/project" : "#/assignments";
    wrap.append(link ? el("a", { class: "assess-card", href }, inner)
                     : el("div", { class: "assess-card" }, inner));
  });
  return wrap;
}

function workflowChain() {
  const ul = el("ul", { class: "chain" });
  COURSE.workflow.forEach((w, i) => {
    if (i) ul.append(el("li", { class: "chain-sep", "aria-hidden": "true", text: "→" }));
    ul.append(el("li", { text: w }));
  });
  return ul;
}

function outcomesGrid() {
  return el("div", { class: "numgrid" },
    COURSE.outcomes.map((o) => el("div", { style: `--item-color: ${pillarColor(o.pillar)}` },
      el("div", { class: "num-icon", html: stageIcon(o.pillar, 26) }),
      el("p", { class: "num-n", text: pillarName(o.pillar) }),
      el("h3", { text: o.title }),
      el("p", { text: o.text })
    ))
  );
}

function evidenceGrid() {
  return el("div", { class: "numgrid" },
    COURSE.evidence.map((e) => el("div", {},
      el("p", { class: "num-n", text: e.n }),
      el("h3", { text: e.title }),
      el("p", { text: e.text })
    ))
  );
}

function toolsList() {
  return el("ul", { class: "toolslist" },
    COURSE.tools.map((t) => el("li", {},
      el("span", { class: "tool-name" },
        t.url ? el("a", { href: t.url, target: "_blank", rel: "noopener", text: t.name })
              : el("span", { text: t.name })),
      el("span", { class: "tool-role", text: t.role })
    ))
  );
}

/* ================================== views ================================= */

function viewHome(view) {
  const c = COURSE.course;

  /* hero -------------------------------------------------------------- */
  view.append(el("section", { class: "hero" },
    el("p", { class: "eyebrow", text: `${c.institution} · ${c.programme} · ${c.term}` }),
    el("h1", { text: c.title }),
    el("p", { class: "hero-sub", text: c.subtitle }),
    el("div", { class: "question" },
      el("p", { class: "q-label", text: "The question this course asks" }),
      el("p", {
        class: "q-text",
        html: `Can <em>someone else</em> understand, check, reproduce and use your work?`,
      })
    ),
    el("p", { class: "lede", text: c.lede }),
    el("div", { class: "hero-actions" },
      el("a", { class: "btn btn-primary", href: "#/schedule", text: "See the semester →" }),
      el("a", { class: "btn btn-ghost", href: "#/setup", text: "Set up your machine" })
    )
  ));

  /* course map -------------------------------------------------------- */
  view.append(el("section", { class: "section" },
    sectionHead("The course map", "Four stages · AI throughout"),
    courseMap()
  ));

  /* journey ----------------------------------------------------------- */
  view.append(el("section", { class: "section" },
    sectionHead("The journey", esc(COURSE.course.progression)),
    el("div", { class: "journey" },
      COURSE.journey.map((j) => el("div", { class: "journey-step" },
        el("p", { class: "journey-n", text: `${j.stage} · ${j.name}` }),
        el("p", { class: "journey-quote", text: `“${j.quote}”` }),
        el("p", { class: "journey-text", text: j.text })
      ))
    ),
    el("div", { style: "margin-top:34px" },
      el("p", {
        class: "eyebrow",
        style: "margin-bottom:12px",
        text: "The working loop, every week",
      }),
      workflowChain(),
      el("p", {
        class: "chain-note",
        text: "AI can help at every step. You still choose the checks, and you explain the result.",
      })
    )
  ));

  /* next sessions + logistics ----------------------------------------- */
  const t = today();
  const upcoming = COURSE.schedule.filter((r) => sessionDate(r) >= t).slice(0, 3);
  const lg = COURSE.logistics;
  const ins = COURSE.instructor;

  view.append(el("section", { class: "section" },
    el("div", { class: "panel-grid" },
      el("div", {},
        sectionHead(upcoming.length ? "Next sessions" : "The semester",
          '<a href="#/schedule">Full schedule →</a>'),
        upcoming.length
          ? el("ul", { class: "upnext" }, upcoming.map((r) => el("li", {},
              el("time", { datetime: r.date, text: r.display }),
              el("div", {},
                r.page
                  ? el("a", { class: "up-title", href: `#/lecture/${r.id}`, text: r.title })
                  : el("span", { class: "up-title", text: r.title }),
                el("span", {
                  class: "up-meta",
                  text: r.kind === "no-class" ? "No normal DCM class"
                      : r.kind === "async" ? `Asynchronous · ${groupName(r.group)}`
                      : `${lg.time} · ${lg.room}`,
                })
              )
            )))
          : el("p", { class: "materials-empty", text: "The teaching semester is over — the full schedule remains below." })
      ),
      el("div", {},
        sectionHead("Practical information"),
        el("ul", { class: "factlist" },
          el("li", {}, el("span", { class: "k", text: "When" }),
            el("span", { class: "v", html: `${esc(lg.day)}s, ${esc(lg.time)}<small>${esc(lg.format)}</small>` })),
          el("li", {}, el("span", { class: "k", text: "Where" }),
            el("span", { class: "v", text: lg.room })),
          el("li", {}, el("span", { class: "k", text: "Instructor" }),
            el("span", { class: "v", html: `<a href="${esc(ins.website)}">${esc(ins.name)}</a><small>${esc(ins.office)} · ${esc(ins.officeHours)}</small>` })),
          el("li", {}, el("span", { class: "k", text: "Contact" }),
            el("span", { class: "v", html: `<a href="mailto:${esc(ins.email)}">${esc(ins.email)}</a>` })),
          el("li", {}, el("span", { class: "k", text: "Languages" }),
            el("span", { class: "v", html: "Python and R<small>You are not expected to write every exercise twice</small>" }))
        )
      )
    )
  ));

  /* assessment -------------------------------------------------------- */
  view.append(el("section", { class: "section" },
    sectionHead("Assessment", "No final exam"),
    assessmentCards(),
    el("p", { class: "chain-note", html: 'Each piece asks a harder version of the same question. <a href="#/assignments">Assignments →</a>' })
  ));

  /* materials + moodle ------------------------------------------------ */
  view.append(el("section", { class: "section" },
    sectionHead("Where things live"),
    el("div", { class: "panel-grid" },
      el("ul", { class: "materials" },
        el("li", {}, el("a", { href: "#/schedule" },
          el("span", { class: "mat-icon", html: ICON_LINK }), "Schedule, slides and weekly material",
          el("span", { class: "mat-kind", text: "site" }))),
        el("li", {}, el("a", { href: "#/setup" },
          el("span", { class: "mat-icon", html: ICON_LINK }), "Setup checks and resources",
          el("span", { class: "mat-kind", text: "site" }))),
        el("li", {}, el("a", { href: "#/ai" },
          el("span", { class: "mat-icon", html: ICON_LINK }), "AI & responsible use",
          el("span", { class: "mat-kind", text: "site" })))
      ),
      el("div", { class: "markdown", style: "font-size:16.5px" },
        el("div", { class: "note", html: `<p>${esc(COURSE.moodle.note)}</p>` })
      )
    )
  ));

  document.title = `${c.title} · ${c.term} · HEC Lausanne`;
}

/* ------------------------------------------------------------- schedule -- */

function viewSchedule(view) {
  const lg = COURSE.logistics;

  view.append(el("header", { class: "page-head" },
    el("p", { class: "page-eyebrow" },
      el("span", { text: COURSE.course.term }),
      el("span", { class: "dot", "aria-hidden": "true" }),
      el("span", { text: `${lg.day}s · ${lg.time}` }),
      el("span", { class: "dot", "aria-hidden": "true" }),
      el("span", { text: lg.room })
    ),
    el("h1", { text: "Schedule" }),
    el("p", {
      class: "page-lede",
      text: "Fourteen Thursday slots, organised the way the course is: code literacy, then data, then engineering, then production — with AI running through all of them. Each session links to its own page.",
    })
  ));

  /* the map again, unlinked, as a legend for the groups below */
  view.append(el("section", { class: "section" }, courseMap({ linkStages: false })));

  const t = today();
  const firstUpcoming = COURSE.schedule.find((r) => sessionDate(r) >= t);

  const list = el("section", { class: "section" });
  list.append(sectionHead("Week by week", "AI throughout"));

  for (const g of COURSE.groups) {
    const rows = COURSE.schedule.filter((r) => r.group === g.id);
    if (!rows.length) continue;

    const purpose = g.pillar && g.pillar !== "ai"
      ? (COURSE.pillars.find((p) => p.id === g.pillar) || {}).purpose
      : (g.id === "ai" ? "Dedicated guidance" : "");

    const group = el("section", {
      class: "sched-group", id: g.pillar || g.id,
      style: `--group-color: ${groupColor(g.id)}`,
    },
      el("div", { class: "sched-group-head" },
        el("h3", { text: g.name }),
        purpose ? el("span", { class: "group-purpose", text: purpose }) : null
      )
    );

    rows.forEach((r) => {
      const past = sessionDate(r) < t;
      const isNext = firstUpcoming && firstUpcoming.id === r.id;
      const cls = ["sched-row",
        past ? "is-past" : "",
        isNext ? "is-next" : "",
        r.kind === "no-class" ? "no-class" : ""].filter(Boolean).join(" ");

      const tags = el("div", { class: "sched-tags" });
      if (isNext) tags.append(el("span", { class: "tag tag-accent", text: "Next" }));
      if (r.kind === "async") tags.append(el("span", { class: "tag tag-magenta", text: "Asynchronous" }));
      if (r.kind === "no-class") tags.append(el("span", { class: "tag", text: "No class" }));
      if (r.kind === "workshop") tags.append(el("span", { class: "tag tag-cyan", text: "Project work" }));
      if (r.slides) tags.append(el("span", { class: "tag", text: "Slides" }));

      const body = [
        el("time", { class: "sched-date", datetime: r.date, text: r.display }),
        el("div", { class: "sched-main" },
          el("span", { class: "sched-title", text: r.title }),
          el("p", { class: "sched-summary", text: r.summary })
        ),
        tags,
      ];

      group.append(r.page
        ? el("a", { class: cls, href: `#/lecture/${r.id}` }, body)
        : el("div", { class: cls }, body));
    });

    list.append(group);
  }

  view.append(list);
  document.title = `Schedule · ${COURSE.course.title}`;
}

/* -------------------------------------------------------------- lecture -- */

async function viewLecture(view, id) {
  const idx = COURSE.schedule.findIndex((r) => r.id === id);
  if (idx === -1) { viewNotFound(view, `#/lecture/${id}`); return; }
  const r = COURSE.schedule[idx];

  const kindLabel = { lecture: "Lecture", async: "Asynchronous session", workshop: "Workshop", "no-class": "No class" }[r.kind] || "Session";

  view.append(el("p", { class: "backlink" },
    el("a", { href: "#/schedule", text: "← Back to the schedule" })));

  view.append(el("header", {
    class: "page-head", style: `--group-color: ${groupColor(r.group)}`,
  },
    el("p", { class: "page-eyebrow" },
      el("span", { class: "lead-color", text: groupName(r.group) }),
      el("span", { class: "dot", "aria-hidden": "true" }),
      el("span", { text: kindLabel }),
      el("span", { class: "dot", "aria-hidden": "true" }),
      /* sessionDate() builds a LOCAL date; new Date("2026-12-17") would be
         parsed as UTC midnight and render as the previous day west of UTC. */
      el("span", { text: sessionDate(r).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) })
    ),
    el("h1", { text: r.title }),
    el("p", { class: "page-lede", text: r.summary })
  ));

  /* materials + preparation ------------------------------------------- */
  const mats = el("ul", { class: "materials" });
  if (r.slides) {
    mats.append(el("li", {}, el("a", { href: r.slides, target: "_blank", rel: "noopener" },
      el("span", { class: "mat-icon", html: ICON_PDF }), "Slides",
      el("span", { class: "mat-kind", text: "pdf" }))));
  }
  (r.materials || []).forEach((m) => {
    mats.append(el("li", {}, el("a", { href: m.url, target: /^https?:/.test(m.url) ? "_blank" : null, rel: "noopener" },
      el("span", { class: "mat-icon", html: /\.pdf$/i.test(m.url) ? ICON_PDF : ICON_LINK }), m.label,
      el("span", { class: "mat-kind", text: m.kind || "link" }))));
  });

  view.append(el("section", { class: "section" },
    el("div", { class: "panel-grid" },
      el("div", { class: "markdown", id: "lectureBody" },
        el("p", { class: "loading", text: "Loading notes…" })),
      el("aside", {},
        sectionHead("Material"),
        mats.children.length ? mats
          : el("p", { class: "materials-empty", text: "Slides and material are published here after the session." }),
        r.prep ? el("div", { style: "margin-top:28px" },
          sectionHead("Before class"),
          el("p", { style: "font-size:15.5px;color:var(--ink-2);margin:0" , text: r.prep })
        ) : null
      )
    )
  ));

  /* prev / next -------------------------------------------------------- */
  const prev = COURSE.schedule.slice(0, idx).reverse().find((x) => x.page);
  const next = COURSE.schedule.slice(idx + 1).find((x) => x.page);
  const pn = el("nav", { class: "prevnext", "aria-label": "Adjacent sessions" });
  if (prev) pn.append(el("a", { href: `#/lecture/${prev.id}` },
    el("small", { text: "← Previous" }), el("span", { text: prev.title })));
  if (next) pn.append(el("a", { class: "pn-next", href: `#/lecture/${next.id}` },
    el("small", { text: "Next →" }), el("span", { text: next.title })));
  if (pn.children.length) view.append(pn);

  document.title = `${r.title} · ${COURSE.course.title}`;

  /* notes are optional: a missing file is a normal state, not an error */
  const body = $("#lectureBody");
  try {
    const { body: md } = await loadMarkdown(`content/lectures/${id}.md`);
    renderMarkdownInto(body, md);
  } catch (err) {
    body.innerHTML = "";
    body.append(el("p", {
      class: "materials-empty",
      text: "Notes for this session have not been published yet.",
    }));
  }
}

/* ------------------------------------------------------------------ doc -- */

async function viewDoc(view, route) {
  const wrap = el("div", {}, el("p", { class: "loading", text: "Loading…" }));
  view.append(wrap);

  let doc;
  try {
    doc = await loadMarkdown(`content/${route}.md`);
  } catch (err) {
    view.innerHTML = "";
    view.append(el("div", { class: "error-box" },
      el("p", { html: `This page could not be loaded (<code>content/${esc(route)}.md</code>). ` +
        `If you are previewing locally, make sure you are serving the folder over HTTP rather than opening the file directly.` })));
    return;
  }

  view.innerHTML = "";
  const title = doc.meta.title || route;
  view.append(el("header", { class: "page-head" },
    doc.meta.eyebrow ? el("p", { class: "page-eyebrow" }, el("span", { text: doc.meta.eyebrow })) : null,
    el("h1", { text: title }),
    doc.meta.lede ? el("p", { class: "page-lede", text: doc.meta.lede }) : null
  ));

  /* pages that carry a structured block ahead of their prose */
  if (route === "assignments") {
    view.append(el("section", { class: "section" }, assessmentCards({ link: false })));
  }
  if (route === "course") {
    view.append(el("section", { class: "section" }, courseMap({ linkStages: false })));
    view.append(el("section", { class: "section" },
      sectionHead("What you should be able to demonstrate"), outcomesGrid()));
  }

  const md = el("div", { class: "markdown" });
  view.append(md);
  renderMarkdownInto(md, doc.body);

  /* structured blocks that read better after the prose they belong to */
  if (route === "assignments") {
    view.append(el("section", { class: "section", style: "margin-top:56px" },
      sectionHead("What every submission has to show", "Homework and project alike"),
      evidenceGrid()));
  }
  if (route === "setup") {
    view.append(el("section", { class: "section", style: "margin-top:56px" },
      sectionHead("Tools, and what each one is for"),
      toolsList()));
  }

  document.title = `${title} · ${COURSE.course.title}`;
}

function viewNotFound(view, raw) {
  view.append(el("header", { class: "page-head" },
    el("h1", { text: "Page not found" }),
    el("p", { class: "page-lede", html: `There is nothing at <code>${esc(raw)}</code>.` })
  ));
  view.append(el("p", {}, el("a", { class: "btn btn-primary", href: "#/", text: "Back to the course →" })));
  document.title = `Not found · ${COURSE.course.title}`;
}

/* ================================= router ================================= */

const DOC_ROUTES = new Set(["course", "assignments", "project", "ai", "setup"]);

function parseHash() {
  // "#/schedule#engineering" -> route "schedule", anchor "engineering".
  // The trailing "#section" is a link to a heading on the target page, so it
  // must not end up inside the route.
  let raw = location.hash.replace(/^#\/?/, "");
  raw = raw.split("?")[0].split("#")[0];
  const parts = raw.split("/").filter(Boolean);
  return { parts, raw };
}

async function route() {
  const { parts, raw } = parseHash();
  const view = $("#view");
  view.innerHTML = "";

  const head = parts[0] || "";
  document.body.dataset.route = head || "home";

  if (!head) { viewHome(view); }
  else if (head === "schedule") { viewSchedule(view); }
  else if (head === "lecture" && parts[1]) { await viewLecture(view, parts[1]); }
  else if (DOC_ROUTES.has(head)) { await viewDoc(view, head); }
  else { viewNotFound(view, `#/${raw}`); }

  setActiveNav(head);
  closeNav();

  /* A hash like #/schedule#code asks for a section on the target page. */
  const anchor = (location.hash.match(/#[^#]*#(.+)$/) || [])[1];
  const target = anchor && document.getElementById(decodeURIComponent(anchor));
  if (target) target.scrollIntoView({ block: "start" });
  else window.scrollTo({ top: 0, behavior: "instant" });
}

/* =================================== nav ================================== */

function buildNav() {
  const ul = $("#navList");
  ul.innerHTML = "";
  COURSE.nav.forEach((n) => {
    ul.append(el("li", {}, el("a", {
      href: `#/${n.route}`, "data-route": n.route, text: n.label,
    })));
  });
}

function setActiveNav(head) {
  document.querySelectorAll("#navList a").forEach((a) => {
    const r = a.dataset.route;
    const active = r === head || (r === "schedule" && head === "lecture");
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function closeNav() {
  $("#siteNav").classList.remove("open");
  $("#navToggle").setAttribute("aria-expanded", "false");
  $("#navToggle").setAttribute("aria-label", "Open navigation");
}

/* ================================== theme ================================= */

const THEME_KEY = "dcm-theme";
const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function readPref() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch (e) { return "system"; }
}

function applyTheme(pref) {
  const dark = pref === "dark" || (pref === "system" && media && media.matches);
  const r = document.documentElement;
  r.setAttribute("data-theme", dark ? "dark" : "light");
  r.setAttribute("data-theme-pref", pref);
  try { localStorage.setItem(THEME_KEY, pref); } catch (e) {}
  document.querySelectorAll(".theme-opt").forEach((b) => {
    b.setAttribute("aria-checked", b.dataset.theme === pref ? "true" : "false");
  });
}

function wireTheme() {
  applyTheme(readPref());

  const btn = $("#themeBtn");
  const pop = $("#themePop");
  const open = () => { pop.hidden = false; btn.setAttribute("aria-expanded", "true"); };
  const close = () => { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); };

  btn.addEventListener("click", (e) => { e.stopPropagation(); pop.hidden ? open() : close(); });
  pop.querySelectorAll(".theme-opt").forEach((opt) => {
    opt.addEventListener("click", () => { applyTheme(opt.dataset.theme); close(); btn.focus(); });
  });
  document.addEventListener("click", (e) => {
    if (!pop.hidden && !pop.contains(e.target) && e.target !== btn) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !pop.hidden) { close(); btn.focus(); }
  });
  if (media && media.addEventListener) {
    media.addEventListener("change", () => { if (readPref() === "system") applyTheme("system"); });
  }
}

/* ============================== global wiring ============================= */

function wireUI() {
  const toggle = $("#navToggle");
  const nav = $("#siteNav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  window.addEventListener("hashchange", route);

  const view = $("#view");

  /* In-page links inside rendered Markdown. The site is hash-routed, so a bare
     "#slug" would otherwise be read as a route change. Only intercept when the
     target heading actually exists on this page. */
  view.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (href.startsWith("#/")) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });

  view.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const pre = btn.closest(".code-wrap").querySelector("pre code, pre");
    if (!pre) return;
    try {
      await navigator.clipboard.writeText(pre.textContent);
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1500);
    } catch (err) { /* clipboard unavailable (insecure context) — leave as is */ }
  });
}

function fillFooter() {
  const c = COURSE.course, lg = COURSE.logistics, ins = COURSE.instructor;
  $("#footerMeta").innerHTML =
    `${esc(c.programme)} · ${esc(c.institution)} · ${esc(c.term)} — ` +
    `${esc(lg.day)}s ${esc(lg.time)}, ${esc(lg.room)} · ` +
    `<a href="mailto:${esc(ins.email)}">${esc(ins.name)}</a>`;
}

/* ================================== boot ================================== */

(async function boot() {
  wireTheme();
  try {
    COURSE = await loadCourse();
  } catch (err) {
    $("#view").innerHTML =
      '<div class="error-box"><p><strong>The course data could not be loaded.</strong> ' +
      'If you are previewing locally, serve this folder over HTTP — for example ' +
      '<code>python3 -m http.server 8000</code> — rather than opening index.html from disk.</p></div>';
    return;
  }
  buildNav();
  fillFooter();
  wireUI();
  await route();
})();
