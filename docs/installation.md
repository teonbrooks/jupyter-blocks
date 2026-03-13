# Installation

## Requirements

- Python >= 3.8
- JupyterLab >= 4.5

## Install

```bash
pip install jupyter-tidyblocks
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

## Development install

**Note:** You will need Node.js >= 18 to build the extension.

```bash
# Create and activate a conda environment
micromamba create -n tidyblocks -c conda-forge python nodejs pre-commit jupyterlab ipykernel
micromamba activate tidyblocks

# Clone the repo
git clone https://github.com/teonbrooks/jupyter-tidyblocks
cd jupyter-tidyblocks

# Install pre-commit hooks
pre-commit install

# Install the Python package in editable mode and build the JS packages
pip install -e ".[dev]"
jupyter labextension develop . --overwrite
npm run build
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
pip uninstall jupyter-tidyblocks
```

Remove the symlink created by `jupyter labextension develop`:

```bash
jupyter labextension list   # find the labextensions folder
# remove the jupyter-tidyblocks-extension symlink from that folder
```
