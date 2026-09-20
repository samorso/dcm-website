#!/usr/bin/env python3
"""Sanity-check the site's content before publishing.

Run it with `make check` (or `python3 tools/check.py`). It does not build
anything — it only reports problems a browser would show you later:

  * course.json is valid JSON and has the fields the site reads
  * every session id is unique and every date is real and in order
  * every referenced slide deck / material file actually exists
  * every content page the navigation points at exists
  * every id in `published` names a real session
  * lecture notes exist for the PUBLISHED sessions (a warning only)
  * a released session's files are not still held back by .gitignore, and an
    unreleased session's files are not sitting tracked in this public repo

It also prints which sessions are currently open to students, so a push never
publishes more (or less) than you meant. tools/prune.py enforces that list at
deploy time.
"""

from __future__ import annotations

import datetime as dt
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
errors: list[str] = []
warnings: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def main() -> int:
    try:
        course = json.loads((ROOT / "course.json").read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001 - report anything JSON throws
        print(f"course.json is not valid JSON: {exc}")
        return 1

    for key in ("course", "logistics", "instructor", "pillars", "ai",
                "assessment", "groups", "schedule", "nav", "published"):
        if key not in course:
            err(f"course.json is missing the top-level key {key!r}")
    if errors:
        report()
        return 1

    # --- navigation targets -------------------------------------------------
    for item in course["nav"]:
        route = item["route"]
        if route in ("", "schedule"):
            continue  # rendered from course.json, not from a Markdown file
        page = ROOT / "content" / f"{route}.md"
        if not page.exists():
            err(f"nav points at #/{route} but content/{route}.md does not exist")

    # --- groups -------------------------------------------------------------
    group_ids = {g["id"] for g in course["groups"]}
    pillar_ids = {p["id"] for p in course["pillars"]}

    # --- what students can reach --------------------------------------------
    published = set(course["published"])

    # --- schedule -----------------------------------------------------------
    seen: set[str] = set()
    previous: dt.date | None = None
    for row in course["schedule"]:
        sid = row["id"]
        if sid in seen:
            err(f"duplicate session id {sid!r}")
        seen.add(sid)

        try:
            date = dt.date.fromisoformat(row["date"])
        except ValueError:
            err(f"session {sid!r} has an invalid date {row['date']!r}")
            continue
        if previous and date <= previous:
            err(f"session {sid!r} ({row['date']}) is not after the previous one")
        previous = date

        if row["group"] not in group_ids:
            err(f"session {sid!r} uses unknown group {row['group']!r}")

        # A referenced file has to be present only once the session is
        # released. Before that its absence is the point: unreleased material is
        # kept out of this public repository, so requiring it here would fail
        # every CI run (and pass on the author's machine, where the file is
        # still on disk but untracked).
        if sid in published:
            if row.get("slides") and not (ROOT / row["slides"]).exists():
                err(f"published session {sid!r}: slides file "
                    f"{row['slides']!r} does not exist")

            for mat in row.get("materials", []):
                url = mat.get("url", "")
                if url and not url.startswith(("http://", "https://", "#", "mailto:")):
                    if not (ROOT / url).exists():
                        err(f"published session {sid!r}: material {url!r} "
                            f"does not exist")

        note = ROOT / "content" / "lectures" / f"{sid}.md"
        if row.get("page") and sid in published and not note.exists():
            warn(f"published session {sid!r} has no notes "
                 f"(content/lectures/{sid}.md)")

    unknown = published - seen
    if unknown:
        err(f"`published` names sessions that do not exist: {sorted(unknown)}")

    # --- assessment ---------------------------------------------------------
    total = sum(a["weight"] for a in course["assessment"])
    if total != 100:
        err(f"assessment weights add up to {total}%, not 100%")
    for a in course["assessment"]:
        for c in a["covers"]:
            if c not in pillar_ids:
                err(f"assessment {a['id']!r} covers unknown pillar {c!r}")

    # --- outcomes -----------------------------------------------------------
    for o in course.get("outcomes", []):
        if o["pillar"] not in pillar_ids:
            err(f"outcome {o['title']!r} names unknown pillar {o['pillar']!r}")

    # --- orphaned content ---------------------------------------------------
    for note in sorted((ROOT / "content" / "lectures").glob("*.md")):
        if note.stem.startswith("_"):
            continue
        if note.stem not in seen:
            warn(f"content/lectures/{note.name} has no matching session in course.json")

    # --- release consistency ------------------------------------------------
    # Opening a session takes two edits — drop its .gitignore lines and add its
    # id to `published`. Doing only one is the easy mistake, so name it here.
    ignored = set()
    gitignore = ROOT / ".gitignore"
    if gitignore.exists():
        for line in gitignore.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and not line.startswith("!"):
                ignored.add(line.lstrip("/").rstrip("/"))

    for row in course["schedule"]:
        sid = row["id"]
        paths = [f"content/lectures/{sid}.md"]
        if row.get("slides"):
            paths.append(row["slides"])
        for mat in row.get("materials", []):
            url = mat.get("url", "")
            if url and not url.startswith(("http://", "https://", "#", "mailto:")):
                paths.append(url)

        for rel in paths:
            held = rel in ignored
            exists = (ROOT / rel).exists()
            if sid in published and held:
                err(f"session {sid!r} is published but {rel} is still in "
                    f".gitignore — it will never reach the site")
            if sid not in published and exists and not held:
                warn(f"session {sid!r} is not published, but {rel} is tracked "
                     f"here — readable in this public repository")

    open_now = [r["title"] for r in course["schedule"] if r["id"] in published]
    print("Open to students: " + (", ".join(open_now) or "nothing"))
    print(f"Withheld by tools/prune.py at deploy time: "
          f"{len([r for r in course['schedule'] if r['id'] not in published])} session(s)")

    report()
    return 1 if errors else 0


def report() -> None:
    for w in warnings:
        print(f"note:  {w}")
    for e in errors:
        print(f"ERROR: {e}")
    if not errors:
        print(f"OK — {len(warnings)} note(s), no errors.")


if __name__ == "__main__":
    sys.exit(main())
