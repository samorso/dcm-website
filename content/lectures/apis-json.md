## What we do

**First period — asking for data, and reading what comes back.** What a GET
request actually is, what the URL's parts mean, and where a dataset's definition,
source and units live. Then JSON: reading the response structure *before*
extracting from it, so you know what a field means rather than guessing from its
name. The first activity builds one row per country–year by hand.

**Second period — should we accept these data?** Deliberately damaged responses:
a missing value, a null that must not silently become zero, a wrong indicator, a
year the source does not have. Then the AI activity — a draft that runs but is
wrong, a bounded request to repair it, and independent checks you choose
yourself.

<div class="key">
A response that arrives is not a response you can use. Check the indicator, the
year, the units and the row count before the numbers reach your analysis — and
never let a null become a zero on the way.
</div>

## Before class

**Extract the [student pack](slides/lecture06/practice/student-pack.zip)** into a
new folder and open it in VS Code, using that folder as your terminal's working
directory.

Check **one** route:

```bash
python3 -c "import json, urllib.request, pandas; print('ready')"
```

```r
Rscript --vanilla -e 'library(jsonlite); cat("R ready\n")'
```

Python needs **pandas** (from Code Literacy I); everything else is standard
library. R needs **jsonlite** and base R. Install beforehand if needed —
`python3 -m pip install pandas`, or `install.packages("jsonlite")` at the R
prompt — in the same environment VS Code has selected, then re-run the check.

<div class="note">
Every task, the full data description and the worked answers are in the
<a href="#/practice/apis-json">practice guide</a>.
Installing needs internet; <strong>the lesson itself does not</strong> — the
starter loads a labelled offline snapshot of genuine captured responses, so the
activities work with no network at all. Live retrieval is optional and never
runs on its own.
</div>

## Working in a session

From the extracted folder:

```bash
python3 -i apis.py        # loads the offline snapshot
```

or in R, `R --vanilla` then `source("apis.R")`. The starter deliberately does
**not** run the unfinished extraction — that is your first task. Restart after
editing a Python file; re-source or restart R.

The pack is self-contained: starters with three TODO fields, supplied validation
helpers, a public checkpoint to pick up from if you get stuck, an intentionally
flawed AI draft, and independent checks you should leave unchanged. The captured
World Bank bodies in `data/raw/` are genuine and should not be edited; everything
in `data/constructed/` is a clearly labelled teaching modification, not a real
measurement.

<div class="warn">
Use <strong>one language</strong>. If your runtime is blocked, pair up: one
person predicts and reviews, the other runs. Keep a note of what you ran and
what you observed.
</div>

## Optional extension

An **OMDb documentation challenge** closes the guide — designing a request from
the real API documentation rather than from an AI's description of it. No account
is needed to design the request; a free key is only needed to execute one, and
the guide carries a documentation summary in case the site is unavailable. Never
put a real key in your code, a commit, or a prompt.

## Before next week

**12 November** moves into the engineering block: software engineering with AI —
structure, modules, documentation and tests.
