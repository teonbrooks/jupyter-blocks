# Changelog — jupyter-blocks

<!-- <START NEW CHANGELOG ENTRY> -->

## 0.1.0

Initial release of **jupyter-blocks**, extracted and generalized from
[QuantStack/jupyterlab-blockly](https://github.com/QuantStack/jupyterlab-blockly) v0.3.3.

### New features

- Blockly visual editor as a JupyterLab document editor for `.jblk` files
- Kernel-aware code execution: run generated code against any active Jupyter kernel
- Toolbar with toolbox selector and kernel selector
- `IBlocklyRegistry` token — other extensions can register custom toolboxes,
  blocks, and code generators without modifying this package
- JupyterLab theme integration (light / dark / custom)
- Internationalization support: block labels and workspace messages follow the
  active JupyterLab language

### Dependency upgrades

- **`@jupyterlab/*`**: `^4.2` → `^4.5` (latest stable: 4.5.6)
- **`blockly`**: `^11.0` → `^12.0` (updated serialization and generator API)
- **`@blockly/field-colour`**: `5.0.6` → `^6.0.0`
- **`react` / `react-dom`**: `^18.2` → `^19.0`
- **TypeScript**: `~5.0.2` → `~5.7`

### Build system

- **Vite** (library mode, ESM + CJS) replaces `tsc`-only build for the core
  library; output goes to `lib/` with full `.d.ts` declarations via `vite-plugin-dts`
- **Turborepo** replaces Lerna for monorepo task orchestration
- **ESLint v9 flat config**: `.eslintrc.js` + `.eslintignore` replaced with `eslint.config.js`
- All `@jupyterlab/*` and `@lumino/*` moved to `peerDependencies` in
  `packages/blocks/package.json` (correct pattern for JupyterLab extension libraries)

### Package manager

- Migrated from Yarn 4 to npm; `"resolutions"` → `"overrides"`; `jlpm`
  references replaced with `npm run` in all scripts
- Added `.yarnrc.yml` with `nodeLinker: node-modules` for compatibility with
  `@jupyterlab/builder`'s bundled `jlpm` shim during extension builds

### Bug fixes

- `packages/blocks/src/manager.ts`: `_onKernelChanged` parameter type corrected
  from `KernelConnection` (class) to `Kernel.IKernelConnection | null` (interface)
- `packages/blocks/src/registry.ts`: `case 'Sa' || 'Ar':` (always-truthy) split
  into `case 'Sa': case 'Ar':`
- `packages/blocks/src/widget.ts`: added missing `private _manager` field and
  `get manager()` getter to `BlocklyPanel`
- `packages/blocks-extension/src/index.ts`: added `as any` casts for `LabIcon`
  and `rendermime` arguments with minor type divergence across nested
  `@jupyterlab/*` installs
- Root `tsconfig.json`: added `"lib": ["ES2020", "DOM"]` to resolve
  `Intl.ResolvedRelativeTimeFormatOptions` error from `@jupyterlab/coreutils`
- Run button: added early-exit guard for empty workspaces and a `hasNoKernel`
  guard, both surfacing user-facing error dialogs instead of silent failures

<!-- <END NEW CHANGELOG ENTRY> -->

---

*Prior changelog entries below are from the upstream jupyterlab-blockly project.*

## 0.3.3

([Full Changelog](https://github.com/QuantStack/jupyterlab-blockly/compare/jupyterlab-blockly-extension@0.3.2...e9602251ec5a7ced9700b1f3a35d0a72b9550dc7))

### Bugs fixed

- Generate \_version.py at build time [#100](https://github.com/QuantStack/jupyterlab-blockly/pull/100) ([@martinRenou](https://github.com/martinRenou))
- Update Lite deployment [#90](https://github.com/QuantStack/jupyterlab-blockly/pull/90) ([@DenisaCG](https://github.com/DenisaCG))

### Documentation improvements

- Update docs [#99](https://github.com/QuantStack/jupyterlab-blockly/pull/99) ([@DenisaCG](https://github.com/DenisaCG))
- Update Lite deployment [#90](https://github.com/QuantStack/jupyterlab-blockly/pull/90) ([@DenisaCG](https://github.com/DenisaCG))
