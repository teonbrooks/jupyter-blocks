# TidyBlocks Feature Extraction

## Source Project

**Repository:** https://github.com/gvwilson/tidyblocks (archived August 2024)
**Author:** Greg Wilson
**Concept:** A visual, block-based tidy-data analysis environment built on Google Blockly with a pipeline execution model, internationalization support (8 languages), and integrated plotting and statistics.

This document catalogs every feature from the original `gvwilson/tidyblocks` project and specifies which features will be ported to `jupyter-tidyblocks`, how they will be adapted for the Jupyter/Python context, and what new capabilities will be added.

---

## Execution Model

### Original
Blocks form **pipelines** — linear chains starting from a data source and flowing through transforms into outputs (plots/stats/saves). Each block emits a JSON representation; a `Pipeline` runner executes the JSON sequence against an immutable `DataFrame` object. Multiple independent pipelines can exist in one workspace.

### jupyter-tidyblocks adaptation
- Each pipeline maps to one **Jupyter cell** — the block chain generates a self-contained Python code string that executes against the active kernel.
- `saveAs` blocks persist DataFrames as named Python variables, enabling cross-cell/cross-pipeline data sharing (natural Jupyter workflow).
- The generated Python code targets **pandas** for data operations and **plotly** (or **matplotlib** / **altair** — TBD) for plots.
- Statistics blocks generate **scipy.stats** calls.

---

## Feature Inventory

### Category 1: Data Source Blocks

| Block | Original behavior | Port status | jupyter-tidyblocks implementation |
|---|---|---|---|
| `data_colors` | Built-in 11-color RGB dataset | **Port** | `pd.DataFrame` literal inline |
| `data_earthquakes` | 2016 earthquake dataset | **Port** | Load from bundled CSV / URL |
| `data_penguins` | Palmer penguins dataset | **Port** | Load via `seaborn.load_dataset('penguins')` or bundled |
| `data_phish` | Phish concert dataset | **Defer** | Domain-specific; low priority |
| `data_spotify` | Spotify song data | **Defer** | Licensing unclear; low priority |
| `data_sequence` | Generate 1..N sequence into named column | **Port** | `pd.DataFrame({col: range(1, n+1)})` |
| `data_user` | Reference user-defined dataset by name | **Port** | Reference a named Python variable |
| *(new)* `data_csv` | — | **Add** | `pd.read_csv(filepath_or_url)` |
| *(new)* `data_json` | — | **Add** | `pd.read_json(filepath_or_url)` |
| *(new)* `data_clipboard` | — | **Add** | `pd.read_clipboard()` |

---

### Category 2: Transform Blocks

These are the core of the tidy-data paradigm and map cleanly to **pandas** operations.

| Block | Original behavior | Port status | pandas equivalent |
|---|---|---|---|
| `transform_filter` | Keep rows matching boolean expression | **Port** | `df.query(expr)` / `df[mask]` |
| `transform_select` | Keep specified columns | **Port** | `df[columns]` |
| `transform_drop` | Remove specified columns | **Port** | `df.drop(columns=...)` |
| `transform_create` | Add / replace column with expression | **Port** | `df.assign(col=expr)` |
| `transform_sort` | Sort by columns; optional descending | **Port** | `df.sort_values(by=..., ascending=...)` |
| `transform_unique` | Deduplicate by columns | **Port** | `df.drop_duplicates(subset=...)` |
| `transform_groupBy` | Group rows for subsequent aggregation | **Port** | `df.groupby(columns)` |
| `transform_ungroup` | Remove grouping | **Port** | `.reset_index()` / drop groupby context |
| `transform_summarize` | Aggregate with a summary function | **Port** | `.agg({col: func})` |
| `transform_running` | Cumulative/window operation | **Port** | `.cumsum()`, `.cummax()`, `.expanding()` |
| `transform_bin` | Discretize numeric column into N buckets | **Port** | `pd.cut(col, bins=n, labels=...)` |
| `transform_saveAs` | Persist DataFrame under a name | **Port** | Assign to a named Python variable |
| *(new)* `transform_rename` | Rename columns | **Add** | `df.rename(columns={...})` |
| *(new)* `transform_pivot` | Pivot long→wide | **Add** | `df.pivot_table(...)` |
| *(new)* `transform_melt` | Pivot wide→long | **Add** | `pd.melt(df, ...)` |
| *(new)* `transform_fillna` | Fill missing values | **Add** | `df.fillna(value)` |
| *(new)* `transform_dropna` | Drop rows with missing values | **Add** | `df.dropna(subset=...)` |
| *(new)* `transform_sample` | Random sample N rows or fraction | **Add** | `df.sample(n=..., frac=...)` |
| *(new)* `transform_head` / `transform_tail` | First/last N rows | **Add** | `df.head(n)` / `df.tail(n)` |

**Summarize functions to port:** `all`, `any`, `count`, `max`, `mean`, `median`, `min`, `std`, `sum`, `var`

**Running (cumulative) functions to port:** `cumall`, `cumany`, `cumcount`, `cummax`, `cummean`, `cummin`, `cumsum`

---

### Category 3: Combine Blocks

| Block | Original behavior | Port status | pandas equivalent |
|---|---|---|---|
| `combine_join` | Inner join on matching column values | **Port** | `pd.merge(left, right, left_on=..., right_on=...)` |
| `combine_glue` | Vertical stack with source label column | **Port** | `pd.concat([df1, df2], keys=[...])` |
| *(new)* `combine_left_join` | Left join | **Add** | `pd.merge(..., how='left')` |
| *(new)* `combine_outer_join` | Full outer join | **Add** | `pd.merge(..., how='outer')` |
| *(new)* `combine_cross_join` | Cross / cartesian product | **Add** | `df1.merge(df2, how='cross')` |

---

### Category 4: Plot Blocks

Original plots used a custom JS plotting library. jupyter-tidyblocks generates **plotly.express** (or **altair** — TBD) calls.

| Block | Original behavior | Port status | plotly.express equivalent |
|---|---|---|---|
| `plot_bar` | Bar chart (x, y) | **Port** | `px.bar(df, x=..., y=...)` |
| `plot_box` | Box plot (x, y) | **Port** | `px.box(df, x=..., y=...)` |
| `plot_dot` | Dot/strip plot (x only) | **Port** | `px.strip(df, x=...)` |
| `plot_histogram` | Histogram (column, nbins) | **Port** | `px.histogram(df, x=..., nbins=...)` |
| `plot_scatter` | Scatter (x, y, color, regression toggle) | **Port** | `px.scatter(df, x=..., y=..., color=..., trendline='ols')` |
| *(new)* `plot_line` | Line chart (x, y, color) | **Add** | `px.line(df, x=..., y=..., color=...)` |
| *(new)* `plot_heatmap` | Correlation heatmap | **Add** | `px.imshow(df.corr())` |
| *(new)* `plot_violin` | Violin plot | **Add** | `px.violin(df, x=..., y=...)` |

---

### Category 5: Statistics Blocks

| Block | Original behavior | Port status | scipy/sklearn equivalent |
|---|---|---|---|
| `stats_ttest_one` | One-sample two-sided t-test | **Port** | `scipy.stats.ttest_1samp(col, popmean)` |
| `stats_ttest_two` | Two-sample two-sided t-test | **Port** | `scipy.stats.ttest_ind(group1, group2)` |
| `stats_k_means` | K-means clustering | **Port** | `sklearn.cluster.KMeans(n_clusters=k).fit(X)` |
| `stats_silhouette` | Silhouette coefficient for cluster quality | **Port** | `sklearn.metrics.silhouette_score(X, labels)` |
| *(new)* `stats_anova` | One-way ANOVA | **Add** | `scipy.stats.f_oneway(*groups)` |
| *(new)* `stats_correlation` | Pearson/Spearman correlation | **Add** | `df[cols].corr(method=...)` |
| *(new)* `stats_describe` | Descriptive statistics summary | **Add** | `df.describe()` |
| *(new)* `stats_linear_regression` | Simple linear regression | **Add** | `sklearn.linear_model.LinearRegression` |

---

### Category 6: Operation (Expression) Blocks

These are sub-expression blocks used inside filter/create/etc. They compose to build column expressions.

| Sub-category | Blocks | Port status |
|---|---|---|
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**`, unary `-`, `abs()` | **Port** |
| Comparison | `==`, `!=`, `<`, `<=`, `>`, `>=` | **Port** |
| Logic | `and`, `or`, `not`, `if/else` ternary | **Port** |
| Pairwise extrema | `max(a,b)`, `min(a,b)` | **Port** |
| Type checking | `is_missing`, `is_number`, `is_text`, `is_date`, `is_bool` | **Port** |
| Type conversion | `to_bool`, `to_datetime`, `to_number`, `to_string` | **Port** |
| Datetime extraction | `year`, `month`, `day`, `weekday`, `hour`, `minute`, `second` | **Port** |
| Shift (lag/lead) | `shift(col, n)` | **Port** |
| *(new)* String ops | `str.upper`, `str.lower`, `str.contains`, `str.replace` | **Add** |
| *(new)* Math | `round`, `floor`, `ceil`, `log`, `sqrt`, `exp` | **Add** |

---

### Category 7: Value Blocks

| Block | Original behavior | Port status |
|---|---|---|
| `value_column` | Column reference by name | **Port** |
| `value_number` | Numeric literal | **Port** |
| `value_text` | String literal | **Port** |
| `value_logical` | Boolean literal (true/false) | **Port** |
| `value_datetime` | Date/time constant (YYYY-MM-DD) | **Port** |
| `value_missing` | Explicit NA/NaN value | **Port** |
| `value_exponential` | Random draw from Exponential(λ) | **Port** |
| `value_normal` | Random draw from Normal(μ, σ) | **Port** |
| `value_uniform` | Random draw from Uniform(low, high) | **Port** |

---

### Category 8: Control Blocks

| Block | Original behavior | Port status |
|---|---|---|
| `control_seed` | Set RNG seed for reproducibility | **Port** | `np.random.seed(n)` |

---

## Key Architectural Concepts to Adopt

### 1. Immutable Pipeline Semantics
Every transform returns a **new** DataFrame without mutating the input. Generated Python code chains operations without intermediate variable mutation:
```python
result = (df
    .query("age > 30")
    .assign(age_group=pd.cut(df['age'], bins=5))
    .groupby('age_group')
    .agg({'salary': 'mean'})
    .reset_index()
)
```

### 2. Pipeline Heads as Cell Anchors
Blocks with a `hat: 'cap'` property (pipeline-starting blocks) correspond to the beginning of a Jupyter cell. Multiple independent pipelines in one workspace generate multiple independent code cells or a single cell with multiple top-level statements.

### 3. `saveAs` → Named Python Variables
The `transform_saveAs` block generates a Python variable assignment, enabling cross-pipeline data sharing:
```python
penguins_filtered = df.query("species == 'Adelie'")
```
A later pipeline can reference `penguins_filtered` via `data_user`.

### 4. Inline Random Distributions
`value_normal`, `value_uniform`, `value_exponential` generate `numpy` calls inline within `assign` expressions:
```python
df.assign(noise=np.random.normal(0, 1, len(df)))
```

### 5. Running (Window) Functions as First-Class Transforms
Rather than treating window operations as a variant of aggregation, `transform_running` is a distinct block that generates pandas `expanding()` or `cumsum()`-style operations:
```python
df.assign(running_total=df['sales'].cumsum())
```

### 6. `glue` with Source Labels (bind_rows)
The `combine_glue` block generates `pd.concat` with a `keys` argument that automatically adds a source column, enabling clean before/after or group-comparison workflows:
```python
pd.concat([control_df, treatment_df], keys=['control', 'treatment']).reset_index(level=0).rename(columns={'level_0': 'group'})
```

### 7. `toplevel_init` for Import Preamble
The existing `layout.ts` already supports a `toplevel_init` block property that prepends code before execution. Data transform blocks will use this to ensure `import pandas as pd`, `import numpy as np`, `import plotly.express as px`, and `import scipy.stats as stats` are always prepended.

---

## Deferred / Not Porting

| Feature | Reason |
|---|---|
| `data_phish`, `data_spotify` | Domain-specific datasets with unclear licensing |
| JavaScript / Lua generators for tidy blocks | Initial focus is Python/pandas; JS generators can be added later |
| Multilingual block labels (Arabic, Greek, Korean, etc.) | Defer to v0.5; use JupyterLab's existing i18n infrastructure |
| Custom rendering engine (original tidyblocks had its own DataFrame renderer) | pandas + IPython display handles this in Jupyter natively |

---

## Implementation Phases

### Phase 1 — Core Transforms (v0.4.0)
Data source blocks, all transform blocks, value blocks, operation blocks, control blocks. Python/pandas generators.

### Phase 2 — Visualization (v0.4.1)
All plot blocks with plotly.express generators.

### Phase 3 — Statistics (v0.4.2)
All stats blocks with scipy/sklearn generators.

### Phase 4 — Extended Operations (v0.5.0)
New blocks: rename, pivot, melt, fillna, dropna, sample, string ops, extended math, additional join types.

### Phase 5 — Multi-language Generators (v0.5.x)
JavaScript generators targeting observable/vega-lite for the JavaScript kernel path.
