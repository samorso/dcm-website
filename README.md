# Data and Code Management — course website (Autumn 2026)

The public website for **Data and Code Management: From Collection to
Application**, Master in Business Analytics, HEC Lausanne.

Live at **<https://dcm.samorso.ch/>**.

It is a dependency-free static site: plain HTML, CSS and JavaScript, with the
course content in one JSON file and a folder of Markdown. **There is no build
step** — what you see locally is exactly what deploys. No Node, no npm, no
framework, no backend, no database.

> This site is **not Moodle**. Moodle stays the official UNIL space for
> announcements, submissions, grades and the course forum. Nothing is submitted
> here and there is no authentication anywhere in this repository.

---

## Preview it locally

```bash
make serve          # http://localhost:8000
```

or, without `make`:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

**Serve it over HTTP — do not open `index.html` from disk.** The page fetches
`course.json` and the Markdown files, and browsers block those requests on
`file://`.

Before committing:

```bash
make check          # validates course.json, dates, links to local files
```

---

## What students can see

Students reach a session's slides, links and notes **only** when its id is
listed in `published` in `course.json`. Everything else shows "Notes for this
session have not been published yet" and offers no material.

```json
"published": ["introduction"]
```

That is not only a UI state. `tools/prune.py` deletes the unpublished sessions'
notes and files from the staged copy during deployment, so a student who types
`content/lectures/sql.md` or a slide PDF's URL gets a 404 rather than next
month's material. The repository keeps every file; only the published site is
pruned.

Local preview applies the same gate, so what you see is what students see. To
check an unpublished note before its week, read the Markdown in your editor or
add the id to `published` temporarily — just do not commit that.

`make check` prints what is currently open, so a push never publishes more
than you meant:

```
Open to students: Introduction: DCM in 2026
Withheld by tools/prune.py at deploy time: 13 session(s)
```

---

## Updating the site each week

Almost all maintenance is one of these four things.

### 1. Open a session to students

Add its id to `published` in `course.json`, commit, push. That is the whole
step — Pages redeploys and the session's material appears.

```json
"published": ["introduction", "reproducibility-git"]
```

### 2. Publish a deck or a link for a session

Copy the PDF into `slides/` (see [`slides/README.md`](slides/README.md)), then
point the session at it in `course.json`:

```json
{
  "id": "code-literacy-1",
  "date": "2026-10-08",
  "display": "8 Oct",
  "title": "Code literacy I",
  "group": "code",
  "kind": "lecture",
  "summary": "One or two sentences, shown on the schedule and the session page.",
  "slides": "slides/lecture02-code-literacy.pdf",
  "materials": [
    { "label": "Starter repository", "url": "https://github.com/…", "kind": "repo" }
  ],
  "prep": "Optional line shown under “Before class”.",
  "page": true
}
```

### 3. Write or edit the notes for a session

Create `content/lectures/<id>.md`, where `<id>` is the session's `id` above.
Start from [`content/lectures/_template.md`](content/lectures/_template.md).
Plain Markdown; no front matter needed for lecture notes.

A session with no notes file is fine — its page shows the summary, the material
list and "Notes for this session have not been published yet." An unpublished
session shows that same state whether or not the file exists.

### 4. Edit a standing page

The prose pages are `content/course.md`, `content/assignments.md`,
`content/project.md`, `content/ai.md` and `content/setup.md`. Each begins with a
small header block:

```markdown
---
title: The course
eyebrow: Syllabus · Autumn 2026
lede: One paragraph, shown large under the title.
---
```

Then ordinary Markdown. Three callout boxes are available in any content file:

```html
<div class="note">Blue — “Note”.</div>
<div class="key">Indigo — “Key idea”.</div>
<div class="warn">Magenta — “Important”.</div>
```

Code fences get a Copy button automatically; tables get their own horizontal
scroll; headings get anchor ids so `[text](#a-heading)` works within a page.
Links between pages use the hash routes: `[Setup](#/setup)`,
`[that session](#/lecture/sql)`.

---

## Repository layout

```
index.html            page shell: header, nav, theme switch, footer
app.js                router, renderers, Markdown pipeline (~800 lines, commented)
style.css             design tokens + every component; light and dark themes
course.json           ← the file you edit most: identity, pillars, schedule,
                        assessment, tools, navigation, and `published`
                        (which sessions students can reach)
content/
  course.md  assignments.md  project.md  ai.md  setup.md
  lectures/
    _template.md      copy this for a new session
    introduction.md   … one optional file per session id
assets/
  logo-dcm.png        the existing DCM logo (favicon / social card)
  vendor/marked.min.js  Markdown parser, vendored — no CDN at runtime
slides/               published PDFs, served at /slides/<file>
tools/check.py        content validator (`make check`)
tools/prune.py        withholds unpublished session material at deploy time
favicon.svg           the site mark
404.html              turns a path-style URL into the matching hash route
CNAME                 dcm.samorso.ch
.nojekyll             publish files verbatim, no Jekyll processing
.github/workflows/deploy.yml
```

### Why hash routing

Every URL is `index.html` plus a fragment — `#/schedule`,
`#/lecture/sql`. That is a deliberate choice, not a shortcut:

- deep links and browser refresh work with **no server rewrite rules**, which
  GitHub Pages cannot provide;
- every asset path is relative, so the site works identically at
  `https://dcm.samorso.ch/`, at `https://<user>.github.io/<repo>/`, on Netlify,
  or from any local folder served over HTTP;
- there is nothing to break when the domain or the base path changes.

`404.html` catches path-style URLs (`/schedule`) and redirects them to the
matching hash route, on both a custom domain and a `github.io` project page.

---

## Deployment — GitHub Pages

Pushing to `main` publishes the site through
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow
validates the content with `tools/check.py`, stages everything except the
repository's own tooling into `_site/`, removes the unpublished sessions'
material with `tools/prune.py`, and hands that folder to Pages. A failing
validation fails the deploy instead of publishing a broken schedule, and the
prune step's log lists exactly which files were withheld.

### One-time setup on GitHub

1. Create the repository and push this folder to `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push once (or run *Actions → Deploy to GitHub Pages → Run workflow*).

### Custom domain — `dcm.samorso.ch`

1. At your DNS provider for `samorso.ch`, add a `CNAME` record:

   | Type | Name | Value |
   | --- | --- | --- |
   | `CNAME` | `dcm` | `<your-github-username>.github.io.` |

   (A subdomain uses a `CNAME` record. Only an apex domain would need `A`
   records to GitHub's IPs.)

2. **Settings → Pages → Custom domain**: enter `dcm.samorso.ch` and save.
   GitHub verifies the DNS record; this can take a few minutes.
3. Tick **Enforce HTTPS** once the certificate has been issued.

The [`CNAME`](CNAME) file in this repository carries the same value, so the
custom domain survives a redeploy. Keep the two in agreement: if you ever change
the domain, change both.

### Taking the site down

**Settings → Pages → Unpublish site.** Reversible, and it does not touch the
repository.

---

## Portability

Nothing here is GitHub-specific except the workflow file. To deploy on Netlify
instead: connect the repository, leave the build command empty and set the
publish directory to `.`. No redirect rules are needed — hash routing means the
server only ever serves `index.html`.

---

## Appearance

Light and dark themes plus a *System* option, in the header. The choice is kept
in `localStorage`; `index.html` applies it before first paint so there is no
flash. Every colour is a custom property defined once in `style.css`, so
retheming means editing the two token blocks at the top of that file.

## Accessibility

Semantic landmarks, a skip link, keyboard-reachable navigation and theme menu
with visible focus rings, `aria-current` on the active page, labelled SVG
graphics (decorative ones are `aria-hidden`), text that reflows to ~400px,
tables that scroll rather than forcing the page sideways, and a global
`prefers-reduced-motion` rule. There is a print stylesheet as well.

---

Course content © Samuel Orso. The vendored Markdown parser
(`assets/vendor/marked.min.js`, marked 12.0.2) is MIT-licensed.
