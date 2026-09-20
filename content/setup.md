---
title: Setup & resources
eyebrow: Before the first class
lede: A short list of things to install and — more importantly — to check. Budget about half an hour. There is a strict 15-minute setup cap in class, so arriving with working tools protects your own practice time.
---

## Before 24 September

Install each item, then **run its check** and confirm you get the expected
result. Installing without checking is the usual reason a setup fails in class.

Open a terminal (in VS Code: **Terminal → New Terminal**) and type one command at
a time. In every later instruction, replace `python` with whichever launcher
works on your machine.

| Install | Check | Expected |
| --- | --- | --- |
| [VS Code](https://code.visualstudio.com/download) | Open the supplied project folder; open a file and the integrated terminal. | You can see and save files, and the terminal is in the project folder. No advanced configuration needed. |
| [Git](https://git-scm.com/downloads) | `git --version` | A version number, not “command not found”. |
| [GitHub account](https://github.com/) | Sign in; open your profile. | You know your username and can reach the course material. |
| [Python 3](https://www.python.org/downloads/) | `python3 --version` (macOS/Linux) or `py --version` (Windows), then the same launcher with `-c "print(2 + 2)"` | A Python **3** version and `4`. Use that launcher from then on. |
| [R](https://cran.r-project.org/) *(recommended)* | `R --version` | A version number. R is fully supported and is often the better choice for projects. |
| [Google Colab](https://colab.research.google.com/) | Sign in and open a blank notebook. | A notebook runs. This is the fallback when a local install is blocked. |

<div class="note">
The starter exercise needs only the Python standard library. No packages, API
keys, Docker or paid service are required to be ready for the first class, and
<strong>Docker is not needed until November</strong>.
</div>

## An AI coding agent

Part of the course is working with a coding agent in a real project folder. The
specific tool is announced before the session it is first used in, together with
its **official** installation and sign-in instructions — tools in this space
change quickly, so this page links to the vendor's own current documentation
instead of reproducing install commands that go stale.

Whatever the tool:

- use a **free or individual** route where you are eligible;
- **do not** add billing details, buy credits or configure a paid API key for
  this course;
- start the agent **inside the project folder**, not in your home directory;
- a useful first prompt is a read-only one:

```text
Inspect this project. Do not modify anything yet.
Explain its structure, what it does, and how to run it.
```

Then check its explanation against the files yourself. That check *is* the
exercise.

<div class="warn">
If sign-in, eligibility or a usage limit blocks you, use the Colab fallback for
the session and tell the instructor afterwards. A tool being unavailable never
means skipping the learning objective.
</div>

## If setup fails in class

Stop after the 15-minute setup window. Record the command, the error message and
your operating system — without any credentials — then switch to the supplied
Colab notebook and carry on. Fix the local setup after class, or bring it to
office hours.

## Operating systems and laptops

macOS, Windows and Linux are all supported. Bring a laptop if you can; we work
collaboratively, and roughly one laptop per two students is workable. You do not
need to buy a new machine — sharing is fine. Swiss university students can get
preferential pricing through [Projekt Neptun](https://www.projektneptun.ch/) or
[EPFL's Poseidon](https://poseidon.epfl.ch/).

## Resources

No single textbook is required. Everything below is freely available online.

### Python

- [Python documentation](https://docs.python.org/3/) — the language reference and tutorial.
- [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/) — NumPy, pandas, matplotlib, scikit-learn.
- [pandas documentation](https://pandas.pydata.org/docs/) — data wrangling.
- [Real Python](https://realpython.com/) — practical tutorials and idiom.

### R

- [R for Data Science](https://r4ds.hadley.nz/) — the standard starting point.
- [Advanced R](https://adv-r.hadley.nz/) — how the language actually works.
- [R Packages](https://r-pkgs.org/) — structure, documentation and tests.
- [Posit cheat sheets](https://posit.co/resources/cheatsheets/) — quick reference.

### Git, GitHub and reproducibility

- [Happy Git and GitHub for the useR](https://happygitwithr.com/) — the friendliest route in.
- [Pro Git](https://git-scm.com/book/en/v2) — the complete reference.
- [The Turing Way](https://the-turing-way.netlify.app/) — reproducible research practice.
- [Quarto](https://quarto.org/) — literate documents across Python and R.

### SQL and data

- [SQLBolt](https://sqlbolt.com/) — hands-on SQL from scratch.
- [Mode SQL tutorial](https://mode.com/sql-tutorial/) — beginner to window functions.
- [SQLite documentation](https://www.sqlite.org/docs.html) — the database we can all run locally.
- [PostgreSQL documentation](https://www.postgresql.org/docs/) — the reference server.

### Testing, environments and delivery

- [pytest](https://docs.pytest.org/) · [testthat](https://testthat.r-lib.org/) — tests in Python and R.
- [Docker get started](https://docs.docker.com/get-started/) — reproducible environments.
- [Streamlit](https://docs.streamlit.io/) · [Shiny](https://shiny.posit.co/) — small data applications.

### AI at UNIL

- Institutional guidance, including **AI_GO**, is covered in the
  [22 October session](#/lecture/responsible-ai).
