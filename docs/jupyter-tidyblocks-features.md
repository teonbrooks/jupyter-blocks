# jupyter-tidyblocks Features

This document describes all features currently implemented in `jupyter-tidyblocks`.

For the blocks that inspired this project, see
[`inspirations/tidyblocks-features.md`](inspirations/tidyblocks-features.md).
For the full block reference with generated Python, see
[`blocks-reference.md`](blocks-reference.md).

---

## Execution Model

Blocks form **pipelines** — linear chains starting from a data source, passing through
zero or more transforms, and ending at a plot, stats, or display block. The entire
pipeline generates a single Python code string that executes against the active
JupyterLab kernel. The running DataFrame is always stored in `_df`.

Multiple independent pipelines can exist in one workspace; they execute as one combined
code cell in top-to-bottom order.

---

## Data Source Blocks

Source blocks start a pipeline. They create `_df` and have no top connector.

| Block | Python generated | Notes |
|---|---|---|
| `penguins dataset` | `sns.load_dataset('penguins')` | Palmer penguins via seaborn |
| `iris dataset` | `sns.load_dataset('iris')` | Fisher iris via seaborn |
| `titanic dataset` | `sns.load_dataset('titanic')` | Titanic survival via seaborn |
| `gapminder dataset` | `px.data.gapminder()` | GDP/life expectancy via plotly.express |
| `colors dataset` | `pd.DataFrame({...})` | 11 named colors with RGB values (inline) |
| `earthquakes dataset` | `pd.read_csv('<url>')` | 2016 global earthquake data |
| `sequence 1 to N as col` | `pd.DataFrame({'col': range(1, N+1)})` | Integer sequence |
| `dataset named name` | `name.copy()` | Reference a named DataFrame variable |
| `read CSV path` | `pd.read_csv('path')` | Load local or remote CSV |

---

## Transform Blocks

Transform blocks read from `_df` and write back to `_df`. Block names follow
[dplyr](https://dplyr.tidyverse.org/) conventions.

| Block | dplyr equivalent | Python generated |
|---|---|---|
| `filter where cond` | `filter()` | `_df[cond]` |
| `select columns` | `select()` | `_df[[cols]]` |
| `drop columns` | `select(-col)` | `_df.drop(columns=[cols])` |
| `mutate col = expr` | `mutate()` | `_df.assign(**{'col': expr})` |
| `rename old → new` | `rename()` | `_df.rename(columns={'old': 'new'})` |
| `relocate col after` | `relocate()` | column reindex |
| `arrange by cols` | `arrange()` | `_df.sort_values(by=[cols], ascending=...)` |
| `distinct by cols` | `distinct()` | `_df.drop_duplicates(subset=[cols])` |
| `group by cols` | `group_by()` | `_df.groupby([cols])` |
| `ungroup` | `ungroup()` | `_df.reset_index(drop=True)` |
| `summarize col = fn` | `summarize()` | `_df.agg({'col': 'fn'})` |
| `count by cols` | `count()` | `_df.groupby([cols]).size().reset_index(name='n')` |
| `running fn on col` | — | `_df.assign(col=_df['col'].cumfn())` |
| `bin col into N` | — | `pd.cut(_df['col'], bins=N)` |
| `save as name` | — | `name = _df.copy()` |
| `fill na in col` | — | `_df.fillna({'col': value})` |
| `drop na from col` | — | `_df.dropna(subset=[cols])` |
| `slice_sample N rows` | `slice_sample()` | `_df.sample(n=N)` |
| `slice_head N rows` | `slice_head()` | `_df.head(N)` |
| `slice_tail N rows` | `slice_tail()` | `_df.tail(N)` |
| `slice_min N by col` | `slice_min()` | `_df.nsmallest(N, 'col')` |
| `slice_max N by col` | `slice_max()` | `_df.nlargest(N, 'col')` |
| `display` | — | `display(_df)` |

**Summarize functions:** count, sum, mean, median, min, max, std dev, variance, n distinct, any, all

**Running functions:** cumulative sum, cumulative max, cumulative min, cumulative mean, row index

---

## Combine Blocks

Combine blocks merge two DataFrames. The left input is `_df`; the right is a named
DataFrame (set with **save as**).

| Block | dplyr equivalent | Python generated |
|---|---|---|
| `join on left = right` | `inner_join()` | `pd.merge(_df, other, left_on=..., right_on=...)` |
| `semi_join with other on col` | `semi_join()` | `_df[_df['col'].isin(other['col'])]` |
| `anti_join with other on col` | `anti_join()` | `_df[~_df['col'].isin(other['col'])]` |
| `bind_rows with other` | `bind_rows()` | `pd.concat([_df, other], ignore_index=True)` |
| `bind_cols with other` | `bind_cols()` | `pd.concat([_df, other], axis=1)` |
| `cross join with other` | — | `_df.merge(other, how='cross')` |

---

## Plot Blocks

Plot blocks visualize `_df` using [plotly.express](https://plotly.com/python/plotly-express/).
They are terminal blocks (left connector only; nothing chains below them).

| Block | Python generated |
|---|---|
| `bar chart x y` | `px.bar(_df, x='x', y='y').show()` |
| `box plot x y` | `px.box(_df, x='x', y='y').show()` |
| `dot plot x` | `px.strip(_df, x='x').show()` |
| `histogram x bins` | `px.histogram(_df, x='x', nbins=N).show()` |
| `scatter x y color` | `px.scatter(_df, x='x', y='y', color='c').show()` |
| `line chart x y color` | `px.line(_df, x='x', y='y', color='c').show()` |
| `violin x y` | `px.violin(_df, x='x', y='y').show()` |
| `heatmap` | `px.imshow(_df.corr()).show()` |

---

## Stats Blocks

Stats blocks run statistical analyses on `_df` using scipy and scikit-learn.
They are terminal blocks.

| Block | Python generated |
|---|---|
| `one-sample t-test col vs mean` | `scipy.stats.ttest_1samp(_df['col'].dropna(), mean)` |
| `two-sample t-test col by group` | `scipy.stats.ttest_ind(group1, group2)` |
| `k-means on cols k clusters` | `KMeans(n_clusters=k).fit(_df[[cols]])` |
| `silhouette score on cols` | `silhouette_score(_df[[cols]], labels)` |
| `correlation of cols` | `_df[[cols]].corr()` |
| `describe` | `_df.describe()` |

---

## Value Blocks

Value blocks produce a single value for use inside filter conditions or mutate
expressions. They have no top/bottom connectors — they attach to input slots.

| Block | Python generated |
|---|---|
| `column name` | `_df['name']` |
| `number N` | `N` |
| `text "str"` | `'str'` |
| `true / false` | `True` / `False` |
| `datetime YYYY-MM-DD` | `pd.Timestamp('YYYY-MM-DD')` |
| `missing` | `None` |
| `normal(μ, σ)` | `np.random.normal(μ, σ, len(_df))` |
| `uniform(low, high)` | `np.random.uniform(low, high, len(_df))` |
| `exponential(λ)` | `np.random.exponential(λ, len(_df))` |

---

## Operation Blocks

Operation blocks build expressions used inside filter/mutate/etc.

| Sub-category | Blocks | dplyr equivalent |
|---|---|---|
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**`, unary `-`, `abs()` | — |
| Comparison | `==`, `!=`, `<`, `<=`, `>`, `>=` | — |
| Between | `col between lo and hi` | `between()` |
| Logic | `and`, `or`, `not` | — |
| If/else | `if cond then a else b` | `if_else()` |
| Coalesce | `coalesce(col, default)` | `coalesce()` |
| N distinct | `n_distinct(col)` | `n_distinct()` |
| Type checking | `is missing`, `is number`, `is text`, `is date`, `is bool` | — |
| Type conversion | `to bool`, `to datetime`, `to number`, `to string` | — |
| Datetime extraction | `year`, `month`, `day`, `weekday`, `hour`, `minute`, `second` | — |
| Shift | `shift col by n` | `lag()` / `lead()` |
| Math | `round`, `floor`, `ceil`, `log`, `sqrt`, `exp` | — |
| String | `upper`, `lower`, `strip` | — |
| String contains | `col contains pattern` | `str_detect()` |

---

## Kernel Support

The same workspace can generate code for multiple kernel languages. The active kernel
is selected from the **Kernel** dropdown in the editor toolbar.

| Kernel | Language | Generator |
|---|---|---|
| ipykernel / xeus-python | Python | `blockly/python` |
| ijavascript / tslab | JavaScript | `blockly/javascript` |
| xeus-lua | Lua | `blockly/lua` |

---

## Extensibility

The `IBlocklyRegistry` token (provided by `jupyter-blocks`) allows any JupyterLab
plugin to:

- Register new block shapes (`registerBlocks`)
- Register new toolboxes (`registerToolbox`)
- Register new code generators (`registerGenerator`)

See [Adding Custom Blocks](custom-blocks.md) for a step-by-step guide.

---

## File Format

Workspace state is saved as `.jblk` files — JSON containing the serialized Blockly
workspace state. Files can be committed to version control and reopened to restore the
exact block arrangement.

---

## Build System

- **Turborepo** for monorepo task orchestration across four packages
- **Vite** (library mode) for `packages/blocks` and `packages/tidyblocks`
- **`@jupyterlab/builder`** (webpack) for `packages/blocks-extension` and `packages/tidyblocks-extension`
- **npm workspaces** with `overrides` for dependency version pinning
- **hatchling + hatch-nodejs-version** for the Python wheel build

---

## Python Runtime Dependencies

Generated code uses the following libraries (install separately):

```bash
pip install pandas numpy seaborn plotly scipy scikit-learn
```
