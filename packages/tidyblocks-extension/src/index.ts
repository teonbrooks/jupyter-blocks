import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IBlocklyRegistry } from 'jupyter-blocks';
import { registerTidyblocks } from 'jupyter-tidyblocks';

/**
 * Initialization data for the jupyter-tidyblocks extension.
 *
 * This thin plugin wires the tidy-data block library into the running
 * `IBlocklyRegistry` provided by `jupyter-blocks-extension`.  It does
 * not create any UI of its own — it just calls `registerTidyblocks` once
 * during activation.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-tidyblocks:plugin',
  autoStart: true,
  requires: [IBlocklyRegistry],
  activate: (_app: JupyterFrontEnd, registry: IBlocklyRegistry): void => {
    registerTidyblocks(registry);
  }
};

export default plugin;
