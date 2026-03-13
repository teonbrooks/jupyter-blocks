import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ISessionContext, showErrorMessage } from '@jupyterlab/apputils';
import { Cell, CodeCell, CodeCellModel } from '@jupyterlab/cells';
import { IEditorFactoryService } from '@jupyterlab/codeeditor';

import { Message } from '@lumino/messaging';
import { SplitLayout, SplitPanel, Widget } from '@lumino/widgets';
import { Signal } from '@lumino/signaling';

import * as Blockly from 'blockly';

import { BlocklyManager } from './manager';
import { THEME } from './utils';

/**
 * BlocklyLayout is the core visual container for a `.jpblockly` document.
 *
 * It is a `SplitLayout` (vertical) with two children:
 *  1. `_host` — a plain `Widget` whose DOM node is handed to `Blockly.inject`
 *     to mount the Blockly SVG workspace.
 *  2. `_cell` — a read-only `CodeCell` that shows the generated code and
 *     displays kernel execution output (tables, plots, etc.) below the
 *     Blockly canvas.
 *
 * Responsibility breakdown:
 *  - Injects and sizes the Blockly workspace on attach/resize.
 *  - Listens to workspace change events and re-generates source code into
 *    the code-preview cell on every block edit.
 *  - Implements `run()` which serialises the workspace, executes the code
 *    via the kernel, and surfaces errors through JupyterLab dialogs.
 *  - Serialises/deserialises the workspace JSON for document save/load.
 */
export class BlocklyLayout extends SplitLayout {
  // The DOM container that Blockly's SVG workspace is injected into.
  private _host: Widget;
  private _manager: BlocklyManager;
  // The live Blockly workspace (SVG-backed); created in onAfterAttach.
  private _workspace: Blockly.WorkspaceSvg;
  private _sessionContext: ISessionContext;
  // Read-only code cell that previews generated code and shows outputs.
  private _cell: CodeCell;

  /**
   * Construct a `BlocklyLayout`.
   *
   */
  constructor(
    manager: BlocklyManager,
    sessionContext: ISessionContext,
    rendermime: IRenderMimeRegistry,
    factoryService: IEditorFactoryService
  ) {
    super({ renderer: SplitPanel.defaultRenderer, orientation: 'vertical' });
    this._manager = manager;
    this._sessionContext = sessionContext;

    // Creating the container for the Blockly editor
    // and the output area to render the execution replies.
    this._host = new Widget();

    // Creating a CodeCell widget to render the code and
    // outputs from the execution reply.
    this._cell = new CodeCell({
      contentFactory: new Cell.ContentFactory({
        editorFactory: factoryService.newInlineEditor
      }),
      model: new CodeCellModel(),
      rendermime,
      placeholder: false
    }).initializeState();

    // Trust the outputs and set the mimeType for the code
    this._cell.addClass('jp-blockly-codeCell');
    this._cell.readOnly = true;
    this._cell.model.trusted = true;
    this._cell.model.mimeType = this._manager.mimeType;
    // adding the style to the element as a quick fix
    // we should make it work with the css class
    this._cell.node.style.overflow = 'scroll';

    this._manager.changed.connect(this._onManagerChanged, this);
  }

  /*
   * The code cell.
   */
  get cell(): CodeCell {
    return this._cell;
  }

  /*
   * The current workspace.
   */
  get workspace(): Blockly.Workspace {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Blockly.serialization.workspaces.save(this._workspace);
  }

  /*
   * Set a new workspace.
   */
  set workspace(workspace: Blockly.Workspace) {
    const data = workspace === null ? { variables: [] } : workspace;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Blockly.serialization.workspaces.load(data, this._workspace);
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    this._manager.changed.disconnect(this._resizeWorkspace, this);
    Signal.clearData(this);
    this._workspace.dispose();
    super.dispose();
  }

  /**
   * Init the blockly layout
   */
  init(): void {
    super.init();
    // Add the blockly container into the DOM
    this.addWidget(this._host);
    this.addWidget(this._cell);
  }

  /**
   * Create an iterator over the widgets in the layout.
   */
  iter(): IterableIterator<Widget> {
    return [][Symbol.iterator]();
  }

  /**
   * Remove a widget from the layout.
   *
   * @param widget - The `widget` to remove.
   */
  removeWidget(widget: Widget): void {
    return;
  }

  /**
   * Collect the `toplevel_init` strings defined on block types currently
   * present in the workspace and return them as a single deduplicated string.
   *
   * Block definitions may attach a `toplevel_init` property to declare
   * Python import statements (or other preamble code) required by that block
   * type.  For example:
   *
   *   Blockly.Blocks['tidyblocks_data_penguins'].toplevel_init =
   *     'import pandas as pd\nimport seaborn as sns\n';
   *
   * This method walks all blocks on the canvas, collects each unique
   * `toplevel_init` string exactly once (regardless of how many blocks of
   * that type appear), and concatenates them.  The result is prepended to
   * the generator output before execution so that required libraries are
   * always imported.
   */
  getBlocksToplevelInit(): string {
    const seen = new Set<string>();
    let finalToplevelInit = '';

    const used_blocks = this._workspace.getAllBlocks(true);
    for (const block of used_blocks) {
      const def = Blockly.Blocks[block.type];
      if (def?.toplevel_init && !seen.has(def.toplevel_init)) {
        seen.add(def.toplevel_init);
        finalToplevelInit += def.toplevel_init;
      }
    }
    return finalToplevelInit;
  }

  /*
   * Generates and runs the code from the current workspace.
   */
  run(): void {
    // Get extra code from the blocks in the workspace.
    const extra_init = this.getBlocksToplevelInit();
    // Serializing our workspace into the chosen language generator.
    const code =
      extra_init + this._manager.generator.workspaceToCode(this._workspace);
    this._cell.model.sharedModel.setSource(code);

    // Nothing to run if the workspace has no blocks.
    if (!code.trim()) {
      showErrorMessage(
        'No blocks',
        'Add blocks to the workspace before running.'
      );
      return;
    }

    // Execute the code using the kernel.
    if (this._sessionContext.hasNoKernel) {
      showErrorMessage(
        'No kernel',
        'Select a kernel from the dropdown in the toolbar before running.'
      );
    } else {
      CodeCell.execute(this._cell, this._sessionContext)
        .then(() => this._resizeWorkspace())
        .catch(e =>
          showErrorMessage('Execution error', String(e))
        );
    }
  }

  /**
   * Handle `update-request` messages sent to the widget.
   */
  protected onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);
    this._resizeWorkspace();
  }

  /**
   * Handle `resize-request` messages sent to the widget.
   */
  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this._resizeWorkspace();
  }

  /**
   * Handle `fit-request` messages sent to the widget.
   */
  protected onFitRequest(msg: Message): void {
    super.onFitRequest(msg);
    this._resizeWorkspace();
  }

  /**
   * Handle `after-attach` messages sent to the widget.
   *
   * This is the earliest point at which the host node is in the DOM, so
   * `Blockly.inject` must be called here (not in the constructor) to ensure
   * the SVG workspace is sized correctly.
   *
   * A workspace change listener keeps the code-preview cell in sync with the
   * canvas as the user drags, connects, and edits blocks.
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    // Inject Blockly into the host node with the JupyterLab-themed styles.
    this._workspace = Blockly.inject(this._host.node, {
      toolbox: this._manager.toolbox,
      theme: THEME
    });

    // Regenerate source code and update the preview cell on every workspace
    // change (block added, moved, connected, field edited, etc.).
    this._workspace.addChangeListener(() => {
      const extra_init = this.getBlocksToplevelInit();
      const code =
        extra_init + this._manager.generator.workspaceToCode(this._workspace);
      this._cell.model.sharedModel.setSource(code);
    });
  }

  private _resizeWorkspace(): void {
    //Resize logic.
    Blockly.svgResize(this._workspace);
  }

  private _onManagerChanged(
    sender: BlocklyManager,
    change: BlocklyManager.Change
  ) {
    if (change === 'kernel') {
      // Get extra code from the blocks in the workspace.
      const extra_init = this.getBlocksToplevelInit();
      // Serializing our workspace into the chosen language generator.
      const code =
        extra_init + this._manager.generator.workspaceToCode(this._workspace);
      this._cell.model.sharedModel.setSource(code);
      this._cell.model.mimeType = this._manager.mimeType;
    }
    if (change === 'toolbox') {
      this._workspace.updateToolbox(this._manager.toolbox as any);
    }
  }
}
