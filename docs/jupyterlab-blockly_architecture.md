# jupyterlab-blockly Architecture

## Overview

jupyterlab-blockly is a JupyterLab extension that brings block-based visual programming directly into the Jupyter environment. It combines [Google Blockly](https://developers.google.com/blockly) for visual block composition with JupyterLab's kernel execution infrastructure, allowing users to build programs by dragging and connecting blocks that generate executable code.

The project is organized as a **Yarn Workspaces monorepo** containing two publishable npm packages and one Python package.

---

## Repository Layout

```
jupyterlab-blockly/
├── packages/
│   ├── blockly/                  # Core library (jupyterlab-blockly)
│   └── blockly-extension/        # JupyterLab plugin (jupyterlab-blockly-extension)
├── jupyterlab_blockly/           # Python package & compiled labextension output
├── docs/                         # Sphinx documentation (this directory)
├── examples/                     # Sample .jpblockly workspace files
├── binder/                       # Binder environment configuration
├── scripts/                      # Release / version-bump utilities
├── lerna.json                    # Monorepo orchestration
├── package.json                  # Root workspace & shared dev tooling
├── pyproject.toml                # Python package build config (hatchling)
└── tsconfig.json                 # Root TypeScript project references config
```

---

## Package Descriptions

### `packages/blockly` — Core Library

**npm name:** `jupyterlab-blockly`

The framework-agnostic core. It exposes the editor widget, the registry/extensibility API, the default toolbox definition, and the JupyterLab theme integration. Other JupyterLab extensions that want to embed a Blockly editor depend on this package.

| Module | Responsibility |
|---|---|
| `index.ts` | Public API re-exports |
| `widget.ts` | `BlocklyEditor` (DocumentWidget) and `BlocklyPanel` (SplitPanel content) |
| `factory.ts` | `BlocklyEditorFactory` — creates widget instances from `.jpblockly` files |
| `manager.ts` | `BlocklyManager` — per-document state: active toolbox, selected kernel/generator |
| `registry.ts` | `BlocklyRegistry` — registers toolboxes, block definitions, and code generators |
| `layout.ts` | `BlocklyLayout` — split-panel UI: Blockly workspace (left) + code output cell (right) |
| `token.ts` | `IBlocklyRegistry` — Lumino injection token for cross-plugin dependency injection |
| `utils.ts` | `TOOLBOX` default definition, `THEME` (JupyterLab CSS variable mapping) |
| `toolbar/` | React components: `SelectToolbox`, `SelectGenerator`, `BlocklyButton`, `Spacer` |

**Build:** TypeScript compiler (`tsc`) produces CommonJS output in `lib/`. CSS in `style/`.

---

### `packages/blockly-extension` — JupyterLab Extension Plugin

**npm name:** `jupyterlab-blockly-extension`

The JupyterLab plugin entry point. It activates the extension, wires everything into the JupyterLab shell, and provides `IBlocklyRegistry` as a service token for downstream extensions.

| Module | Responsibility |
|---|---|
| `index.ts` | Plugin activation: registers file type, commands, launcher tile, palette entries |
| `icons.ts` | Blockly icon definitions and SVG imports |
| `svg.d.ts` | TypeScript ambient declarations for SVG imports |

**Plugin activation contributions:**
- Registers `.jpblockly` MIME type and file type
- Creates `BlocklyEditorFactory` for the document registry
- Registers commands: create new file, interrupt/restart kernel, undo/redo blocks
- Adds launcher tile and command palette entries
- Handles locale/language switching
- Restores widget state across sessions (via `ILayoutRestorer`)

**Build:** `@jupyterlab/builder` (webpack-based) bundles the extension into the JupyterLab federated module system. Output goes to `jupyterlab_blockly/labextension/`.

---

### `jupyterlab_blockly` — Python Package

The Python distribution package. It contains:
- `__init__.py` with version and server-side shims
- `labextension/` — the compiled JS assets installed by `jupyter labextension install`

Built with [hatchling](https://hatch.pypa.io/) + `hatch-nodejs-version` (syncs Python version from `package.json`) + `hatch-jupyter-builder` (runs the JS build as part of the Python wheel build).

---

## Data & Execution Flow

```
User drags blocks
      │
      ▼
Blockly Workspace (DOM)
      │  workspace.addChangeListener()
      ▼
BlocklyLayout.onWorkspaceChanged()
      │  generator.workspaceToCode(workspace)
      ▼
Generated source code string
  (Python / JavaScript / Lua)
      │
      ▼
Code cell (read-only output panel)
      │  kernel.requestExecute({ code })
      ▼
JupyterLab Kernel (ipykernel / xeus / ijavascript)
      │
      ▼
Execution output displayed in output area
```

---

## Extensibility Model

jupyterlab-blockly is designed to be extended by third-party JupyterLab plugins via the `IBlocklyRegistry` token.

```typescript
// In a downstream JupyterLab plugin:
requires: [IBlocklyRegistry],
activate: (app, registry: IBlocklyRegistry) => {
  // Register a custom toolbox
  registry.addToolbox('My Data Toolbox', myToolboxDefinition);

  // Register custom block definitions
  registry.addBlock(myBlockDefinition);

  // Register a custom code generator for a block
  registry.addGenerator('my_block', pythonGenerator, myGeneratorFn);
}
```

**Registry capabilities:**
- `addToolbox(name, definition)` — register a named toolbox configuration
- `addBlock(definition)` — register a new Blockly block type
- `addGenerator(blockType, generator, fn)` — register a code generation function

---

## Supported Kernels & Generators

| Kernel | Identifier | Generator |
|---|---|---|
| ipykernel | `python3`, `python` | `blockly/python` |
| xeus-python | `xpython` | `blockly/python` |
| xeus-lua | `xlua` | `blockly/lua` |
| ijavascript | `javascript` | `blockly/javascript` |
| tslab | `jslab` | `blockly/javascript` |

---

## File Format

Workspace state is persisted as `.jpblockly` files — standard JSON containing the serialized Blockly workspace XML wrapped in a JSON envelope. These files can be committed to version control and reopened to restore the exact block arrangement.

---

## Dependency Graph

```
jupyterlab-blockly-extension
    ├── jupyterlab-blockly          (core library)
    │   ├── blockly ^11             (Google Blockly engine)
    │   ├── @blockly/field-colour   (colour picker field)
    │   ├── @jupyterlab/* ^4.2      (JupyterLab framework)
    │   ├── @lumino/*               (widget/signal infrastructure)
    │   └── react ^18               (toolbar UI components)
    └── @jupyterlab/builder ^4.2    (webpack-based extension bundler)

jupyterlab_blockly (Python)
    ├── jupyterlab >=4.0,<5
    └── jupyterlab-widgets ^3
```

---

## Build System

jupyterlab-blockly uses a **Lerna + Yarn Workspaces** monorepo:

1. `jlpm install` — installs all workspace dependencies
2. `lerna run build` — builds packages in dependency order:
   - `packages/blockly`: `tsc -b` → `lib/`
   - `packages/blockly-extension`: `tsc` + `jupyter labextension build` → `jupyterlab_blockly/labextension/`
3. `pip install -e .` — installs Python package in development mode, linking the compiled labextension

**CI:** GitHub Actions runs build + lint on push/PR. Release workflow publishes to npm and PyPI.
