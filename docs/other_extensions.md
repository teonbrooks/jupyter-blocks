# Extending jupyter-tidyblocks

The `jupyter-tidyblocks` core extension exposes an `IBlocklyRegistry` token that
other JupyterLab plugins can use to register new blocks, toolboxes, and generators —
without modifying this repository.

For a complete step-by-step walkthrough of adding blocks and toolboxes, see
[**Adding Custom Blocks**](custom-blocks.md).

---

## Quick start

### 1. Create a new JupyterLab extension

Use the official copier template:

```bash
pip install copier jinja2-time
copier copy --trust https://github.com/jupyterlab/extension-template .
```

Fill in the prompts. You will mostly work in `src/index.ts`.

### 2. Add `jupyter-tidyblocks` as a dependency

```bash
npm install jupyter-tidyblocks
```

Add it to your extension's `package.json` dependencies and declare it as a
shared singleton in the `jupyterlab.sharedPackages` section so both your
extension and the core share the same registry instance:

```json
"jupyterlab": {
  "sharedPackages": {
    "jupyter-tidyblocks": {
      "bundled": false,
      "singleton": true
    }
  }
}
```

### 3. Use `IBlocklyRegistry` in your plugin

```typescript
// src/index.ts
import { IBlocklyRegistry } from 'jupyter-tidyblocks';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'my-extension:plugin',
  autoStart: true,
  requires: [IBlocklyRegistry],
  activate: (app, registry: IBlocklyRegistry) => {

    // Register block shape(s)
    registry.registerBlocks([{
      type: 'my_custom_block',
      message0: 'do something with %1',
      args0: [{ type: 'field_input', name: 'VALUE', text: 'x' }],
      previousStatement: null,
      nextStatement: null,
      colour: '#5BA65B',
      tooltip: 'My custom block.'
    }]);

    // Register the Python generator
    pythonGenerator.forBlock['my_custom_block'] = block => {
      const val = block.getFieldValue('VALUE');
      return `_df = my_transform(_df, '${val}')\n`;
    };

    // Push the enriched generator back into the registry
    registry.registerGenerator('python', pythonGenerator);

    // Register a toolbox containing the new block
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
> after attaching `forBlock` handlers. This guards against webpack Module Federation
> resolving `blockly/python` to a different singleton across bundles.

---

## `IBlocklyRegistry` API

| Method | Description |
|---|---|
| `registerBlocks(blocks)` | Register block shape definitions (same as `Blockly.defineBlocksWithJsonArray`) |
| `registerToolbox(name, toolbox)` | Add a named toolbox that appears in the editor toolbar dropdown |
| `registerGenerator(language, generator)` | Replace or add a code generator for a kernel language |
| `toolboxes` | Read-only `Map<string, ToolboxDefinition>` of all registered toolboxes |
| `generators` | Read-only `Map<string, Blockly.Generator>` of all registered generators |

---

## Add to `pyproject.toml`

Declare `jupyter-tidyblocks` as a Python dependency so pip installs it alongside
your extension:

```toml
[project]
dependencies = [
    "jupyter-tidyblocks>=0.1.0",
    # ... other dependencies
]
```
