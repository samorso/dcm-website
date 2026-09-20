# Data and Code Management — course website

The website for **Data and Code Management: From Collection to Application**,
Master in Business Analytics, HEC Lausanne — Autumn 2026.

**<https://dcm.samorso.ch/>**

> This site is **not Moodle**. Moodle stays the official UNIL space for
> announcements, submissions, grades and the course forum. Nothing is submitted
> here, and there is no authentication anywhere in this repository.

It carries the syllabus, the schedule, the slides and the course materials.
Material for each session appears on the site as the semester reaches it.

---

## How it is built

A dependency-free static site: plain HTML, CSS and JavaScript, with the course
content in one JSON file and a folder of Markdown. **There is no build step** —
what you see locally is exactly what deploys. No Node, no npm, no framework, no
backend, no database. The only third-party code is a vendored Markdown parser,
so the published site makes no runtime request to a CDN.

```
index.html            page shell: header, nav, theme switch, footer
app.js                router, renderers, Markdown pipeline
style.css             design tokens and every component; light and dark themes
course.json           course structure: identity, the four stages, the schedule,
                      assessment, tools, navigation
content/              the prose pages, as Markdown
  course.md  assignments.md  project.md  ai.md  setup.md
  lectures/           one optional notes file per session
assets/
  logo-dcm.png        the DCM logo
  vendor/marked.min.js  Markdown parser, vendored
slides/               published decks, served at /slides/<file>
tools/                content validation, run in CI before each deploy
favicon.svg           the site mark
404.html              turns a path-style URL into the matching hash route
CNAME  .nojekyll      GitHub Pages configuration
.github/workflows/deploy.yml
```

Pushing to `main` validates the content and publishes it to GitHub Pages.

---

## Running it locally

```bash
make serve          # http://localhost:8000
```

or, without `make`:

```bash
python3 -m http.server 8000
```

**Serve it over HTTP — do not open `index.html` from disk.** The page fetches
`course.json` and the Markdown files, and browsers block those requests on
`file://`.

```bash
make check          # validate course.json, dates and local links
```

---

## Why hash routing

Every URL is `index.html` plus a fragment — `#/schedule`, `#/lecture/sql`. That
is a deliberate choice, not a shortcut:

- deep links and browser refresh work with **no server rewrite rules**, which
  GitHub Pages cannot provide;
- every asset path is relative, so the site works identically at
  `https://dcm.samorso.ch/`, at a `github.io` project URL, on another static
  host, or from a local folder served over HTTP;
- there is nothing to break when the domain or the base path changes.

`404.html` catches path-style URLs such as `/schedule` and redirects them to the
matching hash route.

Nothing here is GitHub-specific except the workflow file. To host it elsewhere,
serve the repository root as a static directory; no redirect rules are needed.

---

## Appearance

Light and dark themes plus a *System* option, in the header. The choice is kept
in `localStorage`, and `index.html` applies it before first paint so there is no
flash. Every colour is a custom property defined once in `style.css`, so
retheming means editing the two token blocks at the top of that file.

## Accessibility

Semantic landmarks, a skip link, keyboard-reachable navigation and theme menu
with visible focus rings, `aria-current` on the active page, labelled SVG
graphics (decorative ones are `aria-hidden`), text that reflows to ~400px,
tables that scroll rather than forcing the page sideways, and a global
`prefers-reduced-motion` rule. Contrast meets WCAG AA in both themes. There is a
print stylesheet as well.

---

Course content © Samuel Orso. The vendored Markdown parser
(`assets/vendor/marked.min.js`, marked 12.0.2) is MIT-licensed.
