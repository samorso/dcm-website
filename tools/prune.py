#!/usr/bin/env python3
"""Remove unpublished session material from a staged copy of the site.

    python3 tools/prune.py _site

`course.json` lists the sessions whose material students may reach, in
`published`. The site already hides everything else, but hiding in the page is
not the same as withholding: without this step a student could still fetch
`content/lectures/<id>.md` or a slide PDF by typing its URL. This deletes those
files from the staged copy, so the unpublished ones are never uploaded.

It takes the directory to prune as an argument and touches nothing outside it,
so it is safe to run locally against a scratch copy. CI runs it on `_site/`
after staging; the repository keeps every file.
"""

from __future__ import annotations

import json
import pathlib
import sys


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__.strip())
        return 2

    site = pathlib.Path(argv[1]).resolve()
    if not (site / "course.json").is_file():
        print(f"ERROR: {site} does not look like a staged site (no course.json)")
        return 1

    course = json.loads((site / "course.json").read_text(encoding="utf-8"))
    published = set(course.get("published", []))
    schedule = course.get("schedule", [])

    # Files a published session needs — never delete one of these, even if an
    # unpublished session happens to reference the same file.
    keep: set[pathlib.Path] = set()
    for row in schedule:
        if row["id"] not in published:
            continue
        for ref in local_refs(row):
            keep.add((site / ref).resolve())

    removed: list[str] = []

    def drop(path: pathlib.Path, label: str) -> None:
        path = path.resolve()
        if site not in path.parents:          # never step outside the staged copy
            return
        if path in keep or not path.is_file():
            return
        path.unlink()
        removed.append(label)

    for row in schedule:
        if row["id"] in published:
            continue
        drop(site / "content" / "lectures" / f"{row['id']}.md",
             f"notes: {row['id']}")
        for ref in local_refs(row):
            drop(site / ref, f"file:  {ref}")

    # Instructor-only scaffolding (content/lectures/_*.md) is not student material.
    lectures = site / "content" / "lectures"
    if lectures.is_dir():
        for note in sorted(lectures.glob("_*.md")):
            drop(note, f"template: {note.name}")

    print(f"prune.py — published sessions: [{', '.join(sorted(published)) or 'none'}]")
    if removed:
        print(f"Withheld {len(removed)} file(s) from the published site:")
        for r in removed:
            print(f"  - {r}")
    else:
        print("Nothing to withhold.")
    return 0


def local_refs(row: dict) -> list[str]:
    """Repository-relative files a schedule row points at (not external URLs)."""
    refs = []
    if row.get("slides"):
        refs.append(row["slides"])
    for mat in row.get("materials", []):
        url = mat.get("url", "")
        if url and not url.startswith(("http://", "https://", "#", "mailto:")):
            refs.append(url)
    return refs


if __name__ == "__main__":
    sys.exit(main(sys.argv))
