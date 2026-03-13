# Block Reference

Complete reference for all blocks available in the **Tidy Data** toolbox.
Blocks are organized by category, matching the sidebar in the Blockly editor.

Block names follow [dplyr (tidyverse)](https://dplyr.tidyverse.org/) conventions
where an equivalent verb exists. The **dplyr equivalent** column shows the R
function that inspired the block; a dash (—) means there is no direct
dplyr analogue.

---

## Data `#FEBE4C`

Source blocks start a pipeline. They create a DataFrame stored in `_df` and
have no top connector (nothing chains into them).

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| penguins dataset | `tidyblocks_data_penguins` | — | Palmer Penguins dataset loaded via seaborn | `_df = sns.load_dataset('penguins')` |
| colors dataset | `tidyblocks_data_colors` | — | Built-in table of 11 colors with RGB values | `_df = pd.DataFrame({...})` |
| earthquakes dataset | `tidyblocks_data_earthquakes` | — | 2016 global earthquake data from gvwilson/tidyblocks | `_df = pd.read_csv('<url>')` |
| sequence 1 to N as col | `tidyblocks_data_sequence` | — | Integer sequence 1..N in a named column | `_df = pd.DataFrame({'col': range(1, N+1)})` |
| dataset named name | `tidyblocks_data_user` | — | Reference a DataFrame previously saved with **save as** | `_df = name.copy()` |
| read CSV path | `tidyblocks_data_csv` | — | Load a CSV file from a local or remote path | `_df = pd.read_csv('path')` |

---

## Transform `#76AADB`

Transform blocks read from and write back to `_df`. They can be chained in
any order between a source block and a terminal block.

### Row operations

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| filter where cond | `tidyblocks_transform_filter` | `filter()` | Keep only rows where the condition is `True` | `_df = _df[cond]` |
| arrange by cols ↑↓ | `tidyblocks_transform_arrange` | `arrange()` | Sort rows by one or more columns, ascending or descending | `_df = _df.sort_values(by=[...], ascending=True/False)` |
| distinct by cols | `tidyblocks_transform_distinct` | `distinct()` | Remove duplicate rows, keeping one per unique combination of columns | `_df = _df.drop_duplicates(subset=[...])` |
| slice_head N rows | `tidyblocks_transform_slice_head` | `slice_head()` | Keep the first N rows | `_df = _df.head(N)` |
| slice_tail N rows | `tidyblocks_transform_slice_tail` | `slice_tail()` | Keep the last N rows | `_df = _df.tail(N)` |
| slice_sample N rows | `tidyblocks_transform_slice_sample` | `slice_sample()` | Randomly sample N rows | `_df = _df.sample(n=N)` |
| slice_min N rows by col | `tidyblocks_transform_slice_min` | `slice_min()` | Keep the N rows with the smallest values in a column | `_df = _df.nsmallest(N, 'col')` |
| slice_max N rows by col | `tidyblocks_transform_slice_max` | `slice_max()` | Keep the N rows with the largest values in a column | `_df = _df.nlargest(N, 'col')` |
| drop rows with missing in cols | `tidyblocks_transform_dropna` | — (`tidyr::drop_na`) | Remove rows that have missing values in the specified columns | `_df = _df.dropna(subset=[...])` |

### Column operations

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| select columns cols | `tidyblocks_transform_select` | `select()` | Keep only the named columns | `_df = _df[[...]]` |
| drop columns cols | `tidyblocks_transform_drop` | `select(-col)` | Remove the named columns | `_df = _df.drop(columns=[...])` |
| mutate col = expr | `tidyblocks_transform_mutate` | `mutate()` | Add a new column or overwrite an existing one with an expression | `_df = _df.assign(**{'col': expr})` |
| rename old to new | `tidyblocks_transform_rename` | `rename()` | Rename a single column | `_df = _df.rename(columns={'old': 'new'})` |
| relocate cols before/after anchor | `tidyblocks_transform_relocate` | `relocate()` | Move one or more columns to a new position relative to an anchor column | reorders `_df.columns` |
| fill missing in col with val | `tidyblocks_transform_fillna` | — (`tidyr::replace_na`) | Replace missing values in a column with a given value | `_df = _df.assign(**{'col': _df['col'].fillna(val)})` |

### Grouping & aggregation

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| group by cols | `tidyblocks_transform_groupby` | `group_by()` | Group rows by the values in one or more columns for use with summarize or running | `_df = _df.groupby([...], as_index=False)` |
| ungroup | `tidyblocks_transform_ungroup` | `ungroup()` | Remove grouping and reset the row index | `_df = _df.reset_index(drop=True)` |
| summarize fn of col as result | `tidyblocks_transform_summarize` | `summarize()` | Aggregate each group (or the whole DataFrame) to a single row using count / sum / mean / median / min / max / std / var / n distinct / any / all | `_df = _df.agg(**{'result': ('col', 'fn')}).reset_index()` |
| count by cols | `tidyblocks_transform_count` | `count()` | Count rows for each unique combination of the specified columns | `_df = _df.groupby([...], as_index=False).size().rename(columns={'size': 'n'})` |
| running fn of col as result | `tidyblocks_transform_running` | — (window fns) | Compute a cumulative operation (cumsum / cummax / cummin / cummean / row index) across rows | `_df = _df.assign(**{'result': _df['col'].cumsum()})` etc. |

### Utilities

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| bin col into N buckets as result | `tidyblocks_transform_bin` | — (`cut()`) | Discretize a numeric column into N equal-width interval buckets | `_df = _df.assign(**{'result': pd.cut(_df['col'], bins=N).astype(str)})` |
| save as name | `tidyblocks_transform_saveas` | — | Copy the current DataFrame into a named Python variable for later use with **dataset named** | `name = _df.copy()` |
| display table | `tidyblocks_transform_display` | — | Render the current DataFrame as an HTML table in the output cell | `display(_df)` |

---

## Combine `#808080`

Combine blocks merge the current `_df` with a second DataFrame that was
previously saved using **save as**.

### Mutating joins (add columns from the right table)

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| inner/left/right/outer join other on left col = right col | `tidyblocks_combine_join` | `inner_join()` / `left_join()` / `right_join()` / `full_join()` | Join two DataFrames on matching key columns. Choose inner (only matching rows), left (all left rows), right (all right rows), or outer (all rows from both) | `_df = pd.merge(_df, other, left_on='lk', right_on='rk', how='...')` |
| cross join with other | `tidyblocks_combine_cross_join` | `cross_join()` | Cartesian product — every row in `_df` paired with every row in `other` | `_df = _df.merge(other, how='cross')` |

### Filtering joins (keep/remove rows based on a match, no new columns)

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| semi join other on left col = right col | `tidyblocks_combine_semi_join` | `semi_join()` | Keep only rows in `_df` that have a matching key in `other`. No columns from `other` are added. | `_df = _df[_df['lk'].isin(other['rk'])]` |
| anti join other on left col = right col | `tidyblocks_combine_anti_join` | `anti_join()` | Keep only rows in `_df` that have **no** matching key in `other` | `_df = _df[~_df['lk'].isin(other['rk'])]` |

### Binding (stack or glue tables together)

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| bind_rows with other label column src | `tidyblocks_combine_bind_rows` | `bind_rows()` | Vertically stack `_df` on top of `other`, adding a label column to identify the source of each row | `_df = pd.concat([_df.assign(src='left'), other.assign(src='right')]).reset_index(drop=True)` |
| bind_cols with other | `tidyblocks_combine_bind_cols` | `bind_cols()` | Horizontally bind `_df` and `other` by column position. Both tables must have the same number of rows. | `_df = pd.concat([_df, other], axis=1)` |

---

## Plot `#A4C588`

Plot blocks are terminal — they render a chart and have no bottom connector.
All plots use [Plotly Express](https://plotly.com/python/plotly-express/).

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| bar chart x col y col | `tidyblocks_plot_bar` | — | Vertical bar chart | `px.bar(_df, x='col', y='col')` |
| box plot x col y col | `tidyblocks_plot_box` | — | Box-and-whisker plot showing median, IQR, and outliers | `px.box(_df, x='col', y='col')` |
| dot plot x col | `tidyblocks_plot_dot` | — | Strip/dot plot — one point per row along an axis | `px.strip(_df, x='col')` |
| histogram of col bins N | `tidyblocks_plot_histogram` | — | Frequency histogram with N bins | `px.histogram(_df, x='col', nbins=N)` |
| scatter plot x col y col color col trendline ☐ | `tidyblocks_plot_scatter` | — | Scatter plot with optional color grouping and OLS trendline | `px.scatter(_df, x=..., y=..., color=..., trendline=...)` |
| line chart x col y col color col | `tidyblocks_plot_line` | — | Line chart with optional color grouping | `px.line(_df, x=..., y=..., color=...)` |
| violin plot x col y col | `tidyblocks_plot_violin` | — | Violin plot showing the distribution shape | `px.violin(_df, x='col', y='col')` |
| correlation heatmap | `tidyblocks_plot_heatmap` | — | Heatmap of pairwise Pearson correlations between all numeric columns | `px.imshow(_df.corr())` |

---

## Stats `#BA93DB`

Stats blocks are terminal — they print results and have no bottom connector.
All stats use [scipy.stats](https://docs.scipy.org/doc/scipy/reference/stats.html)
and [scikit-learn](https://scikit-learn.org/).

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| one-sample t-test column col vs mean μ | `tidyblocks_stats_ttest_one` | — | Two-sided one-sample t-test: tests whether the column mean equals μ. Prints t-statistic and p-value. | `stats.ttest_1samp(_df['col'], μ)` |
| two-sample t-test groups in group_col values in val_col | `tidyblocks_stats_ttest_two` | — | Two-sided two-sample t-test: splits rows into two groups and tests whether their means differ | `stats.ttest_ind(group_a, group_b)` |
| k-means x col y col k N label col | `tidyblocks_stats_kmeans` | — | K-means clustering on two columns; adds a cluster label column to `_df` | `KMeans(n_clusters=N).fit_predict(...)` |
| silhouette score x col y col labels col score col | `tidyblocks_stats_silhouette` | — | Computes the silhouette coefficient for existing cluster labels; adds a score column | `silhouette_score(X, labels)` |
| Pearson/Spearman/Kendall correlation of col_a and col_b | `tidyblocks_stats_correlation` | — | Computes pairwise correlation coefficient and p-value between two columns | `stats.pearsonr / spearmanr / kendalltau` |
| describe | `tidyblocks_stats_describe` | — | Prints `DataFrame.describe()` — count, mean, std, min, quartiles, max for every numeric column | `display(_df.describe())` |

---

## Values `#E7553C`

Value blocks are expression blocks — they produce a value and connect into
input slots on transform or operation blocks. They do not have statement
connectors.

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| column col | `tidyblocks_value_column` | — | Reference a DataFrame column by name | `_df['col']` |
| number | `tidyblocks_value_number` | — | A numeric literal | `0`, `3.14`, etc. |
| "text" | `tidyblocks_value_text` | — | A string literal | `'text'` |
| true / false | `tidyblocks_value_logical` | — | A boolean literal | `True` / `False` |
| date YYYY-MM-DD | `tidyblocks_value_datetime` | — | A date/time constant | `pd.Timestamp('YYYY-MM-DD')` |
| missing | `tidyblocks_value_missing` | `NA` | An explicit missing (NA/NaN) value | `float("nan")` |
| Normal(mean μ std σ) | `tidyblocks_value_normal` | — | Draw a column of values from a Normal distribution | `np.random.normal(μ, σ, len(_df))` |
| Uniform(low a high b) | `tidyblocks_value_uniform` | — | Draw a column of values from a Uniform distribution | `np.random.uniform(a, b, len(_df))` |
| Exponential(lambda λ) | `tidyblocks_value_exponential` | — | Draw a column of values from an Exponential distribution | `np.random.exponential(1/λ, len(_df))` |

---

## Operations `#F9B5B2`

Operation blocks are expression blocks used inside **filter**, **mutate**,
**fill missing**, and similar blocks. They take value inputs and return a
computed value.

### Numeric & comparison

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| a + b, a - b, a × b, a ÷ b, a % b, a ** b | `tidyblocks_op_arithmetic` | — | Standard arithmetic on two values | `(a + b)`, `(a * b)`, etc. |
| a = b, a ≠ b, a < b, a ≤ b, a > b, a ≥ b | `tidyblocks_op_compare` | — | Element-wise comparison, returning a boolean column | `(a == b)`, `(a < b)`, etc. |
| x between left and right | `tidyblocks_op_between` | `between()` | Return `True` for values within the inclusive range `[left, right]` | `x.between(left, right)` |
| abs / round / floor / ceil / sqrt / log / exp ( val ) | `tidyblocks_op_math` | — | Apply a standard math function to a column | `val.abs()`, `np.sqrt(val)`, etc. |

### Logic

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| a AND b / a OR b | `tidyblocks_op_logic` | — | Element-wise logical AND/OR on two boolean columns | `(a & b)`, `(a \| b)` |
| NOT val | `tidyblocks_op_not` | — | Element-wise logical NOT | `~(val)` |
| if cond then x else y | `tidyblocks_op_ifelse` | `if_else()` | Return `x` where `cond` is `True`, `y` elsewhere | `np.where(cond, x, y)` |
| coalesce val with replacement | `tidyblocks_op_coalesce` | `coalesce()` | Replace missing values in `val` with values from `replacement` | `val.fillna(replacement)` |

### Type operations

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| val is missing / is number / is text / is date / is boolean | `tidyblocks_op_typecheck` | — | Test whether each element matches a specific type | `val.isna()`, `val.apply(isinstance(...))`, etc. |
| convert val to number / text / bool / datetime | `tidyblocks_op_convert` | — | Cast a column to a different type | `pd.to_numeric(val)`, `val.astype(str)`, etc. |

### Date & time

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| year / month / day / weekday / hour / minute / second of val | `tidyblocks_op_datetime` | — | Extract a calendar component from a datetime column | `val.dt.year`, `val.dt.month`, etc. |

### Window & ranking

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| shift val by N | `tidyblocks_op_shift` | `lag()` / `lead()` | Shift values forward (positive N = lag) or backward (negative N = lead) | `val.shift(N)` |
| n_distinct val | `tidyblocks_op_n_distinct` | `n_distinct()` | Count the number of distinct (unique) values in a column | `val.nunique()` |

### String

| Block label | Block type | dplyr equivalent | What it does | Python generated |
|---|---|---|---|---|
| val . upper / lower / strip / length | `tidyblocks_op_string` | — | Apply a string operation to a text column | `val.str.upper()`, `val.str.len()`, etc. |
| val contains pattern | `tidyblocks_op_str_contains` | `stringr::str_detect()` | Return `True` where the string column matches a pattern | `val.str.contains('pattern', na=False)` |

---

## Pipeline rules

| Block role | Has top connector | Has bottom connector | Examples |
|---|---|---|---|
| **Source** | No | Yes | all Data blocks |
| **Transform** | Yes | Yes | filter, mutate, arrange, … |
| **Terminal** | Yes | No | display table, all Plot blocks, all Stats blocks |

A valid pipeline must be: **one source → zero or more transforms → one terminal**.
