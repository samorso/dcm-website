## What we do

**First period — the agreement a piece of code makes.** What a function promises
about its inputs, its output and its failure modes, and why that contract is the
thing you actually review. Splitting a script into functions and modules that can
be read and changed independently, and documentation that does a job rather than
restating the code. A short manual task: return the calculation instead of
printing it.

**Second period — tests first, then the agent.** Choosing expectations *before*
writing code, so a test says what should be true rather than echoing what the
code happens to do. Then the AI-assisted activity: a bounded request against a
contract you fixed in advance, a review of what comes back, and a decision —
accept, repair or reject — supported by the tests you already wrote.

<div class="key">
Decide what must be true before you ask for the code. A test written afterwards
tends to agree with whatever you were given.
</div>

## Before class

**Extract the [student pack](slides/lecture07/practice/student-pack.zip)** into a
new folder and open **that folder** in VS Code. Run everything from there.

Check **one** route:

```bash
python3 -c "import pandas; print('Python ready')"
```

```bash
Rscript --vanilla -e 'library(jsonlite); cat("R ready\n")'
```

Nothing new to install: Python needs **pandas** and R needs **jsonlite**, both
already in use from earlier weeks. Quarto and Pandoc are authoring tools, not
student dependencies. Substitute `python`/`py` consistently if that is your
launcher — after checking pandas is installed in *that* interpreter.

<div class="note">
Everything for the session — the file map, the contract, both language routes,
the test-design task and the worked answers — is in the
<a href="#/practice/software-engineering">practice guide</a>. Have your
<code>manual</code>, <code>pipeline</code> and <code>my-check</code> files open
when class starts.
</div>

<div class="warn">
Use <strong>one language</strong>, not both. The pack is self-contained: no API
key, GitHub account or paid AI subscription is needed, and a public checkpoint
lets you continue even if an earlier activity is unfinished. If your runtime is
blocked, pair up and take the reviewer role.
</div>

## How the time is spent

| Slot | Work |
| --- | --- |
| 09:15–09:20 | Kahoot warm-up |
| 09:20–10:05 | Contracts, functions and modules, documentation; manual task |
| 10:05–10:15 | Break |
| 10:15–11:00 | Test design; the AI/partner task; handover and questions |

Each block keeps five recovery minutes, so an activity that runs long does not
eat the next one.

## Before next week

**19 November** starts the production block: environments and Docker — making
the thing run somewhere that is not your laptop.
