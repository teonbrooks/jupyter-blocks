/**
 * jupyter-tidyblocks
 *
 * Tidy-data analysis blocks for jupyter-blocks, inspired by
 * Greg Wilson's tidyblocks (https://github.com/gvwilson/tidyblocks).
 *
 * This package is responsible for:
 *  1. Defining all visual block shapes (via `Blockly.defineBlocksWithJsonArray`)
 *     across seven categories: Data, Transform, Combine, Plot, Stats, Values, Ops.
 *  2. Registering Python code generators (`pythonGenerator.forBlock[...]`) that
 *     convert each block type into executable pandas / seaborn / plotly Python.
 *  3. Exporting `registerTidyblocks(registry)` — the single call that wires
 *     everything into a running `IBlocklyRegistry` from `jupyter-blocks`.
 *
 * Usage — call from a JupyterLab plugin activate function:
 *
 *   import { registerTidyblocks } from 'jupyter-tidyblocks';
 *
 *   activate(app, registry: IBlocklyRegistry) {
 *     registerTidyblocks(registry);
 *   }
 */

// ---------------------------------------------------------------------------
// Side-effectful block definition imports.
// Each file calls Blockly.defineBlocksWithJsonArray() to register its block
// shapes globally in Blockly.Blocks so they can be dragged from the toolbox.
// ---------------------------------------------------------------------------
import './blocks/data'; // Built-in datasets (penguins, earthquakes, …)
import './blocks/transform'; // DataFrame operations (filter, select, group, …)
import './blocks/combine'; // Multi-table ops (join, glue, cross-join)
import './blocks/plot'; // Visualisations (bar, scatter, histogram, …)
import './blocks/stats'; // Statistical tests and summaries
import './blocks/value'; // Literal values (column ref, number, text, …)
import './blocks/op'; // Expressions (arithmetic, compare, logic, …)

// ---------------------------------------------------------------------------
// Side-effectful Python generator imports.
// Each file assigns handler functions to pythonGenerator.forBlock[blockType]
// so that workspaceToCode() knows how to serialise each block to Python.
// ---------------------------------------------------------------------------
import './generators/python/index';

// ---------------------------------------------------------------------------
// Public exports
// ---------------------------------------------------------------------------

// Re-export the toolbox definition so host plugins can use it directly if
// they want to compose their own toolbox from it.
export { TIDYBLOCKS_TOOLBOX } from './toolbox';

import type { IBlocklyRegistry } from 'jupyter-blocks';
import { pythonGenerator } from 'blockly/python';
import { TIDYBLOCKS_TOOLBOX } from './toolbox';

/**
 * Register all tidyblocks blocks and the Python toolbox with the
 * `IBlocklyRegistry` provided by the `jupyter-tidyblocks` core extension.
 *
 * This is the primary entry point for host JupyterLab plugins. Call it once
 * during plugin activation, passing the registry token value.
 *
 * What this does:
 *  1. Adds a 'Tidy Data' toolbox to the registry so it appears in the
 *     toolbar dropdown of every open Blockly editor.
 *  2. Calls `registry.registerGenerator('python', pythonGenerator)` to
 *     ensure the registry holds the *same* `pythonGenerator` instance that
 *     already has all `tidyblocks_*` forBlock entries attached.  This guards
 *     against webpack Module Federation resolving `blockly/python` to a
 *     different singleton in different bundles.
 */
export function registerTidyblocks(registry: IBlocklyRegistry): void {
  registry.registerToolbox('Tidy Data', TIDYBLOCKS_TOOLBOX);

  // Explicitly push the tidyblocks-enriched pythonGenerator into the registry
  // so the workspace uses the instance that knows about all tidyblocks_* types.
  registry.registerGenerator('python', pythonGenerator);
}
