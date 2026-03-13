# tidyblocks — Original Feature Reference

**Repository:** https://github.com/gvwilson/tidyblocks (archived August 2024)
**Author:** Greg Wilson
**Concept:** A visual, block-based tidy-data analysis environment built on Google Blockly
with a pipeline execution model, internationalization support (8 languages), and integrated
plotting and statistics.

This document catalogs the features of the original `gvwilson/tidyblocks` project.
It serves as a reference for what inspired `jupyter-tidyblocks`.

---

## Execution Model

Blocks form **pipelines** — linear chains starting from a data source and flowing through
transforms into outputs (plots/stats/saves). Each block emits a JSON representation; a
`Pipeline` runner executes the JSON sequence against an immutable `DataFrame` object.
Multiple independent pipelines can exist in one workspace.

---

## Data Source Blocks

| Block | Behavior |
|---|---|
| `data_colors` | Built-in 11-color RGB dataset |
| `data_earthquakes` | 2016 earthquake dataset |
| `data_penguins` | Palmer penguins dataset |
| `data_phish` | Phish concert dataset |
| `data_spotify` | Spotify song data |
| `data_sequence` | Generate 1..N sequence into named column |
| `data_user` | Reference user-defined dataset by name |

---

## Transform Blocks

| Block | Behavior |
|---|---|
| `transform_filter` | Keep rows matching boolean expression |
| `transform_select` | Keep specified columns |
| `transform_drop` | Remove specified columns |
| `transform_create` | Add / replace column with expression |
| `transform_sort` | Sort by columns; optional descending |
| `transform_unique` | Deduplicate by columns |
| `transform_groupBy` | Group rows for subsequent aggregation |
| `transform_ungroup` | Remove grouping |
| `transform_summarize` | Aggregate with a summary function |
| `transform_running` | Cumulative/window operation |
| `transform_bin` | Discretize numeric column into N buckets |
| `transform_saveAs` | Persist DataFrame under a name |

**Summarize functions:** `all`, `any`, `count`, `max`, `mean`, `median`, `min`, `std`, `sum`, `var`

**Running (cumulative) functions:** `cumall`, `cumany`, `cumcount`, `cummax`, `cummean`, `cummin`, `cumsum`

---

## Combine Blocks

| Block | Behavior |
|---|---|
| `combine_join` | Inner join on matching column values |
| `combine_glue` | Vertical stack with source label column |

---

## Plot Blocks

Original plots used a custom JavaScript plotting library.

| Block | Behavior |
|---|---|
| `plot_bar` | Bar chart (x, y) |
| `plot_box` | Box plot (x, y) |
| `plot_dot` | Dot/strip plot (x only) |
| `plot_histogram` | Histogram (column, nbins) |
| `plot_scatter` | Scatter (x, y, color, regression toggle) |

---

## Statistics Blocks

| Block | Behavior |
|---|---|
| `stats_ttest_one` | One-sample two-sided t-test |
| `stats_ttest_two` | Two-sample two-sided t-test |
| `stats_k_means` | K-means clustering |
| `stats_silhouette` | Silhouette coefficient for cluster quality |

---

## Operation (Expression) Blocks

| Sub-category | Blocks |
|---|---|
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**`, unary `-`, `abs()` |
| Comparison | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Logic | `and`, `or`, `not`, `if/else` ternary |
| Pairwise extrema | `max(a,b)`, `min(a,b)` |
| Type checking | `is_missing`, `is_number`, `is_text`, `is_date`, `is_bool` |
| Type conversion | `to_bool`, `to_datetime`, `to_number`, `to_string` |
| Datetime extraction | `year`, `month`, `day`, `weekday`, `hour`, `minute`, `second` |
| Shift (lag/lead) | `shift(col, n)` |

---

## Value Blocks

| Block | Behavior |
|---|---|
| `value_column` | Column reference by name |
| `value_number` | Numeric literal |
| `value_text` | String literal |
| `value_logical` | Boolean literal (true/false) |
| `value_datetime` | Date/time constant (YYYY-MM-DD) |
| `value_missing` | Explicit NA/NaN value |
| `value_exponential` | Random draw from Exponential(λ) |
| `value_normal` | Random draw from Normal(μ, σ) |
| `value_uniform` | Random draw from Uniform(low, high) |

---

## Control Blocks

| Block | Behavior |
|---|---|
| `control_seed` | Set RNG seed for reproducibility |

---

## Internationalization

Block labels available in 8 languages via bundled JSON locale files.

---

## Key Architectural Concepts

### Immutable Pipeline Semantics
Every transform returns a new DataFrame without mutating the input. Multiple independent
pipelines can exist in one workspace.

### Pipeline Heads
Blocks with a `hat: 'cap'` property start a pipeline. Multiple pipelines in one workspace
produce multiple independent execution sequences.

### `saveAs` → Named Variables
`transform_saveAs` persists a DataFrame under a name so later pipelines can reference it
via `data_user`.

### Inline Random Distributions
`value_normal`, `value_uniform`, `value_exponential` generate random values inline within
expressions.

### `glue` with Source Labels
`combine_glue` stacks two DataFrames vertically and adds a source-label column, enabling
before/after or group-comparison workflows.
