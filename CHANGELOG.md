# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## 0.1.0

First release of **jupyter-tidyblocks**, forked from [QuantStack/jupyterlab-blockly](https://github.com/QuantStack/jupyterlab-blockly) v0.3.3.
Inspired by [Greg Wilson's tidyblocks](https://github.com/gvwilson/tidyblocks).

### New features

- **`packages/tidyblocks`**: new monorepo package providing 60+ tidy-data analysis blocks organized into seven categories — Data, Transform, Combine, Plot, Stats, Values, and Operations — with Python (pandas / plotly.express / scipy / sklearn) code generators
- Exports `registerTidyblocks(registry)` for registering all blocks and the Tidy Data toolbox with any `IBlocklyRegistry` instance
- Block names aligned with [dplyr (tidyverse)](https://dplyr.tidyverse.org/) conventions; 7 blocks renamed and 10 new blocks added (see below)

#### dplyr alignment — renames

| Old | New | dplyr verb |
|---|---|---|
| create column | mutate | `mutate()` |
| sort by | arrange by | `arrange()` |
| unique by | distinct by | `distinct()` |
| first N rows | slice_head | `slice_head()` |
| last N rows | slice_tail | `slice_tail()` |
| sample N rows | slice_sample | `slice_sample()` |
| glue with | bind_rows with | `bind_rows()` |

#### dplyr alignment — new blocks

- **Transform**: `count()`, `relocate()`, `slice_min()`, `slice_max()`
- **Combine**: `semi_join()`, `anti_join()`, `bind_cols()`
- **Operations**: `between()`, `coalesce()`, `n_distinct()`
- **summarize** block: added `n distinct` aggregate function option

### Rebrand & metadata

- Project renamed from `jupyterlab-blockly` to `jupyter-tidyblocks` across all packages
- Python package directory renamed from `jupyterlab_blockly/` to `jupyter_tidyblocks/`
- Author updated to Teon L. Brooks (teon.brooks@gmail.com)
- All repository/bug URLs updated to `teonbrooks/jupyter-tidyblocks`

### Dependency upgrades

- **`@jupyterlab/*`**: `^4.2` → `^4.5` (latest stable: 4.5.6; upgrade to `^4.6`/Rspack deferred until 4.6.0 stable)
- **`blockly`**: `^11.0` → `^12.0` (updated generator API: `forBlock['name'] = (block, generator) => ...`)
- **`@blockly/field-colour`**: `5.0.6` → `^6.0.0`
- **`react` / `react-dom`**: `^18.2` → `^19.0`
- **TypeScript**: `~5.0.2` → `~5.7`
- **Prettier**: `^2.5` → `^3.4`
- **ESLint**: `^8.9` → `^9.0`
- **`@typescript-eslint/*`**: `^5.12` → `^8.0`
- **`rimraf`**: `^4.4` → `^6.0`
- **`npm-run-all`** → **`npm-run-all2 ^7.0`**

### Build system

- **Vite** (library mode, ESM + CJS): replaces `tsc`-only build for `packages/blockly` and the new `packages/tidyblocks`; output goes to `lib/` with full `.d.ts` declarations via `vite-plugin-dts`
- **Turborepo**: replaces Lerna for monorepo task orchestration; `lerna.json` removed, `turbo.json` added
- **ESLint v9 flat config**: `.eslintrc.js` + `.eslintignore` replaced with `eslint.config.js`
- **`webpack.config.js`** deleted; `webpackConfig` field removed from extension `package.json`
- **`source-map-loader`** removed from extension `devDependencies`
- Yarn `resolutions` block added to root `package.json` to flatten `@lumino/*`, `@jupyterlab/*`, and `@lezer/common` to single versions across the workspace

### Bug fixes

- `packages/blockly/src/manager.ts`: `_onKernelChanged` parameter type corrected from `KernelConnection` (class) to `Kernel.IKernelConnection | null` (interface)
- `packages/blockly/src/registry.ts`: `case 'Sa' || 'Ar':` (always-truthy) split into `case 'Sa': case 'Ar':`
- `packages/tidyblocks/src/generators/python/op.ts`: `Order.UNARY` (non-existent in Blockly 12) replaced with `Order.NONE`
- `packages/tidyblocks/src/index.ts`: `registry.addToolbox` → `registry.registerToolbox` (correct method name on `IBlocklyRegistry`)
- Root `tsconfig.json`: added `"lib": ["ES2020", "DOM"]` to resolve `Intl.ResolvedRelativeTimeFormatOptions` error from `@jupyterlab/coreutils`

### Package manager

- Migrated from Yarn 4 to npm; `yarn.lock` / `.yarnrc.yml` / `.yarn/` removed; `"resolutions"` → `"overrides"`; `jlpm` replaced with `npm run` in all scripts
- `yarn.lock` added to `.gitignore` (regenerated as a build side-effect by `@jupyterlab/builder`'s bundled jlpm)

### Built-in datasets

Three new built-in datasets added to the **Data** category:

- **iris** — Fisher iris dataset (sepal/petal measurements for 3 species) via `sns.load_dataset('iris')`
- **titanic** — Titanic passenger survival dataset via `sns.load_dataset('titanic')`
- **gapminder** — Life expectancy / GDP across countries and years via `px.data.gapminder()`

No new dependencies required — iris and titanic use the existing seaborn import;
gapminder uses the existing plotly.express import.

### Docs

- `docs/getting-started.md`: step-by-step guide for installing and testing the extension in JupyterLab
- `docs/architecture.md`: full architecture reference (package layout, data-flow, extension points)
- `docs/blocks-reference.md`: complete block reference with dplyr mapping, description, and generated Python for every block
- `docs/custom-blocks.md`: step-by-step tutorial for adding custom blocks and toolboxes
- `docs/work-summary.md`: narrative summary of all engineering work done in this release
- `docs/modernization-plan.md`: full modernization plan with phase-by-phase status
- `docs/installation.md`: updated to use npm commands and correct package name
- `docs/other_extensions.md`: updated to reference `jupyter-tidyblocks` package and point to `custom-blocks.md`
- `docs/toolbox.md`: updated with correct category list and colours
- `docs/index.rst`: TOC updated to include all new docs
- `README.md`: rewritten; credits Greg Wilson's tidyblocks and QuantStack/jupyterlab-blockly

<!-- <END NEW CHANGELOG ENTRY> -->

---

*Prior changelog entries below are from the upstream jupyterlab-blockly project.*

## 0.3.3

([Full Changelog](https://github.com/QuantStack/jupyterlab-blockly/compare/jupyterlab-blockly-extension@0.3.2...e9602251ec5a7ced9700b1f3a35d0a72b9550dc7))

### Bugs fixed

- Generate \_version.py at build time [#100](https://github.com/QuantStack/jupyterlab-blockly/pull/100) ([@martinRenou](https://github.com/martinRenou))
- Update Lite deployment  [#90](https://github.com/QuantStack/jupyterlab-blockly/pull/90) ([@DenisaCG](https://github.com/DenisaCG))

### Documentation improvements

- Update docs [#99](https://github.com/QuantStack/jupyterlab-blockly/pull/99) ([@DenisaCG](https://github.com/DenisaCG))
- Update Lite deployment  [#90](https://github.com/QuantStack/jupyterlab-blockly/pull/90) ([@DenisaCG](https://github.com/DenisaCG))
