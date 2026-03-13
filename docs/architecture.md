# Architecture

jupyter-tidyblocks is a JupyterLab extension that gives users a visual,
drag-and-drop interface for tidy-data analysis.  Users compose pipelines by
snapping together coloured blocks (powered by [Blockly](https://developers.google.com/blockly));
the extension translates those blocks into pandas/seaborn/plotly Python and
executes the code against a live Jupyter kernel.

---

## Repository layout

```
jupyter-tidyblocks/          ← monorepo root (Yarn workspaces + Turborepo)
├── packages/
│   ├── blockly/             ← Package: jupyter-tidyblocks
│   │   └── src/             ← Core editor integration with JupyterLab
│   ├── tidyblocks/          ← Package: jupyter-tidyblocks-blocks
│   │   └── src/             ← Tidy-data block definitions + Python generators
│   └── blockly-extension/   ← Package: jupyter-tidyblocks-extension
│       └── src/             ← JupyterLab plugin entry point
├── jupyter_tidyblocks/      ← Python package (serves the labextension assets)
├── pyproject.toml           ← Python build config (hatchling)
├── package.json             ← Root monorepo config (Yarn workspaces)
└── turbo.json               ← Turborepo task pipeline
```

---

## Three-package design

The TypeScript side is intentionally split into three npm packages to keep
concerns separate and to allow third-party plugins to add their own block sets
without depending on `jupyter-tidyblocks-blocks`.

```
┌─────────────────────────────────────────────────────────────────────┐
│  jupyter-tidyblocks-extension  (blockly-extension/src/index.ts)     │
│  JupyterFrontEndPlugin — wires everything together at activation    │
│                                                                     │
│   ┌─────────────────────────────────┐   calls registerTidyblocks() │
│   │  jupyter-tidyblocks             │◄────────────────────────────┐ │
│   │  (blockly/src/)                 │                             │ │
│   │                                 │   jupyter-tidyblocks-blocks │ │
│   │  BlocklyEditorFactory           │   (tidyblocks/src/)         │ │
│   │  BlocklyRegistry                │                             │ │
│   │  BlocklyManager                 │   Block definitions         │ │
│   │  BlocklyLayout                  │   Python generators         │ │
│   │  BlocklyEditor / BlocklyPanel   │   TIDYBLOCKS_TOOLBOX        │ │
│   └─────────────────────────────────┘                             │ │
│                                     └───────────────────────────── ┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### `jupyter-tidyblocks` (core)

The shared library consumed by the extension and by any other plugin that
wants to extend the editor.  Contains:

| File | Role |
|---|---|
| `token.ts` | Defines the `IBlocklyRegistry` interface + Lumino `Token` |
| `registry.ts` | Concrete `BlocklyRegistry` — stores toolboxes and generators |
| `manager.ts` | Per-document `BlocklyManager` — tracks active toolbox & kernel |
| `factory.ts` | `BlocklyEditorFactory` — creates editor widgets for `.jpblockly` files |
| `layout.ts` | `BlocklyLayout` — injects Blockly, runs code, manages the split view |
| `widget.ts` | `BlocklyEditor` (DocumentWidget) + `BlocklyPanel` (SplitPanel) |
| `utils.ts` | JupyterLab-themed Blockly `THEME` + default `TOOLBOX` definition |

### `jupyter-tidyblocks-blocks` (domain blocks)

Self-contained package of tidy-data blocks.  Has no runtime dependency on
JupyterLab — it only needs `blockly` and `jupyter-tidyblocks` (type-only).

```
src/
├── blocks/          ← Visual block shape definitions (JSON via Blockly API)
│   ├── data.ts      ← Dataset sources (penguins, earthquakes, CSV, …)
│   ├── transform.ts ← DataFrame transforms (filter, select, group by, …)
│   ├── combine.ts   ← Multi-table ops (join, glue, cross join)
│   ├── plot.ts      ← Visualisations (bar, scatter, histogram, …)
│   ├── stats.ts     ← Statistical tests (t-test, k-means, correlation, …)
│   ├── value.ts     ← Literal values (column ref, number, text, datetime, …)
│   └── op.ts        ← Expressions (arithmetic, compare, logic, string, …)
├── generators/
│   └── python/      ← Python code generator for each block type
│       ├── index.ts ← Aggregates all generator registrations
│       ├── data.ts
│       ├── transform.ts
│       ├── combine.ts
│       ├── plot.ts
│       ├── stats.ts
│       ├── value.ts
│       └── op.ts
├── toolbox.ts       ← TIDYBLOCKS_TOOLBOX — category/block list for the sidebar
└── index.ts         ← Public entry point; exports registerTidyblocks()
```

### `jupyter-tidyblocks-extension` (JupyterLab plugin)

Thin entry-point package whose only job is:

1. Instantiate `BlocklyEditorFactory` and register it + the `.jpblockly`
   file type with JupyterLab's document registry.
2. Add the "New Blockly Editor" launcher / command-palette command.
3. Call `registerTidyblocks(registry)` to add the Tidy Data toolbox and
   Python generators.
4. Return the `IBlocklyRegistry` token so other plugins can extend the editor.

---

## Data flow: block canvas → kernel output

```
User drags/edits blocks on canvas
          │
          ▼
workspace.addChangeListener fires (layout.ts:221)
          │
          ▼
getBlocksToplevelInit()          ← collects 'import pandas as pd …' preamble
          +
generator.workspaceToCode()      ← translates each block to Python via
          │                         pythonGenerator.forBlock[blockType]
          ▼
cell.model.sharedModel.setSource(code)   ← updates code-preview cell live
          │
    (user clicks Run)
          ▼
CodeCell.execute(cell, sessionContext)   ← sends code to Jupyter kernel
          │
          ▼
Kernel output (stdout / rich display)
rendered in the CodeCell output area below the Blockly canvas
```

---

## Key objects and their relationships

```
BlocklyEditorFactory          (one per JupyterLab session)
  └── BlocklyRegistry         (shared across all open documents)
        ├── toolboxes: Map<string, ToolboxDefinition>
        │     ├── 'default'     ← Blockly built-in blocks
        │     └── 'Tidy Data'   ← registered by registerTidyblocks()
        └── generators: Map<string, Blockly.Generator>
              ├── 'python'      ← pythonGenerator with tidyblocks_* handlers
              ├── 'javascript'  ← javascriptGenerator
              └── 'lua'         ← luaGenerator

BlocklyPanel                  (one per open .jpblockly file)
  └── BlocklyLayout           (SplitLayout)
        ├── _host: Widget     ← DOM node Blockly.inject() mounts into
        ├── _cell: CodeCell   ← read-only preview + output area
        └── _manager: BlocklyManager
              ├── _toolbox: string   ← current toolbox key
              ├── _generator         ← active Blockly.Generator
              └── _sessionContext    ← kernel session for this document
```

---

## Block pipeline conventions

All tidyblocks block definitions follow a consistent connection pattern:

| Role | `previousStatement` | `nextStatement` | Examples |
|---|---|---|---|
| **Source** | — | `null` | `tidyblocks_data_penguins`, `read CSV` |
| **Transform** | `null` | `null` | `filter`, `select`, `group by` |
| **Terminal** | `null` | — | `display table`, all plot/stats blocks |

A pipeline must start with exactly one source block, chain zero or more
transform blocks, and end with a terminal block.  The Blockly connector
geometry enforces these rules visually.

---

## Python code generation pattern

Each block type maps to a snippet that reads/writes the `_df` variable:

```python
# Source block — creates _df
_df = sns.load_dataset('penguins')

# Transform blocks — mutate _df in place
_df = _df[_df['species'] == 'Adelie']
_df = _df[['bill_length_mm', 'bill_depth_mm', 'body_mass_g']]

# Terminal block — renders output
display(_df)
```

The full generated script is:

```
<toplevel_init preamble>     ← collected from block.toplevel_init properties
<block 1 code>
<block 2 code>
...
<terminal block code>
```

---

## Extension points

Third-party JupyterLab plugins can extend the editor by declaring a
dependency on the `IBlocklyRegistry` token:

```typescript
import { IBlocklyRegistry } from 'jupyter-tidyblocks';

const myPlugin: JupyterFrontEndPlugin<void> = {
  id: 'my-plugin',
  requires: [IBlocklyRegistry],
  activate: (app, registry: IBlocklyRegistry) => {
    // Add a new toolbox
    registry.registerToolbox('My Blocks', MY_TOOLBOX);

    // Register custom block definitions
    registry.registerBlocks([{ type: 'my_block', ... }]);

    // Register a custom generator
    registry.registerGenerator('python', myEnrichedPythonGenerator);
  }
};
```

---

## Build system

```
Turborepo (turbo.json)
  build task dependency: blockly → tidyblocks → blockly-extension
  │
  ├── jupyter-tidyblocks       → Vite (lib mode) → lib/index.mjs + .d.ts
  ├── jupyter-tidyblocks-blocks → Vite (lib mode) → lib/index.mjs + .d.ts
  └── jupyter-tidyblocks-extension → @jupyterlab/builder (webpack) →
          jupyter_tidyblocks/labextension/   ← served by the Python package

Python packaging (hatchling + hatch-jupyter-builder)
  builds the labextension assets as part of `pip install`
  installs into: {sys.prefix}/share/jupyter/labextensions/
                   jupyter-tidyblocks-extension/
```

---

## File format

`.jpblockly` files are plain JSON serialised by Blockly's built-in workspace
serialiser (`Blockly.serialization.workspaces.save/load`).  They store the
full workspace state: block types, positions, field values, and variable
definitions.  The format is human-readable and version-controlled friendly.
