## What we do

**First period — which Python is actually running.** The same code and the same
frozen data can still produce a different result, because the environment that
executes them is a separate ingredient. What a virtual environment isolates, how
`requirements.txt` states the dependencies a project needs, and how to confirm
that the interpreter you think you are using is the one running your code. Then
the report runs for real, and the independent precision check stays in place: a
reproducible result is not automatically a correct one.

**Second period — packaging the runtime.** A Dockerfile, an image and a
container are three different things, and keeping them apart is most of the
difficulty. Reading a recipe rather than memorising commands: what gets copied
in, what the build context is, why a green build does not mean a green report.
You build, run and verify the supplied image, then repair a deliberately
defective recipe with one line — and ask an agent for a bounded packaging edit,
reviewed the way you reviewed code last week.

<div class="key">
"It worked on my laptop" is a claim about an environment, not about code.
Packaging turns that claim into something a colleague can check.
</div>

## Before class

This week needs real preparation, and it cannot be done in the first five
minutes of class. Allow **15–25 minutes**, and do it while you have internet.

**1 — Extract the [student pack](slides/lecture08/practice/student-pack.zip).**
It unpacks to a `student-pack` folder. Open a terminal **inside** it, where
`report.py` and `Dockerfile` are visible. Do not work inside the ZIP preview,
and keep the whole folder including `data` and `.dockerignore`.

**2 — Install Python 3.14** if you do not have it, from python.org.

**3 — Install Docker Desktop** for your platform from docs.docker.com, complete
the platform prerequisites, and restart if prompted. Start Docker and wait until
its engine is ready. This must show a Client **and** a Server:

```bash
docker version
```

**4 — Build the image once, now, while online.** A first build may take several
minutes; in class it is then cached.

```bash
docker build -t dcm-w10 .
docker run --rm dcm-w10
```

<div class="note">
The full preflight — both platforms, the virtual-environment commands, the
expected report values and what to do when something fails — is in the
<a href="#/practice/environments-docker">practice guide</a>. Work through it
before Thursday, not during.
</div>

<div class="warn">
Pulling the Python base image is <strong>not</strong> the same as building the
image: the build is what installs the dependencies. If Docker will not install
or start on your machine, arrange to pair with someone, or use the pack's
<code>supplied-output-analysis.md</code> — we will not troubleshoot individual
Docker installations during class time.
</div>

## Python only this week

Earlier weeks offered a Python route and an R route. This session is **Python
only**: virtual environments, `pip` and `requirements.txt` are specific to the
Python packaging ecosystem, and the Docker half applies to any language. If you
have been following the R route, the pack's report is the Week 9 pipeline in
Python — read it as the worked example rather than translating it.

## How the time is spent

| Slot | Work |
| --- | --- |
| 09:15–09:20 | Kahoot warm-up |
| 09:20–10:05 | Interpreters, virtual environments, requirements; install and run the report |
| 10:05–10:15 | Break |
| 10:15–11:00 | Dockerfile, image, container; build → run → verify; the one-line repair |

Four activities, each with a stated goal, where you work, the exact commands and
what the result should be. The three editable cells in the slides run **browser
Python**, not your local Python and not Docker.

## Before next week

**26 November** moves to applications and the project kickoff.
