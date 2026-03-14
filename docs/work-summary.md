# Work Summary

This document summarizes the engineering work done to modernize, fix, extend,
and restructure the `jupyter-tidyblocks` project from its original
`jupyterlab-blockly` upstream fork into a fully working tidy-data analysis
extension for JupyterLab 4.5, and then split it into the current two-package
monorepo (`jupyter-blocks` + `jupyter-tidyblocks`).

---

## 1. Dependency modernization

**Problem:** The project was pinned to JupyterLab 3.x-era packages and the
old `blockly@9` API, both of which are incompatible with a modern JupyterLab
4.x installation.

**What was done:**
- Upgraded all `@jupyterlab/*` peer dependencies from `^3.x` to `^4.5`.
- Upgraded `blockly` from `^9` to `^12` (new serialization API, new
  generator API, `Order` enum changes).
- Added `@blockly/field-colour` for the color-picker block.
- Pinned `@jupyterlab/application`, `@jupyterlab/apputils`, and
  `@jupyterlab/services` as npm workspace overrides to prevent nested
  duplicate installs that caused TypeScript type conflicts.
- Added `"lib": ["ES2020", "DOM"]` to the root `tsconfig.json` to fix a
  missing `Intl.ResolvedRelativeTimeFormatOptions` TypeScript error
  introduced by newer `@types/node`.

---

## 2. TypeScript build fixes

All packages now compile cleanly with zero errors.

| File | Fix |
|---|---|
| `packages/blocks/src/manager.ts` | Changed `KernelConnection` (concrete class) import to `Kernel` namespace for the correct `IKernelConnection \| null` type in `_onKernelChanged`. |
| `packages/blocks/src/registry.ts` | Fixed always-truthy `case 'Sa' \|\| 'Ar':` (TS2872) — split into two separate `case` statements. |
| `packages/blocks/src/widget.ts` | Added missing `private _manager` field and public `get manager()` getter to `BlocklyPanel`. |
| `packages/blocks-extension/src/index.ts` | Added `as any` casts for `LabIcon` and `rendermime` arguments that have minor type divergence across nested `@jupyterlab/*` installs. |
| `packages/tidyblocks/src/generators/python/op.ts` | Replaced non-existent `Order.UNARY` (removed in Blockly 12) with `Order.NONE`. |
| `packages/tidyblocks/src/index.ts` | Changed `registry.addToolbox()` (wrong method name) to `registry.registerToolbox()`. |

---

## 3. Build system fixes

**Problem:** Vite defaulted its output directory to `dist/` but both
`packages/blocks/package.json` and `packages/tidyblocks/package.json`
declared `"main": "lib/index.mjs"` — causing "Cannot find module
'jupyter-blocks'" errors when the extension package tried to import from
them.

**Fix:** Added `build: { outDir: 'lib' }` to `vite.config.ts` in both
`packages/blocks/` and `packages/tidyblocks/`.

**Turborepo ordering:** Added `"dependsOn": ["^build"]` to the build task in
`turbo.json` to guarantee `jupyter-blocks` builds before
`jupyter-tidyblocks`, which builds before `jupyter-blocks-extension` and
`jupyter-tidyblocks-extension`.

---

## 4. Python package restructure

**Problem:** The original Python package directory was named `jupyterlab_blockly/`
but the package was declared as `jupyter_tidyblocks` in `pyproject.toml`,
causing an import failure when JupyterLab tried to load the extension.

**Fix:** Restructured into two separate Python packages with a `src/` layout:
- `jupyter_blocks/src/jupyter_blocks/__init__.py` — exposes
  `_jupyter_labextension_paths()` pointing to `jupyter-blocks-extension`.
- `jupyter_tidyblocks/src/jupyter_tidyblocks/__init__.py` — exposes
  `_jupyter_labextension_paths()` pointing to `jupyter-tidyblocks-extension`.
- Each package has its own `pyproject.toml` using hatchling +
  hatch-nodejs-version to source the Python version from the corresponding
  npm `package.json`.
- `turbo.json` updated to include both `labextension/` output directories.

---

## 5. Tidy Data blocks — new feature

A full suite of tidy-data analysis blocks was designed and implemented from
scratch, inspired by Greg Wilson's original
[tidyblocks](https://github.com/gvwilson/tidyblocks) project.

### Block categories

| Category | Color | Blocks |
|---|---|---|
| **Data** | `#FEBE4C` | penguins, earthquakes, colors, sequence, user variable, read CSV |
| **Transform** | `#76AADB` | filter, select, drop, mutate, rename, arrange, distinct, group by, ungroup, summarize, running, bin, save as, fill NA, drop NA, slice_sample, slice_head, slice_tail, slice_min, slice_max, count, relocate, **display table** |
| **Combine** | `#808080` | join, bind_rows, cross join, semi join, anti join, bind_cols |
| **Plot** | `#A4C588` | bar, box, dot, histogram, scatter, line, violin, heatmap |
| **Stats** | `#BA93DB` | t-test (one/two sample), k-means, silhouette, correlation, describe |
| **Values** | `#E7553C` | column, number, text, logical, datetime, missing, normal, uniform, exponential |
| **Operations** | `#F9B5B2` | arithmetic, compare, logic, not, if/else, typecheck, convert, datetime extract, shift, math, string, str_contains, between, coalesce, n_distinct |

### Python code generation

Each block maps to idiomatic pandas / seaborn / plotly Python. Pipelines
use a `_df` convention — every block reads from and writes back to `_df` —
so blocks can be freely chained without naming variables manually.

The `toplevel_init` mechanism (a custom property on `Blockly.Blocks` entries)
allows block types to declare their required import statements. These are
collected, deduplicated, and prepended to the generated script automatically.

---

## 6. Registration wiring fix

**Problem:** After building, the Tidy Data category was missing from the
block inventory when opening a `.jblk` file.

**Root cause:** `registerTidyblocks()` was never called. The function was
exported from `jupyter-tidyblocks` but nothing in the extension's
`activate()` function imported or invoked it.

**Fix:**
1. Created a dedicated `packages/tidyblocks-extension` package whose sole
   job is to import `registerTidyblocks` from `jupyter-tidyblocks` and call
   it inside `activate()` with the `IBlocklyRegistry` token.
2. This keeps `packages/blocks-extension` free of tidy-data concerns and
   makes both extensions independently installable.

---

## 7. Default toolbox fix

**Problem:** Even after registration, the editor opened showing the generic
"default" Blockly toolbox (Logic, Loops, Math, etc.) rather than Tidy Data.
Users had to manually switch via the toolbar dropdown.

**Fix:** Changed `BlocklyManager`'s constructor to pick the first
non-`'default'` registered toolbox as the initial selection:

```typescript
const registered = [...this._registry.toolboxes.keys()].find(k => k !== 'default');
this._toolbox = registered ?? 'default';
```

---

## 8. Silent crash in workspace change listener

**Problem:** Dragging any block onto the canvas produced no code in the
preview panel and no error message.

**Root cause — Bug 1:** `getBlocksToplevelInit()` used `for...in` to iterate
an array (which yields string indices, not elements) and accessed
`Blockly.Blocks[type]` without a null-check. When a block type is registered
without a `toplevel_init` property the lookup returns `undefined`, causing a
`TypeError`. Blockly's event system silently swallows exceptions thrown
inside change listeners.

**Fix:** Rewrote the loop using `for...of`, optional chaining (`?.`), and a
`Set` for deduplication:

```typescript
for (const block of used_blocks) {
  const def = Blockly.Blocks[block.type];
  if (def?.toplevel_init && !seen.has(def.toplevel_init)) {
    seen.add(def.toplevel_init);
    finalToplevelInit += def.toplevel_init;
  }
}
```

**Root cause — Bug 2 (Module Federation):** The `pythonGenerator` instance
stored in `BlocklyRegistry` (imported in `registry.ts`) could be a different
object than the `pythonGenerator` used by tidyblocks generators (imported in
`tidyblocks/src/generators/python/*.ts`) if webpack's Module Federation
treated `blockly/python` as separate bundles. In that case
`workspaceToCode()` would throw `Error: Unknown block type: tidyblocks_data_penguins`.

**Fix:** Added `registry.registerGenerator('python', pythonGenerator)` to
`registerTidyblocks()`. This explicitly pushes the tidyblocks-enriched
`pythonGenerator` instance (which already has all `forBlock` handlers
attached) into the registry, overwriting any diverged instance.

---

## 9. Run button fix

**Problem:** Clicking the Run button produced no output and no error message.

**Root cause:** The `catch` handler in `run()` only called `console.error`,
which is invisible in normal JupyterLab usage. Additionally, when the
workspace was empty the code variable was an empty string but execution was
still attempted.

**Fix:**
- Added an early-exit guard: if the generated code is empty (or whitespace
  only), show a `showErrorMessage` dialog instead of attempting execution.
- Added a `hasNoKernel` guard with a user-facing dialog.
- Replaced `console.error` with `showErrorMessage('Execution error', ...)` so
  failures surface in the UI.

---

## 10. Display table block — new feature

Added a `display table` terminal block to the Transform category that calls
IPython's `display(_df)`, rendering the full HTML representation of the
current DataFrame in the JupyterLab output area.

Implementation touched three files:
- `packages/tidyblocks/src/blocks/transform.ts` — block definition (terminal:
  has `previousStatement` only, no `nextStatement`).
- `packages/tidyblocks/src/generators/python/transform.ts` — generator
  returning `display(_df)\n`.
- `packages/tidyblocks/src/toolbox.ts` — added to the Transform category.

---

## 11. npm migration

**Problem:** The project used Yarn 4 (`packageManager: "yarn@4.6.0"`) but a
stray `package-lock.json` and npm-installed `node_modules` had accumulated
alongside it, creating an inconsistent state.

**What was done:**
- Removed `packageManager: "yarn@4.6.0"` and replaced with `"npm@11.1.0"`.
- Converted `"resolutions"` → `"overrides"` (npm 8.3+ equivalent).
- Converted `"workspaces"` from Yarn's `{ "packages": [...] }` object form to
  npm's array form `["packages/*"]`.
- Replaced all `jlpm` references in `packages/blocks-extension/package.json`
  scripts with `npm run`.
- Replaced `jlpm` references in root `lint` / `prettier` scripts with
  `npm run`.
- Added `.yarnrc.yml` with `nodeLinker: node-modules` for compatibility with
  `@jupyterlab/builder`'s bundled `jlpm` shim during extension builds.
- Updated `.gitignore` to exclude `node_modules/`, `package-lock.json`, and
  `yarn.lock` (the last is a build side-effect from `@jupyterlab/builder`'s
  bundled `jlpm`, which cannot be avoided).

**Note:** `jlpm` (a yarn shim bundled inside the `jupyterlab` Python package)
is called internally by `jupyter labextension build` and will always
regenerate `yarn.lock` during a build. This is an implementation detail of
`@jupyterlab/builder` that cannot be configured away; the file is gitignored.

---

## 12. dplyr alignment and new blocks

**Motivation:** dplyr (R tidyverse) is the reference vocabulary for tidy-data
analysis. Aligning block names to dplyr verbs makes the extension more
intuitive for data scientists familiar with either R or the tidy-data
paradigm.

### Renames (7 blocks)

| Old block label | New block label | dplyr verb |
|---|---|---|
| `create column` | `mutate` | `mutate()` |
| `sort by` | `arrange by` | `arrange()` |
| `unique by` | `distinct by` | `distinct()` |
| `first N rows` | `slice_head N rows` | `slice_head()` |
| `last N rows` | `slice_tail N rows` | `slice_tail()` |
| `sample N rows` | `slice_sample N rows` | `slice_sample()` |
| `glue with` | `bind_rows with` | `bind_rows()` |

Internal block type names were updated to match
(e.g. `tidyblocks_transform_create` → `tidyblocks_transform_mutate`).

### New blocks (10 blocks)

**Transform**
- `count by cols` — `count()`: count rows per combination of columns
- `relocate cols before/after anchor` — `relocate()`: move columns to a new position
- `slice_min N rows by col` — `slice_min()`: keep N rows with smallest values
- `slice_max N rows by col` — `slice_max()`: keep N rows with largest values

**Combine**
- `semi join` — `semi_join()`: filtering join, keep matched rows (no new columns)
- `anti join` — `anti_join()`: filtering join, keep unmatched rows
- `bind_cols with` — `bind_cols()`: horizontally bind two DataFrames by column position

**Operations**
- `between left and right` — `between()`: inclusive range check
- `coalesce val with replacement` — `coalesce()`: first non-missing value
- `n_distinct val` — `n_distinct()`: count unique values

Also added `n distinct` as an option to the **summarize** block's function dropdown.

---

## 13. Monorepo restructure

**Motivation:** The original repo had a single Python package (`jupyter_tidyblocks`)
that bundled both the generic Blockly editor and the tidy-data blocks. Splitting
into two independently installable packages lets users adopt the core editor
without the tidy-data layer, and lets third parties add their own block sets.

### Package layout (before → after)

| Before | After |
|---|---|
| `packages/blockly/` (`jupyter-tidyblocks`) | `packages/blocks/` (`jupyter-blocks`) — core lib |
| `packages/blockly-extension/` (`jupyter-tidyblocks-extension`) | `packages/blocks-extension/` (`jupyter-blocks-extension`) — core JupyterLab plugin |
| `packages/tidyblocks/` (`jupyter-tidyblocks-blocks`) | `packages/tidyblocks/` (`jupyter-tidyblocks`) — tidy-data blocks/generators |
| *(none)* | `packages/tidyblocks-extension/` (`jupyter-tidyblocks-extension`) — thin wiring plugin |
| `pyproject.toml` (root) | `jupyter_tidyblocks/pyproject.toml` |
| *(none)* | `jupyter_blocks/pyproject.toml` |

### Key changes

- Token ID: `'jupyterlab-blockly/registry'` → `'jupyter-blocks/registry'`
- Plugin ID: `'jupyterlab-blockly:plugin'` → `'jupyter-blocks:plugin'`
- File extension: `.jpblockly` → `.jblk`
- `@jupyterlab/*` and `@lumino/*` moved from `dependencies` to
  `peerDependencies` in `packages/blocks/package.json` (correct pattern for
  JupyterLab extension libraries — all are externalized in the Vite build).
- Example files consolidated from `docs/` into `examples/` and renamed to
  `.jblk`.
- `docs/conf.py` updated: `jupyterlite_dir = "../examples"`.
- `scripts/bump-version.py` rewritten: removed Lerna, now uses
  `packaging.version.Version` and updates all five `package.json` files
  directly.

### npm deprecation warning fix

An orphaned `packages/blocks/node_modules/@jupyterlab/coreutils@5.6.8`
entry (a stale artifact of the old `^5.6` constraint) caused a
`crypto@1.0.1` deprecation warning on every clean `npm install`. Fixes:

1. Stale entries removed from `package-lock.json`.
2. Versioned override `"@jupyterlab/coreutils@<6": "6.5.6"` added to root
   `package.json` overrides to prevent any future `5.x` install.
3. `postinstall` cleanup script added as defense-in-depth.

---

## 14. Documentation

| Document | Description |
|---|---|
| `docs/getting-started.md` | Step-by-step guide: install, launch JupyterLab, create a `.jblk` file, build a penguins pipeline, run it, and see output. |
| `docs/modernization-plan.md` | Updated to reflect completed phases, corrected version numbers (JupyterLab 4.5), and added a new Phase 6 documenting all the fixes in this work. |
| `docs/architecture.md` | Full architecture reference: four-package layout, data-flow diagram, object relationships, block pipeline conventions, code generation pattern, and extension points. |
| `docs/blocks-reference.md` | Complete block reference: every block organized by category, with its block type name, dplyr equivalent, description, and generated Python. |
| `docs/installation.md` | Two-package install instructions with conda environment setup. |
| `CHANGELOG.md` | Rewrote the `0.1.0` entry with accurate versions and full sections covering all new features, the rebrand, dependency upgrades, build fixes, bug fixes, and docs. |

---

## 15. Deferred / Future Work

The following features from the original
[tidyblocks](https://github.com/gvwilson/tidyblocks) project were
intentionally not ported in v0.1.0. They remain candidates for future
releases.

### Data source blocks

| Block | Reason deferred |
|---|---|
| `data_phish` (Phish concert data) | Domain-specific; low priority |
| `data_spotify` (Spotify song data) | Licensing unclear |
| `data_json` | Low priority for v0.1.0 |
| `data_clipboard` | Low priority for v0.1.0 |

### Transform blocks

| Block | Notes |
|---|---|
| `pivot` (long → wide) | `df.pivot_table(...)` |
| `melt` (wide → long) | `pd.melt(df, ...)` |

### Statistics blocks

| Block | Notes |
|---|---|
| One-way ANOVA | `scipy.stats.f_oneway(*groups)` |
| Simple linear regression | `sklearn.linear_model.LinearRegression` |

### Infrastructure

| Feature | Notes |
|---|---|
| Multi-language block labels | Defer to a later release; use JupyterLab's i18n infrastructure |
| JavaScript/Lua generators for tidy blocks | Initial focus is Python/pandas |
| Upgrade to `@jupyterlab/builder@^4.6` (Rspack) | Wait for JupyterLab 4.6 stable release |
