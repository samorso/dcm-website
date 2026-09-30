## What we do

**First period — from a folder to a handover.** Why a result on your laptop is a
starting point rather than a finished piece of work. What another analyst
actually needs: which files are source, which are code and which are generated
output; why a raw dataset stays untouched; why a path needs a starting point; and
what a README has to answer. We also separate three words that get used
interchangeably — *reproduce*, *replicate*, *generalize*.

**Second period — a history someone else can understand.** Git not as a backup
system but as the place where you read a change before you accept it. Turning a
project folder into a repository, what belongs in it and what does not, and the
three inspections that answer three different questions: `git status`,
`git diff`, `git diff --staged`. We close by connecting that reviewed commit to
GitHub and to another analyst who clones and continues the work.

## Before class

**Download the [student pack](slides/practice/student-pack.zip) and extract it**
into a new personal folder — for example `Documents/dcm-week3`. Work in the
extracted folder, not inside the ZIP, and keep it outside any existing Git
repository. It contains `messy-project/` and `live-demo/`, neither of which
has any Git history.

Finish the [setup](#/setup) for VS Code and Git, **including your commit author
name and email**. That identity is not a GitHub login, and no GitHub account,
network connection or Python installation is needed for today's required task.

## Practice

Everything below is in the [practice guide](slides/practice/student-guide.html),
which also carries the full specimen contents in case you are working from a
browser or on paper.

**Activity 1 — diagnose the messy project (15 min).** `messy-project/` is a
deliberately broken handover. **Inspect it; do not run it.** Find at least four
reproducibility blockers, sketch a repaired folder tree, and write four short
README answers: purpose, data, run procedure, expected output. Then swap with a
partner — can they find the input and the entry point? The deliverable is a
diagnosis and a proposal, not repaired code.

**Activity 2 — one reviewed improvement (15 min).** This one uses the clean
`live-demo/`. Record the project as you received it, make one small edit,
and review it before you commit:

```bash
git init
git status
git add .
git diff --staged          # inspect before the baseline commit
git commit -m "Record starting project"
```

Then replace the arithmetic TODO under **Expected result** in the README with
your own explanation of the count, total and average — leaving the data and code
untouched — and review what you actually changed:

```bash
git status
git diff                   # additions *and* deletions
git add README.md
git diff --staged
git commit -m "Clarify expected output in README"
git log --oneline
```

<div class="key">
Check the claim, not just the diff. The four orders are 10.00, 15.00, 12.50 and
12.50 CHF — add them yourself, and confirm 50.00 / 4 = 12.50 before you write
that number into the README.
</div>

You should finish with a clean working tree and two commits: the baseline and
your reviewed change. Be ready to show a partner the changed line, your
independent check, and the commit message.

<div class="note">
Ordinary <code>git diff</code> does not show untracked files, which is why the
baseline commit comes first — it gives Git a before-version to compare against.
If Git opens a paged view, press <code>q</code>.
</div>

<div class="warn">
The required deliverable is a <strong>local reviewed commit</strong>. There is no
remote in today's task: no GitHub account, no push, no authentication. If Git is
blocked on your machine, pair with someone and be the reviewer — read the files,
dictate the change, interpret the real diff — then complete your own commit
afterwards.
</div>

## Before next week

Keep your diagnosis and your commits, and be ready to explain the source data,
the entry point, the expected output and one diff. On **8 October** we start code
literacy — reading the code you have just learned to hand over. You will not need
to implement the example in both R and Python.
