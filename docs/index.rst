.. jupyter-tidyblocks documentation master file

Welcome to jupyter-tidyblocks!
================================

jupyter-tidyblocks is a JupyterLab extension for tidy data analysis using drag-and-drop Blockly blocks.
Build data pipelines visually — filter, group, summarize, plot — and see the generated Python code execute live in your kernel.

The extension uses `Blockly <https://developers.google.com/blockly>`_, an open source library designed by Google.
It is inspired by `tidyblocks <https://github.com/gvwilson/tidyblocks>`_ by Greg Wilson, a block-based tool for tidy data analysis,
and is a fork of `jupyterlab-blockly <https://github.com/QuantStack/jupyterlab-blockly>`_ by QuantStack.

.. image:: _static/OverviewBlockly.gif
   :alt: Functionality of extension

Try it directly in your browser using JupyterLite!

.. jupyterlite:: example.jpblockly
   :width: 100%
   :height: 600px

.. toctree::
   :maxdepth: 2
   :caption: Getting Started:

   installation
   getting-started

.. toctree::
   :maxdepth: 2
   :caption: Usage:

   blockly_files
   blockly_editor
   kernels
   toolbox
   jupyterlab_integration
   examples

.. toctree::
   :maxdepth: 2
   :caption: Block Reference:

   blocks-reference

.. toctree::
   :maxdepth: 2
   :caption: Extending:

   other_extensions
   custom-blocks

.. toctree::
   :maxdepth: 2
   :caption: Project:

   architecture
   jupyter-tidyblocks-features
   modernization-plan
   work-summary

.. toctree::
   :maxdepth: 1
   :caption: Inspirations:

   inspirations/tidyblocks-features
   inspirations/jupyterlab-blockly_architecture

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
