# Installation

## Requirements

- Python >= 3.8
- JupyterLab >= 4.5

## Install

### Tidy-data analysis (recommended — installs both packages)

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
pip uninstall jupyter-tidyblocks jupyter-blocks
```

## Development install

**Note:** You will need Node.js >= 18 to build the extension.

```bash
# Create and activate a conda environment
conda create -n blocks -c conda-forge python nodejs pre-commit jupyterlab ipykernel
conda activate blocks

# Clone the repo
git clone https://github.com/teonbrooks/jupyter-blocks
cd jupyter-blocks

# Install pre-commit hooks
pre-commit install

# Install npm packages and build
npm install
npm run build

# Install Python packages in editable mode
pip install -e ./jupyter_blocks
pip install -e ./jupyter_tidyblocks

# Register labextensions for development
jupyter labextension develop ./jupyter_blocks --overwrite
jupyter labextension develop ./jupyter_tidyblocks --overwrite
```

You can watch the source directory and run JupyterLab at the same time in
different terminals to watch for changes and automatically rebuild:

```bash
# Terminal 1 — rebuild on source changes
npm run watch

# Terminal 2 — run JupyterLab
jupyter lab
```

With the watch command running, every saved change will immediately be built
locally and available in your running JupyterLab. Refresh the browser to load
the change (you may need to wait several seconds for the rebuild to finish).

## Development uninstall

```bash
pip uninstall jupyter-tidyblocks jupyter-blocks
```

Remove the symlinks created by `jupyter labextension develop`:

```bash
jupyter labextension list   # find the labextensions folder
# remove jupyter-blocks-extension and jupyter-tidyblocks-extension symlinks
```
