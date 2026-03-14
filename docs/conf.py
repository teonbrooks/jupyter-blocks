# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))

# -- Project information -----------------------------------------------------

project = 'jupyter-blocks'
copyright = '2026, Teon L. Brooks'
author = 'Teon L. Brooks'

# The full version, including alpha/beta/rc tags
release = '0.1.0'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'myst_parser',
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'jupyterlite_sphinx',
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
html_theme = 'pydata_sphinx_theme'
html_theme_options = {
    'github_url': 'https://github.com/teonbrooks/jupyter-blocks',
    'use_edit_page_button': True,
    'icon_links': [
        {
            'name': 'PyPI',
            'url': 'https://pypi.org/project/jupyter-blocks',
            'icon': 'fa-solid fa-box',
        },
    ],
    'pygment_light_style': 'github-light',
    'pygment_dark_style': 'github-dark'
}
html_context = {
    'github_user': 'teonbrooks',
    'github_repo': 'jupyter-blocks',
    'github_version': 'main',
    'doc_path': 'docs',
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
# html_static_path = ['_static']

# Jupyterlite
jupyterlite_contents = ["example.jblk", "logic.jblk", "loops.jblk", "text_and_lists.jblk", "functions.jblk"]
jupyterlite_dir = "../examples"
