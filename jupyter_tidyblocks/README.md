# jupyter-blocks

[![Github Actions Status](https://github.com/teonbrooks/jupyter-blocks/actions/workflows/build.yml/badge.svg)](https://github.com/teonbrooks/jupyter-blocks/actions/workflows/build.yml)

A monorepo containing two independently installable JupyterLab extensions:

- **`jupyter-blocks`** — a generic [Google Blockly](https://developers.google.com/blockly) editor for JupyterLab.  Opens `.jblk` files, runs the generated code in a kernel, and exposes `IBlocklyRegistry` so other extensions can add their own toolboxes, blocks, and generators.

- **`jupyter-tidyblocks`** — a tidy-data analysis layer on top of `jupyter-blocks`.  Inspired by [Greg Wilson's tidyblocks](https://github.com/gvwilson/tidyblocks) and originally built on [QuantStack/jupyterlab-blockly](https://github.com/QuantStack/jupyterlab-blockly).  Provides drag-and-drop pandas pipelines (filter, select, group, join, plot, …) that generate executable Python.

## Install

### Tidy-data analysis (installs both packages)

```bash
pip install jupyter-tidyblocks
```

or via conda-forge (once published):

```bash
conda install -c conda-forge jupyter-tidyblocks
```

### Generic Blockly editor only

```bash
pip install jupyter-blocks
```

### Supported kernels

- ipykernel (Python)
- xeus-python
- xeus-lua
- [ijavascript](https://github.com/n-riesco/ijavascript#installation)
- [tslab](https://github.com/yunabe/tslab)

## Uninstall

```bash
pip uninstall jupyter-tidyblocks   # also removes jupyter-blocks if unused
pip uninstall jupyter-blocks
```

## Contributing

### Development install

```bash
conda create -n blocks -c conda-forge python nodejs pre-commit jupyterlab ipykernel
conda activate blocks

git clone https://github.com/teonbrooks/jupyter-blocks
cd jupyter-blocks

pre-commit install
npm install
npm run build

# Install Python packages in editable mode
pip install -e ./jupyter_blocks
pip install -e ./jupyter_tidyblocks

# Register labextensions for development
jupyter labextension develop ./jupyter_blocks --overwrite
jupyter labextension develop ./jupyter_tidyblocks --overwrite
```

Watch mode (two terminals):

```bash
# Terminal 1 — rebuild on source changes
npm run watch

# Terminal 2 — run JupyterLab
jupyter lab
```

### Development uninstall

```bash
pip uninstall jupyter-tidyblocks jupyter-blocks
```

Remove the symlinks created by `jupyter labextension develop`:

```bash
jupyter labextension list   # find labextensions folder
# remove jupyter-blocks-extension and jupyter-tidyblocks-extension symlinks
```

### Packaging

See [RELEASE.md](RELEASE.md).
