#!/usr/bin/env bash
# Local build script — mirrors the publish-dev.yml workflow steps.
# Run from the repo root: bash scripts/build-local.sh
set -euxo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# 1. Install Python dependencies
pip install -U "jupyterlab>=4.0.0,<5" build

# 2. Install JS dependencies
npm install

# 3. Copy package.json as a real file so hatch can find it inside the sdist.
#    LICENSE and README.md are now real committed files (not symlinks).
#    Remove symlinks first so cp doesn't complain about identical source/dest.
rm -f jupyter_blocks/package.json jupyter_tidyblocks/package.json
cp packages/blocks-extension/package.json jupyter_blocks/package.json
cp packages/tidyblocks-extension/package.json jupyter_tidyblocks/package.json

# 4. Build JS (produces labextension artifacts used by hatch-jupyter-builder)
npm run build:prod

# 5. Build Python packages (--wheel builds directly from source, avoiding the
#    sdist-then-wheel flow which breaks on symlinks in the extracted temp dir)
python -m build --wheel jupyter_blocks/
python -m build --wheel jupyter_tidyblocks/

echo ""
echo "Build complete. Artifacts:"
ls jupyter_blocks/dist/
ls jupyter_tidyblocks/dist/

# 6. Restore package.json symlinks
ln -sf ../packages/blocks-extension/package.json jupyter_blocks/package.json
ln -sf ../packages/tidyblocks-extension/package.json jupyter_tidyblocks/package.json

echo "Symlinks restored."
