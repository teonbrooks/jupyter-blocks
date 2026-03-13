import * as Blockly from 'blockly';

/**
 * Python preamble injected once at the top of the generated script whenever
 * any data-source block is present in the workspace.
 *
 * `BlocklyLayout.getBlocksToplevelInit()` collects `toplevel_init` strings
 * from every block type on the canvas (deduplicating across multiple blocks
 * of the same type) and prepends them to the generator output before
 * execution.  This ensures required libraries are always imported regardless
 * of which data block the user starts a pipeline with.
 */
const TOPLEVEL_INIT = `import pandas as pd
import numpy as np
import seaborn as sns
`;

// gapminder comes from plotly.express; needs its own preamble so that
// px.data is available even when no plot block is on the canvas.
const TOPLEVEL_INIT_PX = `import pandas as pd
import numpy as np
import plotly.express as px
`;

Blockly.defineBlocksWithJsonArray([
  {
    type: 'tidyblocks_data_colors',
    message0: 'colors dataset',
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Built-in dataset of 11 colors with RGB values.'
  },
  {
    type: 'tidyblocks_data_earthquakes',
    message0: 'earthquakes dataset',
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: '2016 earthquake data.'
  },
  {
    type: 'tidyblocks_data_penguins',
    message0: 'penguins dataset',
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Palmer penguins dataset (via seaborn).'
  },
  {
    type: 'tidyblocks_data_sequence',
    message0: 'sequence 1 to %1 as %2',
    args0: [
      { type: 'field_number', name: 'N', value: 10, min: 1, precision: 1 },
      { type: 'field_input', name: 'COLUMN', text: 'index' }
    ],
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Generate a numeric sequence 1..N into a named column.'
  },
  {
    type: 'tidyblocks_data_user',
    message0: 'dataset named %1',
    args0: [{ type: 'field_input', name: 'NAME', text: 'my_df' }],
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Reference a previously saved DataFrame by variable name.'
  },
  {
    type: 'tidyblocks_data_iris',
    message0: 'iris dataset',
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Classic Fisher iris dataset: sepal/petal measurements for 3 species (via seaborn).'
  },
  {
    type: 'tidyblocks_data_titanic',
    message0: 'titanic dataset',
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Titanic passenger survival dataset (via seaborn).'
  },
  {
    type: 'tidyblocks_data_gapminder',
    message0: 'gapminder dataset',
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Gapminder life expectancy / GDP dataset across countries and years (via plotly.express).'
  },
  {
    type: 'tidyblocks_data_csv',
    message0: 'read CSV %1',
    args0: [{ type: 'field_input', name: 'PATH', text: 'data.csv' }],
    nextStatement: null,
    colour: '#FEBE4C',
    tooltip: 'Load a CSV file into a DataFrame.'
  }
]);

// Attach the toplevel_init preamble to each data block type so that
// getBlocksToplevelInit() can collect it at code-generation time.
Blockly.Blocks['tidyblocks_data_colors'].toplevel_init = TOPLEVEL_INIT;
Blockly.Blocks['tidyblocks_data_earthquakes'].toplevel_init = TOPLEVEL_INIT;
Blockly.Blocks['tidyblocks_data_penguins'].toplevel_init = TOPLEVEL_INIT;
Blockly.Blocks['tidyblocks_data_sequence'].toplevel_init = TOPLEVEL_INIT;
Blockly.Blocks['tidyblocks_data_user'].toplevel_init = TOPLEVEL_INIT;
Blockly.Blocks['tidyblocks_data_iris'].toplevel_init = TOPLEVEL_INIT;
Blockly.Blocks['tidyblocks_data_titanic'].toplevel_init = TOPLEVEL_INIT;
Blockly.Blocks['tidyblocks_data_gapminder'].toplevel_init = TOPLEVEL_INIT_PX;
Blockly.Blocks['tidyblocks_data_csv'].toplevel_init = TOPLEVEL_INIT;
