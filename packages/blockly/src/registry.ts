import * as Blockly from 'blockly';

import { pythonGenerator } from 'blockly/python';
import { javascriptGenerator } from 'blockly/javascript';
import { luaGenerator } from 'blockly/lua';

import * as En from 'blockly/msg/en';

import { IBlocklyRegistry } from './token';
import { TOOLBOX } from './utils';
import type { ToolboxDefinition } from 'blockly/core/utils/toolbox';
import { BlockDefinition } from 'blockly/core/blocks';
import { installAllBlocks } from '@blockly/field-colour';

/**
 * BlocklyRegistry is the class that JupyterLab-Blockly exposes
 * to other plugins. This registry allows other plugins to register
 * new Toolboxes, Blocks and Generators that users can use in the
 * Blockly editor.
 *
 * One registry instance is created per `BlocklyEditorFactory` (i.e. shared
 * across all open `.jpblockly` documents in the same JupyterLab session).
 * External plugins — such as `jupyter-tidyblocks-blocks` — receive a
 * reference to this registry via the `IBlocklyRegistry` token and use it
 * to register additional toolboxes, block definitions, and generators.
 */
export class BlocklyRegistry implements IBlocklyRegistry {
  // Map of toolbox name → Blockly toolbox definition object.
  // Keyed by the human-readable label shown in the toolbar dropdown.
  private _toolboxes: Map<string, ToolboxDefinition>;
  // Map of kernel language name → Blockly code generator instance.
  // Keys match the `language` field reported by a Jupyter kernel spec
  // (e.g. 'python', 'javascript', 'lua').
  private _generators: Map<string, Blockly.Generator>;

  /**
   * Constructor of BlocklyRegistry.
   *
   * Seeds the registry with:
   *  - A 'default' toolbox containing Blockly's built-in block categories
   *    (Logic, Loops, Math, Text, Lists, Color, Variables, Functions).
   *  - Python, JavaScript, and Lua generators from Blockly core.
   *  - The `@blockly/field-colour` colour blocks wired up to all generators.
   */
  constructor() {
    this._toolboxes = new Map<string, ToolboxDefinition>();
    this._toolboxes.set('default', TOOLBOX);

    this._generators = new Map<string, Blockly.Generator>();
    this._generators.set('python', pythonGenerator);
    this._generators.set('javascript', javascriptGenerator);
    this._generators.set('lua', luaGenerator);

    // Register colour-picker blocks and their code generators for all
    // supported languages so colour blocks work out of the box.
    installAllBlocks({
      javascript: javascriptGenerator,
      python: pythonGenerator,
      lua: luaGenerator
    });
  }

  /**
   * Returns a map with all the toolboxes.
   */
  get toolboxes(): Map<string, ToolboxDefinition> {
    return this._toolboxes;
  }

  /**
   * Returns a map with all the generators.
   */
  get generators(): Map<string, Blockly.Generator> {
    return this._generators;
  }

  /**
   * Register a toolbox for the editor.
   *
   * @argument name The name of the toolbox.
   *
   * @argument toolbox The toolbox to register.
   */
  registerToolbox(name: string, toolbox: ToolboxDefinition): void {
    this._toolboxes.set(name, toolbox);
  }

  /**
   * Register block definitions.
   *
   * @argument blocks A list of block definitions to register.
   */
  registerBlocks(blocks: BlockDefinition[]): void {
    Blockly.defineBlocksWithJsonArray(blocks);
  }

  /**
   * Register a language generator.
   *
   * @argument language The language output by the generator.
   *
   * @argument generator The generator to register.
   *
   * #### Notes
   * If a generator already exists for the given language it is overwritten.
   */
  registerGenerator(language: string, generator: Blockly.Generator): void {
    this._generators.set(language, generator);
  }

  setlanguage(language: string): void {
    Private.importLanguageModule(language);
  }
}

namespace Private {
  /**
   * Dynamically import a Blockly locale message module and apply it.
   *
   * JupyterLab reports locale as a BCP-47 tag (e.g. 'fr_FR'). The manager
   * derives a two-letter key from the last two characters of that tag and
   * passes it here. We map that key to the correct Blockly `msg/*` bundle
   * and call `Blockly.setLocale` so block labels update immediately.
   *
   * Unrecognized languages fall back to English and emit a console warning.
   */
  export async function importLanguageModule(language: string) {
    let module: Promise<any>;
    switch (language) {
      case 'En':
        module = import('blockly/msg/en');
        break;
      case 'Es':
        module = import('blockly/msg/es');
        break;
      case 'Fr':
        module = import('blockly/msg/fr');
        break;
      case 'Sa':
      case 'Ar':
        module = import('blockly/msg/ar');
        break;
      case 'Cz':
        module = import('blockly/msg/cs');
        break;
      case 'Dk':
        module = import('blockly/msg/da');
        break;
      case 'De':
        module = import('blockly/msg/de');
        break;
      case 'Gr':
        module = import('blockly/msg/el');
        break;
      case 'Ee':
        module = import('blockly/msg/et');
        break;
      case 'Fi':
        module = import('blockly/msg/fi');
        break;
      case 'Il':
        module = import('blockly/msg/he');
        break;
      case 'Hu':
        module = import('blockly/msg/hu');
        break;
      case 'Am':
        module = import('blockly/msg/hy');
        break;
      case 'Id':
        module = import('blockly/msg/id');
        break;
      case 'It':
        module = import('blockly/msg/it');
        break;
      case 'Jp':
        module = import('blockly/msg/ja');
        break;
      case 'Kr':
        module = import('blockly/msg/ko');
        break;
      case 'Lt':
        module = import('blockly/msg/lt');
        break;
      case 'Nl':
        module = import('blockly/msg/nl');
        break;
      case 'Pl':
        module = import('blockly/msg/pl');
        break;
      case 'Br':
        module = import('blockly/msg/pt');
        break;
      case 'Ro':
        module = import('blockly/msg/ro');
        break;
      case 'Ru':
        module = import('blockly/msg/ru');
        break;
      case 'Lk':
        module = import('blockly/msg/si');
        break;
      case 'Tr':
        module = import('blockly/msg/tr');
        break;
      case 'Ua':
        module = import('blockly/msg/uk');
        break;
      case 'Vn':
        module = import('blockly/msg/vi');
        break;
      case 'Tw':
        module = import('blockly/msg/zh-hant');
        break;
      case 'Cn':
        module = import('blockly/msg/zh-hans');
        break;
      default:
        // Complete with all the cases taken from: (last updates June 2022)
        // List of languages in blockly: https://github.com/google/blockly/tree/master/msg/js
        // List of languages in Lab: https://github.com/jupyterlab/language-packs/tree/master/language-packs
        console.warn('Language not found. Loading english');
        module = Promise.resolve(En);
        break;
    }

    // Setting the current language in Blockly.
    module.then(lang => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Blockly.setLocale(lang);
    });
  }
}
