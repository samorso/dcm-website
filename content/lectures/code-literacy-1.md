## What we do

**First period — reading the objects.** Assignment and simple summaries, the
difference between a sequence and a table, inspecting what you actually have,
and what happens when types are mixed and silently coerced. Then selecting rows
and columns four ways — by position, by label, by column and by condition — on
one small five-player table we keep all day. Short prediction rounds throughout:
**write down what you expect before you run it.**

**Second period — changing it and checking the change.** A supplied birth-date →
age transformation, then the tennis task: select, modify, sort and verify while
keeping each player attached to their own values. We look at a sort that quietly
breaks that association, at how missing values change a mean depending on the
denominator you chose without noticing, and we finish with an AI code-reading
activity: predict, ask for an explanation, compare, then verify independently.

<div class="key">
Predict → run → compare. A prediction you wrote down and got wrong teaches you
more than output you simply accepted.
</div>

## Before class

**Extract the [student pack](slides/lecture02/practice/student-pack.zip)** into
your own folder and open it in VS Code. It contains the same fixture in two
languages — `tennis.py` and `tennis.R`.

**Use one language.** Python is the live route; R is fully supported and the
guide gives the R alternative for every task. You are **not** expected to do
both.

Check your route works *before* class — the exercise time is not for installing
things:

```bash
# Python: needs NumPy and pandas
python3 -c "import numpy, pandas; print(numpy.__version__, pandas.__version__)"

# R: base R is enough
R --version
```

Use whichever launcher works on your machine (`python3`, `python` or `py`). If
an import fails, sort it out beforehand and bring the exact command and error.
No plotting package, tidyverse, reticulate or Quarto is needed.

## Working in a fresh session

From the extracted folder:

```bash
python3 -i tennis.py     # gives you a >>> prompt with `tennis` and `pd` ready
```

or in R, from the same folder:

```r
source("tennis.R")       # gives you `tennis`
```

Re-run either command for a clean start. Keep the starter file as supplied and
put anything you want to save in a separate practice file.

<div class="note">
Everything for the session — snippets, both language routes, the checks and the
worked answers after each task — is in the
<a href="#/practice/code-literacy-1">practice guide</a>.
Answers come after the prediction, not before.
</div>

<div class="warn">
If you cannot run code locally, pair with someone who can and be the reviewer:
write the predictions, explain the code, inspect the real output. Complete your
own run afterwards — and do not claim you ran code you only read.
</div>

## Before next week

Keep your predictions and the checks you chose. **15 October** is Code literacy
II: control flow, functions, input checks, and debugging code you did not write.
