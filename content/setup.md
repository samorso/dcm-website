---
title: Setup & resources
eyebrow: Before Week 3 · 1 October
lede: Prepare VS Code and Git before 1 October, then run the checks. Allow about half an hour. The general course tools and resources are below.
---

## Before Week 3 — 1 October

For the local Git practice, you need **VS Code, Git and the VS Code terminal**.
Follow the instructions for your operating system, then run the checks below.
No previous terminal experience is needed: type or paste one command at a time
and press **Enter**.

### 1. Install Visual Studio Code

Download [Visual Studio Code](https://code.visualstudio.com/download).

- **Windows:** choose the normal Windows **User Installer**, run it and keep
  the default installation options.
- **macOS:** download the Mac version, open the `.dmg`, and drag **Visual Studio
  Code** into **Applications**. Open it from there.

No extra extensions are needed for Week 3. Open the supplied project with
**File → Open Folder**, then open a file to check that you can view and save it.

### 2. Install Git

**Installing VS Code does NOT install Git.** Git is a separate program; VS Code
uses it to work with your project's version history.

#### Windows

Download and run the installer from the official
[Git for Windows installation page](https://git-scm.com/install/windows).
The **default installer choices are appropriate for this course**.
After installation, **close and reopen VS Code**.

#### macOS

First open **Terminal** (or **Terminal → New Terminal** in VS Code) and run:

```bash
git --version
```

If a version appears, Git is already available. Otherwise, macOS may offer to
install the **Apple Command Line Tools**; accept and let installation finish.
You can also request that installer explicitly:

```bash
xcode-select --install
```

Then run `git --version` again. See the official
[Git macOS installation page](https://git-scm.com/install/mac).

### 3. Check Git inside VS Code

In VS Code, select **Terminal → New Terminal**. In the panel that opens, run:

```bash
git --version
```

You should see a version similar to `git version 2.x.x` (the numbers may differ).
**If this works in the VS Code terminal, you are ready for the Git part of
Week 3.** Set your commit authorship below before class too.

On Windows, if Git is “not recognized”, first **close and reopen VS Code after
installing Git**, open a new terminal and try again.

### 4. Set your Git authorship once

In the same terminal, replace the examples with your name and email, keeping the
quotation marks:

```bash
git config --global user.name "First Last"
git config --global user.email "your.email@example.com"
```

Git records this information as the **author of your commits**. This is **not
your GitHub username or password**; a university email address is fine.
`--global` makes these the defaults for your user account on this computer.

Check that the values are yours:

```bash
git config --global user.name
git config --global user.email
```

### 5. GitHub is a separate account

**Git** records version history on your computer. **GitHub** hosts repositories
for sharing and collaboration. For later course use, create a
[GitHub account](https://github.com/) if needed, sign in and open your profile.

The Week 3 local Git practice needs no GitHub sign-in. Do not create a repository,
set up SSH keys, install GitHub CLI or configure tokens/authentication for it.

### Before Week 3: final check

- ✓ VS Code opens.
- ✓ `git --version` works in the VS Code terminal.
- ✓ Git `user.name` shows your name.
- ✓ Git `user.email` shows your email address.

## General course setup — Python, R and Colab

Keep these existing tools ready for the course's programming activities. The
Week 3 README/Git practice does **not** require additional Python setup or
running the instructor's Python demo yourself.

Open a terminal (**Terminal → New Terminal** in VS Code) and run each check.
In later instructions, replace `python` with whichever launcher works on your
machine.

| Install | Check | Expected |
| --- | --- | --- |
| [Python 3](https://www.python.org/downloads/) | `python3 --version` (macOS/Linux) or `py --version` (Windows), then the same launcher with `-c "print(2 + 2)"` | A Python **3** version and `4`. Use that launcher from then on. |
| [R](https://cran.r-project.org/) *(recommended)* | `R --version` | A version number. R is fully supported and is often the better choice for projects. |
| [Google Colab](https://colab.research.google.com/) | Sign in and open a blank notebook. | A notebook runs. This is the fallback when a local install is blocked. |

<div class="note">
The Python starter exercise needs only the standard library. No packages, API
keys or paid service are required to get started, and
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
your operating system — without any credentials — then use the activity fallback.
**For Week 3, pair with someone whose Git setup
works:** inspect the files and diffs together, then finish your own local setup
after class. For notebook activities, switch to the supplied Colab notebook.
Fix the local setup after class, or bring it to office hours.

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
