# Toolbox

The toolbox is the panel on the left side of the Blockly editor. It contains all
available blocks organized into categories.

<p align="center">
  <img src="_static/toolboxView.gif" alt="Toolbox View"/>
</p>

## Tidy Data toolbox

When a `.jpblockly` file is opened with the **Tidy Data** toolbox selected (the
default), the sidebar shows seven categories:

| Category | Colour | Purpose |
|---|---|---|
| **Data** | Gold `#FEBE4C` | Source blocks that load a dataset into `_df` |
| **Transform** | Blue `#76AADB` | Row/column operations on `_df` |
| **Combine** | Grey `#808080` | Multi-table joins and stacks |
| **Plot** | Green `#A4C588` | Visualizations that render `_df` |
| **Stats** | Purple `#BA93DB` | Statistical tests and summaries |
| **Values** | Red `#E7553C` | Literal values and column references |
| **Operations** | Pink `#F9B5B2` | Expressions (arithmetic, logic, string, …) |

For a full list of every block in each category, see
[Block Reference](blocks-reference.md).

## Switching toolboxes

If another extension has registered an additional toolbox, you can switch to it
using the **Toolbox** dropdown in the editor toolbar (upper-right area of the
editor panel).

![Switch Toolbox](_static/toolboxSwitch.png)

## Adding your own toolbox

You can register a custom toolbox from a JupyterLab plugin using
`IBlocklyRegistry.registerToolbox(name, definition)`. Once registered it appears
automatically in the dropdown. See [Extending jupyter-tidyblocks](other_extensions.md)
and [Adding Custom Blocks](custom-blocks.md) for a full guide.
