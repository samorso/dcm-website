---
title: AI & responsible use
eyebrow: AI throughout · not a fifth topic
lede: AI-assisted work is an explicit part of DCM. Assistance grows through the semester — and so does what you are expected to be able to explain, check and defend.
---

## The position of this course

AI assistance is **permitted and encouraged, according to the task**. The course
is built on the assumption that you will use it: to explain unfamiliar code, to
debug, to generate, to refactor, to write tests, to review changes and to build
small applications.

<div class="key">
Code production is increasingly AI-assisted. Responsibility is not. You remain
responsible for everything you submit.
</div>

## Four things that do not move

**You must be able to explain what you submit.** Not how you prompted for it —
what it does, why it is structured that way, and what would break it.

**Important outputs must be checked independently.** A program that runs is not
a program that is correct. Recompute a total by hand, compare against a known
value, test an edge case, or check a second source.

**Data confidentiality matters.** Do not upload confidential, personal or
otherwise sensitive data to arbitrary external services. Course examples use
synthetic or public data for exactly this reason.

**Assistance is disclosed as instructed.** Where an assignment asks how AI was
used, answer it honestly and specifically.

## How assistance grows

Assistance is staged on purpose: you build the literacy to supervise a tool
before you are asked to supervise it heavily.

| Phase | You use AI to | You are building |
| --- | --- | --- |
| **Early** | Explain and debug short code | The ability to predict what code does |
| **Progressively** | Generate and refactor bounded changes | The ability to specify and to read a diff |
| **Later** | Test, review and build | The ability to supervise larger work with evidence |

## The workflow, every time

The human loop does not disappear when a tool writes the code:

**Understand → Specify → Inspect → Modify → Run → Verify**

- **Understand** the problem and the data before asking for anything.
- **Specify** a bounded change: what may be touched, what must not.
- **Inspect** the plan and then the diff — read it, do not skim it.
- **Modify** what is wrong yourself rather than re-prompting blindly.
- **Run** it, including the checks.
- **Verify** independently: does the number survive a check you chose?

## 22 October — Responsible AI at UNIL

There is a dedicated **asynchronous session on 22 October** covering UNIL's own
guidance on AI use, including institutional resources such as **AI_GO**.

The material and instructions for that session are published on its
[session page](#/lecture/responsible-ai) and on Moodle. It complements this page;
where the two differ, UNIL's institutional guidance and the rules stated on
Moodle take precedence.

## A note on tools

The course does not require a paid AI subscription, an API key or billing
details. Where an agent or assistant is used in class, a manual route and a
Colab-based fallback are always provided, so a tool being unavailable never
blocks the actual learning objective.
