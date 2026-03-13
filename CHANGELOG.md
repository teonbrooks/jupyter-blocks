# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## 0.1.0

First release of **jupyter-tidyblocks**, forked from [QuantStack/jupyterlab-blockly](https://github.com/QuantStack/jupyterlab-blockly) v0.3.3.
Inspired by [Greg Wilson's tidyblocks](https://github.com/gvwilson/tidyblocks).

### New features

- **`packages/tidyblocks`**: new monorepo package providing 50+ tidy-data analysis blocks organized into seven categories — Data, Transform, Combine, Plot, Stats, Value, and Op — with Python (pandas / plotly.express / scipy / sklearn) code generators
- Exports `registerTidyblocks(registry)` for registering all blocks and the Tidy Data toolbox with any `IBlocklyRegistry` instance

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

### Docs

- `docs/jupyterlab-blockly_architecture.md`: full architecture document (refers to the upstream project as `jupyterlab-blockly`)
- `docs/tidyblocks-features.md`: feature inventory and port plan from gvwilson/tidyblocks
- `docs/modernization-plan.md`: full modernization plan with phase-by-phase status
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
