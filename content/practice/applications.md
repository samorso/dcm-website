# Week 11 student guide
HEC Lausanne | Data and Code Management | 26 November 2026

## Goal
Turn the frozen World Bank report from Weeks 8-10 into a small, locally running Streamlit application. The calculation, validation, and source files are supplied unchanged. We will add an interface around them.

Before class, install Streamlit in a project virtual environment. Do not wait until the exercise to download packages.

## Preparation: macOS and Linux

~~~bash
python3 --version
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m streamlit run app.py
~~~

## Preparation: Windows PowerShell

~~~powershell
py -3.14 --version
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m streamlit run app.py
~~~

Run the commands from the extracted student-pack folder. The browser normally opens at http://localhost:8501. Stop the server with Ctrl+C in the terminal. These commands explicitly select the environment's Python; PowerShell activation is optional. Python 3.14 is the class target; use an instructor-approved supported Python if you cannot install it.

If the install fails, pair with someone whose app runs. Read the provided code and answer the exercises on paper. Do not change system security policy or install to a global interpreter.

## Activity A (6 minutes): observe the rerun

1. Launch `app.py` and choose Switzerland, then Germany.
2. Notice which value changes and which table stays the same.
3. In `app.py` find the calls that load and validate data. Which module calculates growth?
4. Predict whether refreshing the browser will fetch World Bank data again.

Expected: the country label changes; the full comparison still shows CHE, DEU, FRA. The source is the packaged JSON file, not a live API request. Streamlit reruns the script after the country selection changes.

## Activity B (9 minutes): add two useful outputs

Continue in `app.py`, below the existing code.

- Select the row in `growth` matching the chosen country code.
- Show the 2024 population with `st.metric`, formatting persons with grouping separators.
- Put growth percentage in the metric's delta, displaying exactly three decimal places. Keep full precision in `growth`.
- Draw a 2023/2024 bar chart from `table` for the selected country. Label population units.

Useful expressions:

~~~python
selected = growth.loc[growth.country_code == code].iloc[0]
f"{selected.population_2024:,.0f}"
f"{selected.growth_pct:.3f}%"
table.loc[table.country_code == code, ["year", "population"]]
~~~

Do not recompute growth in the interface. The existing `compare()` already owns that calculation.

Expected for Switzerland: 2024 population 9,005,582 persons; absolute increase 116,760; growth 1.314% displayed (unrounded calculation retained). Germany and France should change the metric and chart.

## Activity C (discussion): where does an error belong?

The file `data/constructed/null-value.json` deliberately has an unavailable population. What should happen if someone builds an app with it? Predict the result before running:

~~~bash
python -c "from validation import load; from pipeline import extract, compare; print(compare(extract(load('constructed/null-value.json'))))"
~~~

The contract rejects incomplete growth comparison with a useful error. In a Streamlit app, catch that validation error, use `st.error(...)` and stop the app. Never silently replace missing population by zero.

## Check the calculation separately

~~~bash
python checks.py pipeline.py
python my-check.py pipeline.py
~~~

Use the environment Python path from the preparation instructions in place of `python` if needed. The first command should report 14/14. The second should print PRECISION PASS. A Streamlit page that opens is not evidence that its calculations are correct.

## What belongs in a handover?

- `app.py` for the interface; `pipeline.py` and `validation.py` for the existing behavior.
- `requirements.txt` and a clear Python version for the environment.
- Packaged data and its `data/provenance.json`. Never claim a live API was used.
- A README with the exact command to launch the app, plus the independent checks.
- A statement of what is optional: deployment, caching and styling do not replace tests.

## References
Streamlit installation: https://docs.streamlit.io/get-started/installation/command-line
Streamlit app reruns: https://docs.streamlit.io/get-started/fundamentals/main-concepts
Streamlit caching: https://docs.streamlit.io/develop/api-reference/caching-and-state/st.cache_data
