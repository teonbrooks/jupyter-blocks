# jupyter-tidyblocks

[![Github Actions Status](https://github.com/teonbrooks/jupyter-tidyblocks/actions/workflows/build.yml/badge.svg)](https://github.com/teonbrooks/jupyter-tidyblocks/actions/workflows/build.yml)

Tidy data analysis with Blockly blocks for JupyterLab.

Drag and drop data-analysis blocks to build pipelines that generate executable Python code — powered by [Google Blockly](https://developers.google.com/blockly) and pandas.

Inspired by [Greg Wilson's tidyblocks](https://github.com/gvwilson/tidyblocks), a block-based tool for tidy data analysis.
Built on top of [QuantStack/jupyterlab-blockly](https://github.com/QuantStack/jupyterlab-blockly), a Blockly editor extension for JupyterLab.

## Features

- Visual block-based pipeline builder inside JupyterLab
- Tidy-data transform blocks: filter, select, group, summarize, join, and more
- Plot blocks (bar, scatter, histogram, …) via plotly.express
- Statistics blocks (t-test, k-means, …) via scipy/sklearn
- Multiple kernel support: Python, JavaScript, Lua
- Extensible via `IBlocklyRegistry` plugin token

## Requirements

- JupyterLab >= 4.5
- Python >= 3.8

## Install

```bash
pip install jupyter-tidyblocks
```

or via conda-forge (once published):

```bash
conda install -c conda-forge jupyter-tidyblocks
```

### Supported kernels

- ipykernel (Python)
- xeus-python
- xeus-lua
- [ijavascript](https://github.com/n-riesco/ijavascript#installation)
- [tslab](https://github.com/yunabe/tslab)

## Uninstall

```bash
pip uninstall jupyter-tidyblocks
```

## Contributing

### Development install

```bash
micromamba create -n tidyblocks -c conda-forge python nodejs pre-commit jupyterlab ipykernel
micromamba activate tidyblocks
git clone https://github.com/teonbrooks/jupyter-tidyblocks
cd jupyter-tidyblocks
pre-commit install
pip install -e ".[dev]"
jupyter labextension develop . --overwrite
jlpm build
```

Watch mode (two terminals):

```bash
# Terminal 1 — rebuild on source changes
jlpm watch

# Terminal 2 — run JupyterLab
jupyter lab
```

### Development uninstall

```bash
pip uninstall jupyter-tidyblocks
```

Remove the symlink created by `jupyter labextension develop`:

```bash
jupyter labextension list   # find labextensions folder
# remove jupyter-tidyblocks symlink from that folder
```

### Packaging

See [RELEASE.md](RELEASE.md).
