# Making a new release

This monorepo contains two independently releasable Python packages:
- `jupyter-blocks` (from `jupyter_blocks/`)
- `jupyter-tidyblocks` (from `jupyter_tidyblocks/`)

Each can be published to PyPI and npm manually or via the [Jupyter Releaser](https://github.com/jupyter-server/jupyter_releaser).

## Manual release

### Bump the version

Use `hatch` to bump the version. By default this creates a tag.
See [hatch-nodejs-version](https://github.com/agoose77/hatch-nodejs-version#semver) for details.

```bash
# Bump jupyter-blocks
cd jupyter_blocks
hatch version <new-version>

# Bump jupyter-tidyblocks
cd ../jupyter_tidyblocks
hatch version <new-version>
```

### Build Python packages

Clean up development files first:

```bash
npm run clean:all
```

Then build each Python package:

```bash
# jupyter-blocks
cd jupyter_blocks
python -m build

# jupyter-tidyblocks
cd ../jupyter_tidyblocks
python -m build
```

Upload to PyPI:

```bash
twine upload jupyter_blocks/dist/*
twine upload jupyter_tidyblocks/dist/*
```

### NPM packages

```bash
cd packages/blocks && npm publish --access public
cd ../blocks-extension && npm publish --access public
cd ../tidyblocks && npm publish --access public
cd ../tidyblocks-extension && npm publish --access public
```

## Automated releases with Jupyter Releaser

The repository is compatible with the Jupyter Releaser.

Check the [workflow documentation](https://jupyter-releaser.readthedocs.io/en/latest/get_started/making_release_from_repo.html) for details.

Steps:
- Add `ADMIN_GITHUB_TOKEN` and `NPM_TOKEN` to GitHub Secrets
- Set up PyPI trusted publisher for both packages
- Run "Step 1: Prep Release" workflow
- Check the draft changelog
- Run "Step 2: Publish Release" workflow

## Publishing to conda-forge

Once packages are on PyPI, open a PR on the conda-forge feedstock repositories.
For new packages, see: https://conda-forge.org/docs/maintainer/adding_pkgs.html
