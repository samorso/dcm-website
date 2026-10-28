## What we do

**First period — asking one table a question.** What a row actually means: the
grain of a table, and the key that identifies it. Then `SELECT`, `WHERE`,
ordering and limiting against a supplied synthetic database, with a prediction
before each query. Aggregation and `GROUP BY` close the period — counting and
averaging over groups rather than rows, and noticing when the answer counts
something other than what you meant.

**Second period — joining, and checking what the join did.** `INNER` and `LEFT`
joins, and the rows that quietly disappear when the match fails. Counting before
and after as a check rather than a formality. We finish by specifying a query for
an AI assistant, critiquing what comes back, repairing it and verifying the
result independently.

<div class="key">
A query that runs is not a query that answers your question. Check the row count,
check the grain, and check one value by hand before you believe the table.
</div>

## Before class

**Extract the [student pack](slides/lecture05/practice/student-pack.zip)** into a
folder and open it in your editor. It supplies the complete synthetic database in
both languages — `sql.py`, `sql.R` and `queries.sql`. You need **no database
server, cloud account or internet connection** during the exercises.

Check **one** route before class:

```bash
# Python: sqlite3 is standard library; pandas comes from Week 4
python3 -c "import sqlite3, pandas; print(sqlite3.sqlite_version)"
```

```r
# R: DBI and RSQLite
library(DBI)
library(RSQLite)
```

If something is missing, resolve it beforehand — the activity time is not for
installing packages.

## Working in a session

From the extracted folder:

```bash
python3 -i sql.py        # expect: n_customers = 6
```

Put one SQL statement in a Python string and print the result:

```python
q = """
SELECT name, country FROM customers
WHERE country = 'CH'
ORDER BY name ASC LIMIT 3;
"""
print(pd.read_sql_query(q, con).to_string(index=False))
```

`queries.sql` is your record of the work: copy one statement at a time into `q`.
Do not run that file as a script or hand all its statements to `read_sql_query`
at once. The R route works the same way through DBI.

<div class="note">
The full data, every task, the checks and the worked answers are in the
<a href="#/practice/sql">practice guide</a> — including the complete contents of
both tables, so you can reason about a query without running it.
</div>

<div class="warn">
Use <strong>one language</strong>. If your runtime is blocked, pair up and take
the reviewer role: predict the result, inspect the real output, record the check.
</div>

## Before next week

**5 November** continues the data block with APIs, JSON and web data — getting
data from somewhere that was not handed to you.
