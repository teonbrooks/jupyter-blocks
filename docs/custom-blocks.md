# Adding Custom Blocks

This guide walks you through adding a new block to jupyter-tidyblocks from scratch.
By the end you will have a working block that appears in the toolbox, can be dragged
onto the canvas, and generates executable Python code.

We will build a concrete example: a **`normalize` block** that scales a numeric
column to the 0–1 range using pandas `min-max` normalization.

---

## Overview

Every block requires three things:

1. **Block shape** — the visual appearance and inputs, defined in
   `packages/tidyblocks/src/blocks/`.
2. **Python generator** — a function that converts the block to Python code, defined
   in `packages/tidyblocks/src/generators/python/`.
3. **Toolbox entry** — so the block appears in the sidebar panel, defined in
   `packages/tidyblocks/src/toolbox.ts`.

Optionally, if the block needs a Python import (e.g. `import scipy`), you also set
a **`toplevel_init`** string on the block.

---

## Step 1 — Define the block shape

Block shapes live in `packages/tidyblocks/src/blocks/`. Each file in this directory
corresponds to a category. Our block is a transform operation, so open
`transform.ts`.

Add a new entry inside the `Blockly.defineBlocksWithJsonArray([...])` call:

```typescript
{
  // Type name must be unique across the whole Blockly registry.
  // Convention: tidyblocks_<category>_<verb>
  type: 'tidyblocks_transform_normalize',

  // message0 is the label text. %1 marks where a field or input goes.
  message0: 'normalize column %1',

  // args0 defines the inputs referenced in message0.
  // field_input is a plain text box. Other options: field_number,
  // field_dropdown, input_value (for connectable value blocks).
  args0: [
    { type: 'field_input', name: 'COLUMN', text: 'value' }
  ],

  // previousStatement/nextStatement make the block chainable.
  // Set both to null to allow connecting above and below.
  // Remove one to make the block a source (top) or terminal (bottom).
  previousStatement: null,
  nextStatement: null,

  // Colour should match the category. Transform blocks use #76AADB.
  colour: '#76AADB',

  tooltip: 'Scale a numeric column to the 0–1 range (min-max normalization).'
},
```

### Field types quick-reference

| Field type | When to use | Key properties |
|---|---|---|
| `field_input` | Free-text string (column name, label) | `name`, `text` (default) |
| `field_number` | Numeric value with optional min/max | `name`, `value`, `min`, `max`, `precision` |
| `field_dropdown` | Enumerated choice | `name`, `options: [['Label', 'VALUE'], ...]` |
| `input_value` | Connectable value block (expression) | `name`, `check` (e.g. `'Boolean'`) |

---

## Step 2 — Write the Python generator

Generators live in `packages/tidyblocks/src/generators/python/`. Open the file
matching your category (`transform.ts`).

Add a new `forBlock` entry:

```typescript
// dplyr: no direct equivalent — min-max scaling
pythonGenerator.forBlock['tidyblocks_transform_normalize'] = block => {
  const col = block.getFieldValue('COLUMN');
  return (
    `_df = _df.assign(**{'${col}': ` +
    `(_df['${col}'] - _df['${col}'].min()) / ` +
    `(_df['${col}'].max() - _df['${col}'].min())})\n`
  );
};
```

The generator receives the `block` object (and optionally a `generator` reference
for nested value blocks). It returns a **string of Python code** ending with `\n`.

### Reading block values

| Scenario | Code |
|---|---|
| Text / number field | `block.getFieldValue('FIELD_NAME')` |
| Connected value block | `generator.valueToCode(block, 'INPUT_NAME', Order.NONE)` |
| Dropdown field | `block.getFieldValue('FIELD_NAME')` — returns the option's `VALUE` string |

### The `_df` convention

All transform blocks read from `_df` and write back to `_df`. This is what makes
blocks chainable — each block in a stack operates on the DataFrame left by the block
above it. Source (data) blocks create `_df`; terminal blocks (display, plot, save)
consume it without writing it back.

---

## Step 3 — Add a `toplevel_init` (if needed)

If your block requires a Python import that isn't already guaranteed by the data
block's preamble (`pandas`, `numpy`, `seaborn`), attach a `toplevel_init` string
to the block after `defineBlocksWithJsonArray`:

```typescript
// Only needed if the block uses a library not covered by the data preamble.
// For example, if normalize used scipy:
Blockly.Blocks['tidyblocks_transform_normalize'].toplevel_init =
  'from sklearn.preprocessing import MinMaxScaler\n';
```

`BlocklyLayout.getBlocksToplevelInit()` collects all `toplevel_init` strings from
blocks currently on the canvas, deduplicates them, and prepends them to the generated
code before execution. This means the import is emitted exactly once regardless of
how many normalize blocks the user places.

Our normalize block only uses pandas, which is already imported by the data block's
preamble, so **no `toplevel_init` is needed here**.

---

## Step 4 — Add the block to the toolbox

Open `packages/tidyblocks/src/toolbox.ts` and find the `Transform` category.
Add an entry for the new block:

```typescript
{ kind: 'block', type: 'tidyblocks_transform_normalize' },
```

Place it near related blocks — for example, after `tidyblocks_transform_mutate`:

```typescript
{ kind: 'block', type: 'tidyblocks_transform_mutate' },
{ kind: 'block', type: 'tidyblocks_transform_normalize' },  // ← new
```

If you want to pre-populate a field value in the toolbox flyout (so dragging the
block onto the canvas gives a sensible default), use:

```typescript
{
  kind: 'block',
  type: 'tidyblocks_transform_normalize',
  fields: { COLUMN: 'value' }
},
```

---

## Step 5 — Build and verify

```bash
# Rebuild the extension
npm run build

# Start JupyterLab
jupyter lab
```

1. Open (or create) a `.jblk` file.
2. Select the **Tidy Data** toolbox from the toolbar dropdown.
3. Expand the **Transform** category — your block should appear.
4. Drag a data block (e.g. penguins) onto the canvas, then chain the normalize block
   below it.
5. Click **Run** (▶). The output cell should show the DataFrame with the column
   scaled to 0–1.

---

## Complete worked example

Here is everything together for the normalize block.

**`packages/tidyblocks/src/blocks/transform.ts`** — inside `defineBlocksWithJsonArray`:

```typescript
{
  type: 'tidyblocks_transform_normalize',
  message0: 'normalize column %1',
  args0: [
    { type: 'field_input', name: 'COLUMN', text: 'value' }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: '#76AADB',
  tooltip: 'Scale a numeric column to the 0–1 range (min-max normalization).'
},
```

**`packages/tidyblocks/src/generators/python/transform.ts`**:

```typescript
pythonGenerator.forBlock['tidyblocks_transform_normalize'] = block => {
  const col = block.getFieldValue('COLUMN');
  return (
    `_df = _df.assign(**{'${col}': ` +
    `(_df['${col}'] - _df['${col}'].min()) / ` +
    `(_df['${col}'].max() - _df['${col}'].min())})\n`
  );
};
```

**`packages/tidyblocks/src/toolbox.ts`**:

```typescript
{ kind: 'block', type: 'tidyblocks_transform_normalize' },
```

---

## Adding a new category

If your blocks don't fit an existing category, create a new file in `blocks/` and
`generators/python/`, then:

1. Import both files in `packages/tidyblocks/src/index.ts` (the side-effect imports
   section at the top).
2. Add a new `{ kind: 'category', name: '...', colour: '...', contents: [...] }`
   object to `TIDYBLOCKS_TOOLBOX` in `toolbox.ts`.

Choose a color that contrasts with the existing categories:

| Category | Color |
|---|---|
| Data | `#FEBE4C` (amber) |
| Transform | `#76AADB` (blue) |
| Combine | `#808080` (grey) |
| Plot | `#A4C588` (green) |
| Stats | `#BA93DB` (purple) |
| Values | `#E7553C` (red-orange) |
| Operations | `#F9B5B2` (pink) |

---

## Extending from another JupyterLab plugin

You can add blocks from an entirely separate JupyterLab extension without modifying
this package. Declare `IBlocklyRegistry` as a `required` token in your plugin and
call the registry methods directly:

```typescript
import { IBlocklyRegistry } from 'jupyter-blocks';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

const myPlugin: JupyterFrontEndPlugin<void> = {
  id: 'my-extension:plugin',
  requires: [IBlocklyRegistry],
  activate: (app, registry: IBlocklyRegistry) => {
    // 1. Define the block shape
    registry.registerBlocks([{
      type: 'my_custom_block',
      message0: 'do something with %1',
      args0: [{ type: 'field_input', name: 'VALUE', text: 'x' }],
      previousStatement: null,
      nextStatement: null,
      colour: '#5BA65B',
      tooltip: 'My custom block.'
    }]);

    // 2. Register the Python generator
    pythonGenerator.forBlock['my_custom_block'] = block => {
      const val = block.getFieldValue('VALUE');
      return `_df = my_transform(_df, '${val}')\n`;
    };

    // 3. Push the enriched generator back into the registry
    registry.registerGenerator('python', pythonGenerator);

    // 4. Register a toolbox that includes the new block
    registry.registerToolbox('My Toolbox', {
      kind: 'categoryToolbox',
      contents: [{
        kind: 'category',
        name: 'Custom',
        colour: '#5BA65B',
        contents: [{ kind: 'block', type: 'my_custom_block' }]
      }]
    });
  }
};
```

> **Important:** Always call `registry.registerGenerator('python', pythonGenerator)`
> after attaching your `forBlock` handlers. This ensures the registry holds the
> same generator instance that knows about your new block type, guarding against
> webpack Module Federation resolving `blockly/python` to a different singleton
> in a separate bundle.
