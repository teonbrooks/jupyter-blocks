#############################################################################
# Copyright (c) 2024, Voila Contributors                                    #
# Copyright (c) 2024, QuantStack                                            #
# Copyright (c) 2026, Teon L. Brooks                                        #
#                                                                           #
# Distributed under the terms of the BSD 3-Clause License.                  #
#                                                                           #
# The full license is in the file LICENSE, distributed with this software.  #
#############################################################################

import json
from pathlib import Path

import click
from jupyter_releaser.util import run
from packaging.version import Version

# All package.json files whose "version" field must be kept in sync.
# The version source is the blocks-extension (the installable JupyterLab plugin).
HERE = Path(__file__).parents[1].resolve()

VERSION_SOURCE = HERE / "packages" / "blocks-extension" / "package.json"

PACKAGE_JSON_PATHS = [
    HERE / "package.json",
    HERE / "packages" / "blocks" / "package.json",
    HERE / "packages" / "blocks-extension" / "package.json",
    HERE / "packages" / "tidyblocks" / "package.json",
    HERE / "packages" / "tidyblocks-extension" / "package.json",
]


@click.command()
@click.option("--force", default=False, is_flag=True)
@click.argument("spec", nargs=1)
def bump(force, spec):
    status = run("git status --porcelain").strip()
    if len(status) > 0:
        raise Exception("Must be in a clean git state with no untracked files")

    with VERSION_SOURCE.open() as f:
        js_curr = json.load(f)["version"]
    # Convert JS semver to PEP 440: "0.1.0-alpha.1" → "0.1.0a1"
    import re
    py_curr = re.sub(r"-alpha\.(\d+)", r"a\1", js_curr)
    py_curr = re.sub(r"-beta\.(\d+)", r"b\1", py_curr)
    py_curr = re.sub(r"-rc\.(\d+)", r"rc\1", py_curr)
    curr = Version(py_curr)
    if spec == 'next':
        spec = f"{curr.major}.{curr.minor}."
        if curr.pre:
            p, x = curr.pre
            spec += f"{curr.micro}{p}{x + 1}"
        else:
            spec += f"{curr.micro + 1}"

    elif spec == 'patch':
        spec = f"{curr.major}.{curr.minor}."
        if curr.pre:
            spec += f"{curr.micro}"
        else:
            spec += f"{curr.micro + 1}"

    version = Version(spec)

    # Convert the Python version string to a JS-compatible semver string.
    # e.g. 0.1.0a1 → 0.1.0-alpha.1
    js_version = f"{version.major}.{version.minor}.{version.micro}"
    if version.pre:
        p, x = version.pre
        p = p.replace("a", "alpha").replace("b", "beta")
        js_version += f"-{p}.{x}"

    # Update all package.json files directly (no Lerna required).
    for path in PACKAGE_JSON_PATHS:
        if not path.exists():
            raise FileNotFoundError(f"package.json not found: {path}")
        with path.open() as f:
            data = json.load(f)
        data["version"] = js_version
        with path.open("w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")

    print(f"Bumped all packages to {js_version}")


if __name__ == "__main__":
    bump()
