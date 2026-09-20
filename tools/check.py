#!/usr/bin/env python3
"""Sanity-check the site's content before publishing.

Run it with `make check` (or `python3 tools/check.py`). It does not build
anything — it only reports problems a browser would show you later:

  * course.json is valid JSON and has the fields the site reads
  * every session id is unique and every date is real and in order
  * every referenced slide deck / material file actually exists
  * every content page the navigation points at exists
  * lecture notes exist for the sessions that claim a page (a warning only)
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
                "assessment", "groups", "schedule", "nav"):
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

        for field in ("slides",):
            if row.get(field) and not (ROOT / row[field]).exists():
                err(f"session {sid!r}: {field} file {row[field]!r} does not exist")

        for mat in row.get("materials", []):
            url = mat.get("url", "")
            if url and not url.startswith(("http://", "https://", "#", "mailto:")):
                if not (ROOT / url).exists():
                    err(f"session {sid!r}: material {url!r} does not exist")

        note = ROOT / "content" / "lectures" / f"{sid}.md"
        if row.get("page") and not note.exists():
            warn(f"session {sid!r} has no notes yet (content/lectures/{sid}.md)")

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
