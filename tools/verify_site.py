#!/usr/bin/env python3
"""Check the STAGED site, after staging and pruning, not the repository.

tools/check.py validates the repository: every file a published session needs
is on disk. That is not the same question as whether the file survived the
deploy. Two steps remove files on the way to GitHub Pages — the rsync excludes
in .github/workflows and tools/prune.py — and the local preview server sees
neither, so a file can work locally and 404 for students.

That happened once: the workflow's bare 'README.md' exclude was meant for
slides/README.md (instructor notes) but matches at every level, so a student
practice guide's data/README.md was silently dropped from the published site.

Run after prune.py:   python3 tools/verify_site.py _site
"""

from __future__ import annotations

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def main(argv: list[str]) -> int:
    site = pathlib.Path(argv[1] if len(argv) > 1 else "_site").resolve()
    if not site.is_dir():
        print(f"verify_site: {site} is not a directory", file=sys.stderr)
        return 2

    course = json.loads((ROOT / "course.json").read_text(encoding="utf-8"))
    published = set(course["published"])
    missing: list[str] = []
    checked = 0

    def need(rel: str, why: str) -> None:
        nonlocal checked
        checked += 1
        if not (site / rel).exists():
            missing.append(f"{rel}  ({why})")

    for row in course["schedule"]:
        sid = row.get("id")
        if sid not in published:
            continue
        if row.get("page"):
            need(f"content/lectures/{sid}.md", f"session notes for {sid!r}")
        if row.get("slides"):
            need(row["slides"], f"slides for {sid!r}")
        for mat in row.get("materials", []):
            url = mat.get("url", "")
            if url and not url.startswith(("http://", "https://", "mailto:")):
                need(url, f"material of {sid!r}: {mat.get('label', url)!r}")

        guide_id = row.get("practiceGuide")
        if not guide_id:
            continue
        rel_guide = f"content/practice/{guide_id}.md"
        need(rel_guide, f"practice guide for {sid!r}")

        # Every relative link inside the guide, rebased the way app.js does.
        src = ROOT / rel_guide
        if not src.exists():
            continue
        text = src.read_text(encoding="utf-8")
        base = row.get("practiceBase", "")
        links = re.findall(r"\]\(([^)\s]+)\)", text) + re.findall(r'href="([^"]+)"', text)
        for href in sorted({h for h in links
                            if not h.startswith(("http://", "https://", "#", "mailto:", "/"))}):
            need(base + href, f"linked from the {sid!r} practice guide")

    if missing:
        print(f"verify_site: {len(missing)} file(s) a published session needs "
              f"are NOT in {site.name}/:", file=sys.stderr)
        for m in missing:
            print(f"  - {m}", file=sys.stderr)
        print("\nThey exist in the repository, so something removed them while "
              "staging: an rsync --exclude pattern or tools/prune.py.",
              file=sys.stderr)
        return 1

    print(f"verify_site: OK — {checked} published file(s) present in {site.name}/.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
