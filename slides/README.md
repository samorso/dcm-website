# Slides

Decks published with the site — **a self-contained HTML deck or a PDF**. Each
file here is served at `/slides/<filename>`, and the session page labels the
link with its format automatically.

HTML is the preferred format: a xaringan/remark or reveal.js deck rendered with
`self_contained: true` opens in the browser, needs no download, and works on a
phone. Lecture 00 is one such file.

## Publishing a deck

1. Build the deck in its own repository — `make lecture01` for the LaTeX Beamer
   decks in `slides-2026`, or knit the `.Rmd` for a xaringan deck.

2. Copy the file here. From the website repository:

   ```bash
   cp ../redesign-notes/lecture00-data-analytics-style/lecture00.html \
      slides/lecture00-introduction.html
   ```

   or, to copy every deck in a build directory at once:

   ```bash
   make slides                                        # ../slides-2026/build
   make slides SLIDES_SRC=../path/to/other/decks      # anywhere else
   ```

   `make slides` copies `*.pdf` and `*.html`, keeping the source filenames.
   Rename to the descriptive form used here (`lectureNN-topic.html`) so the URL
   reads well.

3. Point the session at it in `course.json`:

   ```json
   { "id": "code-literacy-1", "...": "...", "slides": "slides/lecture02-code-literacy.html" }
   ```

4. Make sure the session's id is in `published` in `course.json`, or the deck
   stays withheld — see *What students can see* in the top-level README.
5. `make check` (confirms the file exists), then commit and push.

## An HTML deck must be self-contained

One file, with CSS, JavaScript and images inlined — nothing beside it. For
xaringan that means `self_contained: true` in the YAML header; the images then
arrive as `data:` URIs and remark.js is embedded. Check before committing:

```bash
grep -oE '(src|href)="[^"]+"' slides/your-deck.html | grep -v 'data:' | sort -u
```

Outward links to sources are expected. A reference to a local file — a
`theme.css`, a `libs/` folder, an `images/` path — means the deck is **not**
self-contained and will render broken once published, because only the single
file is copied here. Re-render it with the self-contained option.

(Lecture 00 loads MathJax from a CDN for its maths. That is the one external
request it makes; it degrades to unrendered maths if the CDN is unreachable.)

A session with no `slides` field, or one that is not yet published, shows
"Slides and material are published here after the session" — the normal state
before a deck is ready. A withheld PDF is deleted from the published site by
`tools/prune.py`, so its URL 404s rather than handing out next month's deck.

## Other material

Anything else you want to hand out — a handout, a notebook, a dataset — can
live here too and be listed on the session page:

```json
"materials": [
  { "label": "Practice instructions", "url": "slides/lecture01-practice.pdf" },
  { "label": "Starter repository",    "url": "https://github.com/...", "kind": "repo" }
]
```

`kind` is the small label on the right of the link. Leave it out and the site
infers it from the file extension (`pdf`, `html`, otherwise `link`).

## What not to put here

Do not copy generated slide directories (`_files/`, `site_libs/`, LaTeX build
artefacts) or deck sources (`.Rmd`, `.tex`). Only the finished deck — one PDF or
one self-contained HTML file — belongs in a public website repository.
