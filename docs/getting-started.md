# Getting Started with jupyter-tidyblocks

This guide walks you through installing jupyter-tidyblocks, launching JupyterLab,
and building your first tidy data pipeline with drag-and-drop blocks.

---

## Requirements

| Requirement | Version |
|---|---|
| Python | >= 3.8 |
| JupyterLab | >= 4.5 |
| ipykernel | any recent version |

The Python libraries used by the generated code (pandas, seaborn, plotly, scipy,
scikit-learn, numpy) do not need to be installed before you start — the generated
code will import them at runtime. Install whichever you need:

```bash
pip install pandas seaborn plotly scipy scikit-learn numpy
```

---

## Installation

### From PyPI (once published)

```bash
pip install jupyter_tidyblocks
```

### From source (development install)

```bash
# 1. Clone the repository
git clone https://github.com/teonbrooks/jupyter-tidyblocks.git
cd jupyter-tidyblocks

# 2. Install Node.js dependencies and build the JS packages
# (requires Node >= 18 and yarn/jlpm)
jlpm install
jlpm build

# 3. Install the Python package in editable mode
pip install -e ".[dev]"

# 4. Verify the extension is registered
jupyter labextension list
```

You should see a line like:

```
jupyter-tidyblocks-extension v0.1.0  enabled  OK  (python, jupyter_tidyblocks)
```

---

## Launching JupyterLab

```bash
jupyter lab
```

JupyterLab opens in your browser. The Blockly editor will be available as a new
file type alongside notebooks and text files.

---

## Creating Your First Blockly File

There are three ways to create a new `.jpblockly` file:

**From the Launcher** (Home tab):
1. Click the **+** button to open the Launcher
2. Under the *Other* section, click **Blockly Editor**

**From the File Browser**:
1. Right-click in the file browser panel
2. Choose **New File** and name it with a `.jpblockly` extension

**From the Command Palette** (`Cmd+Shift+C` / `Ctrl+Shift+C`):
1. Type *Blockly* and select **New Blockly Editor**

The editor opens with two panels:

- **Left** — the block toolbox, organized into categories
- **Right** — the code preview and output area (the generated Python code updates live as you build)

---

## Choosing a Kernel

When the editor opens you will be prompted to select a kernel. Choose **Python 3
(ipykernel)**. The kernel is used to execute the generated code and display
output directly in the editor.

You can change or restart the kernel at any time from the **Kernel** menu at the
top of JupyterLab.

---

## Your First Pipeline: Penguins Dataset

This example loads the built-in penguins dataset, filters to one species, and
plots bill length vs. flipper length. All steps are drag-and-drop.

### Step 1 — Load data

1. In the toolbox, open the **Data** category (yellow/gold blocks).
2. Drag the **Penguins dataset** block onto the canvas.
   - This block has no left connector (it is a pipeline source).
   - Generated code: `_df = sns.load_dataset('penguins')`

### Step 2 — Filter rows

1. Open the **Transform** category (blue blocks).
2. Drag a **filter** block and snap it below the Penguins block.
3. Open the **Value** category (red/orange blocks).
4. Drag a **column** block into the *condition* slot of the filter block.
   - Set the column name to `species`.
5. Open the **Op** category (pink blocks).
6. Drag a **compare** block, set the operator to `==`.
7. Drag a **text** block into the right side of the compare block, type `Adelie`.
8. Snap the compare block into the filter condition slot.
   - Generated code: `_df = _df[_df['species'] == 'Adelie']`

### Step 3 — Plot

1. Open the **Plot** category (green blocks).
2. Drag a **scatter** block and snap it below the filter block.
   - Set **x** to `bill_length_mm` and **y** to `flipper_length_mm`.
   - Optionally set **color** to `sex`.
   - Generated code: `px.scatter(_df, x='bill_length_mm', y='flipper_length_mm', color='sex').show()`

### Step 4 — Run

Click the **▶ Run** button (or use `Shift+Enter`) to execute the generated Python
code. The scatter plot appears in the output area below the code preview.

---

## Saving Your Work

Blockly files are saved as JSON with the `.jpblockly` extension. Use
`Cmd+S` / `Ctrl+S` to save at any time. The workspace (block layout) and the
associated kernel state are preserved.

---

## Tidy Data Block Reference

| Category | Color | Purpose | Example blocks |
|---|---|---|---|
| **Data** | Gold | Load a dataset to start a pipeline | Penguins, Colors, CSV, Sequence, User variable |
| **Transform** | Blue | Reshape or filter `_df` | filter, select, groupby, summarize, sort, bin, sample |
| **Combine** | Grey | Merge two pipelines | join, glue (concat), cross_join |
| **Plot** | Green | Visualize and terminate a pipeline | scatter, bar, histogram, line, box, violin, heatmap |
| **Stats** | Purple | Statistical tests and summaries | t-test, k-means, correlation, describe |
| **Value** | Red | Produce a value (column ref, literal, distribution) | column, number, text, datetime, normal, uniform |
| **Op** | Pink | Transform a value | arithmetic, compare, logic, ifelse, string, shift |

> **Pipeline shape**: every pipeline starts with a **Data** block (no left
> connector), passes through zero or more **Transform** / **Combine** blocks
> (left+right connectors), and ends with a **Plot** or **Stats** block (left
> connector only). The running dataframe variable is always `_df`.

---

## Using Your Own Data

Use the **User variable** block (Data category) to reference a pandas DataFrame
you have already created in a notebook:

1. In a regular JupyterLab notebook, run:
   ```python
   import pandas as pd
   my_data = pd.read_csv('my_file.csv')
   ```
2. In the Blockly editor, drag a **User variable** block onto the canvas.
3. Set the variable name to `my_data`.

The generated code will be `_df = my_data.copy()` — it picks up the variable
from the shared kernel state.

---

## Troubleshooting

**The extension does not appear in the Launcher**

Run `jupyter labextension list` and confirm `jupyter-tidyblocks-extension` is
listed as `enabled OK`. If it shows a version conflict, ensure your JupyterLab
is >= 4.5:

```bash
jupyter lab --version   # should be >= 4.5.0
pip install "jupyterlab>=4.5,<5" --upgrade
```

**The kernel does not start**

Make sure `ipykernel` is installed in the same Python environment as JupyterLab:

```bash
pip install ipykernel
python -m ipykernel install --user
```

**`ModuleNotFoundError` when running blocks**

Install the required runtime libraries:

```bash
pip install pandas seaborn plotly scipy scikit-learn numpy
```

**Plots do not display**

Plotly requires the `jupyter-dash` renderer or the default JupyterLab renderer.
If `px.<chart>.show()` produces no output, run this in a notebook cell first:

```python
import plotly.io as pio
pio.renderers.default = 'jupyterlab'
```

---

## Developer Workflow

After making changes to the TypeScript source:

```bash
# Rebuild all packages
jlpm build

# Or watch for changes (rebuilds automatically, then refresh JupyterLab)
jlpm watch
```

To run unit tests:

```bash
jlpm test
```

To rebuild and reinstall the labextension into JupyterLab's static assets
(needed if you change the extension's Module Federation output):

```bash
jupyter labextension develop . --overwrite
```
