## What we do

**First period — putting a face on a pipeline you already trust.** The session
opens with real Streamlit applications, so you can see what the format is good
for before writing any of it. Then you wrap an interface around the frozen World
Bank report from the last three weeks. The calculation, the validation and the
data are supplied unchanged: the point is that the interface is the *last* layer
and the thinnest one. You observe how Streamlit reruns a script when a widget
changes, add a metric and a chart for the selected country, and decide where a
validation error belongs when a person — not a terminal — is watching.

**Second period — the group project starts.** Four people, a real user, a
reachable dataset and something small enough to finish. A guided scoping
workshop takes your group from a vague area of interest to a written first
scope, one independent check you could run against it, and a single GitHub issue
with a named lead and a named reviewer.

<div class="key">
A page that opens is not evidence that its numbers are right. The interface is
the easiest part to demonstrate and the easiest part to be fooled by.
</div>

## Before class

**Extract the [student pack](slides/lecture09/practice/student-pack.zip)** into
its own folder and open a terminal **inside** it, where `app.py` and
`requirements.txt` are visible.

**Install the dependencies now, not in the exercise.** Streamlit is a larger
download than anything earlier in the course, and installing it over the room's
wifi at 09:20 does not work.

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

Then confirm the starter app actually starts. Your browser should open at
`http://localhost:8501`; `Ctrl+C` in the terminal stops the server.

```bash
.venv/bin/python -m streamlit run app.py
```

<div class="note">
Windows PowerShell commands, both activities with their expected values, and the
handover checklist are in the
<a href="#/practice/applications">practice guide</a>. The pipeline, checks and
frozen data are the same files you already ran in Weeks 9 and 10.
</div>

<div class="warn">
The app reads a <strong>packaged snapshot</strong> of the World Bank response,
not a live API. Refreshing the browser does not fetch anything. If the install
fails, pair with someone whose app runs and take the reading role — do not
change your system's security policy or install into a global interpreter.
</div>

## Python only, again

As last week, there is no R route: Streamlit is a Python framework. The
underlying pipeline and its checks are the ones you already know, so if you have
been working in R, read `app.py` as the worked example of an interface rather
than translating it. The project in the second period is language-neutral —
nothing commits your group to Python.

## The project kickoff

The second period is a workshop, not a lecture. Each group works through a
one-page canvas: who needs this and what decision it supports, a data source you
can actually reach, the smallest useful interaction, how the work will run, one
independent check, and a first GitHub issue. You can read it in advance —
[project canvas](slides/lecture09/practice/project-canvas.pdf) — and the groups
that arrive with a candidate dataset in mind get the most out of the hour.

The canvas is **formative**. Nothing is collected or graded in this session, and
it does not replace the official project instructions, rubric or group sign-up.
Those are on [Moodle](https://moodle.unil.ch/course/view.php?id=38061); what
the project has to integrate is on the [project page](#/project).

## How the time is spent

| Slot | Work |
| --- | --- |
| 09:15–09:20 | Kahoot warm-up |
| 09:20–10:05 | What applications are for; run the starter; add a metric and a chart |
| 10:05–10:15 | Break |
| 10:15–11:00 | Project kickoff; guided scoping workshop; peer feedback |
