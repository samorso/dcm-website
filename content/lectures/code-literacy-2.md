## What we do

**First period — control flow and functions.** Conditions and the order branches
are tested in; the remainder operator and a single Boolean doing real work;
tracing a finite loop by hand before running it. Then FizzBuzz as a practice
round, and functions: arguments, scope, and what `return` actually gives back —
including a local name that quietly shadows one outside.

**Second period — when the inputs misbehave.** The assumptions a function makes
without saying so, the difference between an error and a warning, and a policy
decision about what a store average should do with an empty input. A short
debugging sequence, a guard you write by hand, then an AI-assisted modification
where you fix the contract and the acceptance cases **before** you ask — and
verify independently afterwards. We close on a METR study of AI-generated pull
requests.

<div class="key">
Predict, then trace, then run. And inspect a proposal before you accept it — a
change that passes the example you were given is not yet a change that is right.
</div>

## Before class

**Extract the [student pack](slides/lecture03/practice/student-pack.zip)** and
open the folder in VS Code. Nothing new to install: reuse your Week 4 setup.
The Python examples need only the standard library, the R examples only base R.

Four supplied files, two per language:

- `control-flow.py` / `control-flow.R` — the branch, finite-loop and FizzBuzz
  examples. **Read and predict each section before running it**; running the
  whole file prints all four at once.
- `functions.py` / `functions.R` — the supplied `f` and `my_div`. They define
  the functions without calling the deliberately failing examples. Save your
  edits here.

Work interactively from the extracted folder:

```bash
python3 -i functions.py     # then call the functions at the >>> prompt
```

After editing the file, `exit()` and run that command again to pick up the new
definitions. Use whichever launcher works for you (`python3`, `python`, `py`),
or the R route if that is your language.

<div class="note">
Everything for the session — both language routes, the traces, the checks and
the expandable worked answers — is in the
<a href="#/practice/code-literacy-2">practice guide</a>. Open an answer after
your attempt, not before.
</div>

<div class="warn">
Use <strong>one language</strong>. The deck has an “R alternative” toggle on its
code slides and the guide carries both, but you are not expected to implement
anything twice. If your runtime is blocked, pair up and take the reviewer role:
write the predictions, read the real output, record the checks.
</div>

## Before next week

**22 October is asynchronous** — *Responsible AI at UNIL*, with no class meeting
in the room. Then **29 October** starts the data block with SQL and relational
data.
