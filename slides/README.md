# Slides

PDF decks published with the site. Each file here is served at
`https://dcm.samorso.ch/slides/<filename>`.

## Publishing a deck

1. Build the deck in the `slides-2026` repository (`make lecture01`, etc.).
2. Copy the PDF here. From the website repository:

   ```bash
   cp ../slides-2026/build/lecture02.pdf slides/lecture02-code-literacy.pdf
   ```

   or, to copy every built deck at once:

   ```bash
   make slides            # copies ../slides-2026/build/*.pdf into slides/
   ```

   `make slides` keeps the source filenames. Rename to the descriptive form used
   here (`lectureNN-topic.pdf`) if you want the URL to be readable.

3. Point the session at it in `course.json`:

   ```json
   { "id": "code-literacy-1", "...": "...", "slides": "slides/lecture02-code-literacy.pdf" }
   ```

4. `make check` (confirms the file exists), then commit and push.

A session with no `slides` field simply shows "Slides and material are published
here after the session" — that is the normal state before a deck is ready.

## Other material

Anything else you want to hand out — a handout PDF, a notebook, a dataset — can
live here too and be listed on the session page:

```json
"materials": [
  { "label": "Practice instructions", "url": "slides/lecture01-practice.pdf", "kind": "pdf" },
  { "label": "Starter repository",    "url": "https://github.com/...",        "kind": "repo" }
]
```

External URLs open in a new tab; repository-relative paths are served from here.

## What not to put here

Do not copy generated slide directories (`_files/`, `site_libs/`, LaTeX build
artefacts). Only the final PDF or a single self-contained HTML file belongs in a
public website repository.
