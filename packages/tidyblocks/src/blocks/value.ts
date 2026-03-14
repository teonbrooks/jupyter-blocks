import * as Blockly from 'blockly';

const NP_TOPLEVEL_INIT = `import numpy as np
`;

Blockly.defineBlocksWithJsonArray([
  {
    type: 'tidyblocks_value_column',
    message0: 'column %1',
    args0: [{ type: 'field_input', name: 'COLUMN', text: 'col1' }],
    output: null,
    colour: '#E7553C',
    tooltip: 'Reference a column by name.'
  },
  {
    type: 'tidyblocks_value_number',
    message0: '%1',
    args0: [{ type: 'field_number', name: 'VALUE', value: 0 }],
    output: 'Number',
    colour: '#E7553C',
    tooltip: 'A numeric literal.'
  },
  {
    type: 'tidyblocks_value_text',
    message0: '"%1"',
    args0: [{ type: 'field_input', name: 'VALUE', text: 'text' }],
    output: 'String',
    colour: '#E7553C',
    tooltip: 'A string literal.'
  },
  {
    type: 'tidyblocks_value_logical',
    message0: '%1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'VALUE',
        options: [
          ['true', 'True'],
          ['false', 'False']
        ]
      }
    ],
    output: 'Boolean',
    colour: '#E7553C',
    tooltip: 'A boolean literal.'
  },
  {
    type: 'tidyblocks_value_datetime',
    message0: 'date %1',
    args0: [{ type: 'field_input', name: 'VALUE', text: '2024-01-01' }],
    output: null,
    colour: '#E7553C',
    tooltip: 'A date/time constant (YYYY-MM-DD).'
  },
  {
    type: 'tidyblocks_value_missing',
    message0: 'missing',
    output: null,
    colour: '#E7553C',
    tooltip: 'An explicit missing (NA/NaN) value.'
  },
  {
    type: 'tidyblocks_value_normal',
    message0: 'Normal(mean %1 std %2)',
    args0: [
      { type: 'field_number', name: 'MEAN', value: 0 },
      { type: 'field_number', name: 'STD', value: 1, min: 0 }
    ],
    output: 'Number',
    colour: '#E7553C',
    tooltip: 'Random draw from Normal distribution.'
  },
  {
    type: 'tidyblocks_value_uniform',
    message0: 'Uniform(low %1 high %2)',
    args0: [
      { type: 'field_number', name: 'LOW', value: 0 },
      { type: 'field_number', name: 'HIGH', value: 1 }
    ],
    output: 'Number',
    colour: '#E7553C',
    tooltip: 'Random draw from Uniform distribution.'
  },
  {
    type: 'tidyblocks_value_exponential',
    message0: 'Exponential(lambda %1)',
    args0: [{ type: 'field_number', name: 'LAMBDA', value: 1, min: 0.0001 }],
    output: 'Number',
    colour: '#E7553C',
    tooltip: 'Random draw from Exponential distribution.'
  }
]);

const distTypes = [
  'tidyblocks_value_normal',
  'tidyblocks_value_uniform',
  'tidyblocks_value_exponential'
];
for (const t of distTypes) {
  Blockly.Blocks[t].toplevel_init = NP_TOPLEVEL_INIT;
}
