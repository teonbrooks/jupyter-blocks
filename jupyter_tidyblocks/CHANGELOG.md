# Changelog — jupyter-tidyblocks

<!-- <START NEW CHANGELOG ENTRY> -->

## 0.1.0

Initial release of **jupyter-tidyblocks**, inspired by
[Greg Wilson's tidyblocks](https://github.com/gvwilson/tidyblocks) project
and built on top of [jupyter-blocks](https://github.com/teonbrooks/jupyter-blocks).

### New features

- **60+ tidy-data analysis blocks** organized into seven categories:

  | Category | Color | Highlights |
  |---|---|---|
  | **Data** | `#FEBE4C` | penguins, iris, titanic, gapminder, earthquakes, colors, sequence, user variable, read CSV |
  | **Transform** | `#76AADB` | filter, select, drop, mutate, rename, arrange, distinct, group by, summarize, running, bin, save as, fill NA, drop NA, slice_sample/head/tail/min/max, count, relocate, display table |
  | **Combine** | `#808080` | join, bind_rows, cross join, semi join, anti join, bind_cols |
  | **Plot** | `#A4C588` | bar, box, dot, histogram, scatter, line, violin, heatmap |
  | **Stats** | `#BA93DB` | t-test (one/two sample), k-means, silhouette, correlation, describe |
  | **Values** | `#E7553C` | column, number, text, logical, datetime, missing, normal, uniform, exponential |
  | **Operations** | `#F9B5B2` | arithmetic, compare, logic, not, if/else, typecheck, convert, datetime extract, shift, math, string, str_contains, between, coalesce, n_distinct |

- **Python code generation** targeting pandas, seaborn, plotly.express, scipy, and sklearn
- **`_df` pipeline convention** — every transform reads from and writes back to
  `_df`, enabling free chaining without manual variable naming
- **`toplevel_init`** mechanism: block types declare required import statements
  that are collected, deduplicated, and prepended to generated code automatically
- Registers automatically with `jupyter-blocks` via `IBlocklyRegistry`

### Block names aligned with dplyr (tidyverse)

#### Renames (7 blocks)

| Old | New | dplyr verb |
|---|---|---|
| create column | mutate | `mutate()` |
| sort by | arrange by | `arrange()` |
| unique by | distinct by | `distinct()` |
| first N rows | slice_head | `slice_head()` |
| last N rows | slice_tail | `slice_tail()` |
| sample N rows | slice_sample | `slice_sample()` |
| glue with | bind_rows with | `bind_rows()` |

#### New blocks (10 blocks)

- **Transform**: `count()`, `relocate()`, `slice_min()`, `slice_max()`
- **Combine**: `semi_join()`, `anti_join()`, `bind_cols()`
- **Operations**: `between()`, `coalesce()`, `n_distinct()`
- **summarize** block: added `n distinct` aggregate function option

### Built-in datasets

- **iris** — Fisher iris dataset (sepal/petal measurements for 3 species) via `sns.load_dataset('iris')`
- **titanic** — Titanic passenger survival dataset via `sns.load_dataset('titanic')`
- **gapminder** — Life expectancy / GDP across countries and years via `px.data.gapminder()`

### Bug fixes

- Registration wiring: `registerTidyblocks()` is now called from the dedicated
  `jupyter-tidyblocks-extension` package, ensuring the Tidy Data toolbox is
  always present when opening a `.jblk` file
- Default toolbox: `BlocklyManager` now selects the first non-`'default'`
  registered toolbox on startup, so the Tidy Data toolbox opens by default
- Silent crash fix: `getBlocksToplevelInit()` rewrote `for...in` iteration to
  `for...of` with optional chaining, preventing a `TypeError` that Blockly's
  event system was silently swallowing
- Module Federation fix: `registerTidyblocks()` now calls
  `registry.registerGenerator('python', pythonGenerator)` to ensure the
  tidyblocks-enriched generator instance is the one used for code generation
- `display table` block: added terminal block that calls `display(_df)` to
  render the full HTML DataFrame representation in the output area
- `Order.UNARY` (removed in Blockly 12) replaced with `Order.NONE` in
  `packages/tidyblocks/src/generators/python/op.ts`
- `registry.addToolbox()` (wrong method name) corrected to
  `registry.registerToolbox()` in `packages/tidyblocks/src/index.ts`

<!-- <END NEW CHANGELOG ENTRY> -->
