from pathlib import Path

try:
    from ._version import __version__
except ImportError:
    import warnings
    warnings.warn("Importing 'jupyter_blocks' outside a proper installation.")
    __version__ = "dev"

_HERE = Path(__file__).parents[2]


def _jupyter_labextension_paths():
    return [{
        "src": str(_HERE / "labextension"),
        "dest": "jupyter-blocks-extension"
    }]
