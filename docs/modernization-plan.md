# jupyter-tidyblocks Modernization Plan

**Base project:** jupyterlab-blockly v0.3.3 (forked from QuantStack/jupyterlab-blockly)
**Target name:** jupyter-tidyblocks
**Target version:** 0.1.0

---

## Summary

This plan covers four areas of work:

1. Rename & rebrand the project to `jupyter-tidyblocks`
2. Update all dependencies to their latest versions
3. Modernize the build system: Vite for the core library, webpack (via `@jupyterlab/builder ^4.5`) for the extension until JupyterLab 4.6 stable, Turborepo for monorepo orchestration
4. Add a new `packages/tidyblocks` package with tidy-data analysis blocks

---

## Why Not Vite for the Extension?

`packages/blockly-extension` cannot use Vite as its bundler. JupyterLab extensions must be built as **webpack Module Federation containers** because:

- JupyterLab's bootstrap script loads extensions via script injection + `window._JUPYTERLAB['pkg-name']` access — it does not use ESM `import()`, so Vite's ESM-first output cannot be loaded
- The shared-scope protocol (how React, `@jupyterlab/*`, `@lumino/*` are shared across extensions without duplication) is a webpack/Rspack runtime implementation — Vite's federation plugins produce an incompatible wire format
- No public project has ever successfully built a JupyterLab 4.x extension with Vite; JupyterLab's team closed the "switch away from webpack" issue by merging Rspack instead

**The practical answer:** JupyterLab 4.6 (merged December 2025, PR #16005) already switched `@jupyterlab/builder` from webpack to **Rspack** internally — a Rust-based, webpack-API-compatible bundler that is ~5x faster. Upgrading `@jupyterlab/builder` to `^4.6` will give all the build performance benefits with zero code changes to the extension.

**Current status (as of v0.1.0):** JupyterLab `4.6` is still `4.6.0-alpha.4` on npm. All `@jupyterlab/*` packages are pinned to `^4.5` (latest stable: `4.5.6`). The upgrade to `^4.6` is deferred until 4.6.0 reaches a stable release.

**Vite is used** for `packages/blockly` (the standalone core library) and the new `packages/tidyblocks` package, where it is a natural fit (library mode, no module federation).

---

## Phase 1 — Rename & Rebrand ✅

**Status: Complete**

| File | Change |
|---|---|
| `package.json` (root) | `jupyterlab-blockly-root` → `jupyter-tidyblocks-root` |
| `packages/blockly/package.json` | `jupyterlab-blockly` → `jupyter-tidyblocks` |
| `packages/blockly-extension/package.json` | `jupyterlab-blockly-extension` → `jupyter-tidyblocks-extension` |
| All `package.json` | author → Teon L. Brooks, email → teon.brooks@gmail.com, URLs → `teonbrooks/jupyter-tidyblocks` |
| `pyproject.toml` | `jupyterlab_blockly` → `jupyter_tidyblocks`, URLs updated |
| `README.md` | Rewritten for new project name and scope |

---

## Phase 2 — Dependency Upgrades ✅

**Status: Complete**

### Root `package.json`

| Package | From | To | Status |
|---|---|---|---|
| `typescript` | `~5.0.2` | `~5.7` | ✅ |
| `prettier` | `^2.5.1` | `^3.4.0` | ✅ |
| `eslint` | `^8.9.0` | `^9.0.0` | ✅ |
| `@typescript-eslint/eslint-plugin` | `^5.12.1` | `^8.0.0` | ✅ |
| `@typescript-eslint/parser` | `^5.12.1` | `^8.0.0` | ✅ |
| `eslint-config-prettier` | `^8.4.0` | `^9.0.0` | ✅ |
| `eslint-plugin-prettier` | `^4.0.0` | `^5.0.0` | ✅ |
| `eslint-plugin-react` | `^7.30.0` | `^7.37.0` | ✅ |
| `lerna` | `^6.5.1` | **Removed** | ✅ (replaced by Turborepo) |
| `postinstall-postinstall` | `^2.1.0` | **Removed** | ✅ (no longer needed) |

### `packages/blockly/package.json`

| Package | From | To | Status |
|---|---|---|---|
| `@jupyterlab/*` | `^4.2` | `^4.5` (stable; `^4.6` when released) | ✅ |
| `blockly` | `^11.0` | `^12.0` | ✅ |
| `@blockly/field-colour` | `5.0.6` | `^6.0.0` | ✅ |
| `react` / `react-dom` | `^18.2` | `^19.0` | ✅ |
| `rimraf` | `^4.4.0` | `^6.0.0` | ✅ |
| `typescript` | `~5.0.2` | `~5.7` | ✅ |
| `@lumino/*` | various `^2.x` | latest `^2.x` | ✅ |

### `packages/blockly-extension/package.json`

| Package | From | To | Status |
|---|---|---|---|
| `@jupyterlab/*` | `^4.2` | `^4.5` (stable) | ✅ |
| `@jupyterlab/builder` | `^4.2.4` | `^4.5` (upgrade to `^4.6`/Rspack when stable) | ✅ |
| `source-map-loader` | `^5.0.0` | **Removed** | ✅ — no longer needed with updated builder |
| `webpackConfig` field | `./webpack.config.js` | **Removed** | ✅ |
| `webpack.config.js` | existed | **Deleted** | ✅ |
| `rimraf` | `^4.4.0` | `^6.0.0` | ✅ |
| `typescript` | `~5.0.2` | `~5.7` | ✅ |
| `npm-run-all` | `^4.1.5` | `npm-run-all2 ^7.0.0` | ✅ |

---

## Phase 3 — Build System Modernization ✅

### 3a. Monorepo: Lerna → Turborepo ✅

- ✅ Removed `lerna` from root `devDependencies`
- ✅ Deleted `lerna.json`
- ✅ Added `turbo ^2.0.0` to root `devDependencies`
- ✅ Created `turbo.json` with task pipeline (build, test, lint, watch, clean)
- ✅ Updated root `package.json` scripts to use `turbo run`

### 3b. Core Library: tsc → Vite Library Mode ✅

- ✅ Added `vite ^6.0.0`, `@vitejs/plugin-react ^4.0.0`, `vite-plugin-dts ^4.0.0` to `packages/blockly` devDependencies
- ✅ Created `packages/blockly/vite.config.ts` (ESM + CJS output, `outDir: 'lib'`, externals for all JupyterLab/Lumino/React deps)
- ✅ Updated `packages/blockly/package.json`: `main` → `lib/index.cjs`, added `module` → `lib/index.mjs`, added `exports` map, updated `scripts`
- ✅ Updated `files` glob to include `.cjs` and `.mjs`

### 3c. Extension: webpack cleanup (Rspack upgrade deferred to JupyterLab 4.6 stable) ✅

- ✅ Bumped `@jupyterlab/builder` to `^4.5`
- ✅ Deleted `webpack.config.js`
- ✅ Removed `webpackConfig` entry from `jupyterlab` field
- ✅ Removed `source-map-loader` from `devDependencies`
- ⏳ **Deferred**: upgrade to `@jupyterlab/builder ^4.6` (Rspack) once JupyterLab 4.6.0 reaches stable

### 3d. Testing: Add Vitest ✅

- ✅ Added `vitest ^3.0.0`, `@testing-library/react ^16.0.0`, `@testing-library/jest-dom ^6.0.0`, `jsdom ^25.0.0` to `packages/blockly` devDependencies
- ✅ Created `packages/blockly/vitest.config.ts`
- Test setup file `packages/blockly/src/test/setup.ts` to be created when writing first tests

### 3e. ESLint v9 Flat Config ✅

- ✅ Deleted `.eslintrc.js`
- ✅ Deleted `.eslintignore` (ignore patterns moved into `eslint.config.js`)
- ✅ Created root `eslint.config.js` with flat config (typescript-eslint v8, react plugin, prettier)

---

## Phase 4 — New Package: `packages/tidyblocks` ✅

**Status: Complete**

A new monorepo package providing tidy-data analysis blocks ported and extended from [gvwilson/tidyblocks](https://github.com/gvwilson/tidyblocks).

See [`tidyblocks-features.md`](tidyblocks-features.md) for the complete block-by-block specification.

**Built with Vite** (library mode, same setup as Phase 3b — no module federation needed).

### Package structure

```
packages/tidyblocks/
├── src/
│   ├── blocks/
│   │   ├── data.ts         # data_colors, data_penguins, data_sequence, data_user, data_csv …
│   │   ├── transform.ts    # filter, select, drop, create, sort, groupBy, summarize, running, bin …
│   │   ├── combine.ts      # join, glue, left_join, outer_join
│   │   ├── plot.ts         # bar, box, dot, histogram, scatter, line, heatmap, violin
│   │   ├── stats.ts        # ttest_one, ttest_two, k_means, silhouette, correlation, describe
│   │   ├── value.ts        # column, number, text, logical, datetime, missing, normal, uniform …
│   │   └── op.ts           # arithmetic, comparison, logic, type ops, datetime ops, shift, string
│   ├── generators/
│   │   └── python/         # pandas / plotly / scipy code generators per block category
│   ├── toolbox.ts          # Blockly toolbox definition (color-coded categories)
│   └── index.ts            # Public exports + IBlocklyRegistry self-registration
├── vite.config.ts
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

### Block inventory (all implemented in v0.1.0)

| Category | Blocks | Generator |
|---|---|---|
| **Data** | colors, earthquakes, penguins, sequence, user variable, CSV | `pandas` / `seaborn.load_dataset` |
| **Transform** | filter, select, drop, create, rename, sort, unique, groupby, ungroup, summarize, running, bin, saveas, fillna, dropna, sample, head, tail | `pandas` |
| **Combine** | join, glue, cross_join | `pd.merge` / `pd.concat` |
| **Plot** | bar, box, dot, histogram, scatter, line, violin, heatmap | `plotly.express` |
| **Stats** | ttest_one, ttest_two, kmeans, silhouette, correlation, describe | `scipy.stats` / `sklearn` |
| **Value** | column, number, text, logical, datetime, missing, normal, uniform, exponential | inline |
| **Op** | arithmetic, compare, logic, not, ifelse, typecheck, convert, datetime, shift, math, string, str_contains | inline |

### Implementation phases (future)

| Phase | Scope | Target |
|---|---|---|
| 4d | Extended blocks: pivot, melt, additional joins, additional string ops | v0.2.0 |
| 4e | JavaScript generators (observable/vega-lite) | v0.3.x |

---

## Phase 5 — Docs & Metadata Updates ✅

**Status: Complete**

- ✅ `docs/index.rst` — toctree updated to include `jupyterlab-blockly_architecture`, `tidyblocks-features`, `modernization-plan`
- ✅ `README.md` — rewritten for `jupyter-tidyblocks`
- ✅ `pyproject.toml` — project name → `jupyter_tidyblocks`, JupyterLab requirement → `>=4.0.0,<5`, install paths updated to `jupyter-tidyblocks-extension`
- ✅ `jupyter_tidyblocks/` — Python package directory renamed from `jupyterlab_blockly/`; `__init__.py` and `install.json` updated
- ✅ `CHANGELOG.md` — v0.1.0 entry documenting all changes from upstream

---

## Build System Summary (After Modernization)

| Package | Build tool | Status |
|---|---|---|
| `packages/blockly` | **Vite** library mode (`outDir: lib`) | ✅ done |
| `packages/blockly-extension` | **`@jupyterlab/builder ^4.5`** (webpack 5) | ✅ done |
| `packages/tidyblocks` | **Vite** library mode (`outDir: lib`) | ✅ done |
| Monorepo orchestration | **Turborepo** | ✅ done |
| Testing | **Vitest** | ✅ done (config); tests pending |
| Linting | **ESLint v9** flat config | ✅ done |
| JupyterLab extension installed | `jupyter-tidyblocks-extension v0.1.0` | ✅ enabled OK with JupyterLab 4.5.6 |

---

## Phase 6 — Build Fixes & Package Reconciliation ✅

**Status: Complete**

Resolved all TypeScript and packaging issues blocking a clean build across all three packages.

### TypeScript fixes (`packages/blockly`)

| File | Issue | Fix |
|---|---|---|
| `src/manager.ts` | `KernelConnection` (concrete class) used as `IChangedArgs` type param | Changed to `Kernel.IKernelConnection \| null` (interface) |
| `src/registry.ts:114` | `case 'Sa' \|\| 'Ar':` always evaluates to `'Sa'` (TS2872) | Split into `case 'Sa': case 'Ar':` |
| root `tsconfig.json` | `Intl.ResolvedRelativeTimeFormatOptions` missing (from `@jupyterlab/coreutils`) | Added `"lib": ["ES2020", "DOM"]` |

### TypeScript fixes (`packages/tidyblocks`)

| File | Issue | Fix |
|---|---|---|
| `src/generators/python/op.ts` | `Order.UNARY` does not exist in Blockly 12's Python `Order` enum | Replaced with `Order.NONE` |
| `src/index.ts` | Called `registry.addToolbox(...)` which doesn't exist on `IBlocklyRegistry` | Changed to `registry.registerToolbox(...)` |
| `src/index.ts` | `import { IBlocklyRegistry } from 'jupyter-tidyblocks'` fails at type-check time before core is built | Changed to `import type` (type-only import, erased at runtime) |

### Vite output directory

- Both `packages/blockly/vite.config.ts` and `packages/tidyblocks/vite.config.ts` were missing `outDir: 'lib'`
- Without it, Vite defaults to `dist/`, but `package.json` `main`/`module`/`types` fields all point to `lib/`
- Fixed by adding `build.outDir: 'lib'` to both configs

### Yarn dependency flattening

Multiple `@jupyterlab/*` packages were installed at conflicting nested paths (e.g. `@jupyterlab/ui-components` at both root and inside `@jupyterlab/apputils/node_modules/`), causing TypeScript structural type incompatibilities ("two instances of `LabIcon`"). Fixed by adding resolutions to root `package.json`:

```json
"@jupyterlab/application": "4.5.6",
"@jupyterlab/apputils": "4.5.6",
"@jupyterlab/services": "7.5.6"
```

Two remaining `as any` casts in `packages/blockly-extension/src/index.ts` (lines ~147, ~331, ~339) handle residual type conflicts from `@jupyter-widgets/jupyterlab-manager`'s own nested `@jupyterlab/rendermime` — structurally identical at runtime, incompatible to TypeScript across two filesystem paths.

### Python package rename

The Python module directory `jupyterlab_blockly/` was renamed to `jupyter_tidyblocks/` to match the `pyproject.toml` package name. Updated references in:
- `jupyter_tidyblocks/__init__.py`
- `install.json`
- `pyproject.toml` (all path references)
- `packages/blockly-extension/package.json` (`outputDir`)
- `turbo.json` (outputs glob)

---

## Out of Scope (This Plan)

- Replacing `@jupyterlab/builder` with a pure Vite bundler — not feasible without breaking JupyterLab module federation (see rationale at top)
- Multilingual block labels — defer to v0.3+
- JavaScript / Lua generators for tidy blocks — defer to v0.3.x
- Python backend / server-side components beyond what already exists
