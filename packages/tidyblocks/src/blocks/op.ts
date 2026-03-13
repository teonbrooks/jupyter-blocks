import * as Blockly from 'blockly';

const ARITH_OPS = [
  ['+', 'ADD'],
  ['-', 'SUB'],
  ['×', 'MUL'],
  ['÷', 'DIV'],
  ['%', 'MOD'],
  ['**', 'POW']
];

const CMP_OPS = [
  ['=', 'EQ'],
  ['≠', 'NEQ'],
  ['<', 'LT'],
  ['≤', 'LTE'],
  ['>', 'GT'],
  ['≥', 'GTE']
];

const TYPE_CHECKS = [
  ['is missing', 'IS_MISSING'],
  ['is number', 'IS_NUMBER'],
  ['is text', 'IS_TEXT'],
  ['is date', 'IS_DATE'],
  ['is boolean', 'IS_BOOL']
];

const TYPE_CONVERTS = [
  ['to number', 'NUMBER'],
  ['to text', 'TEXT'],
  ['to boolean', 'BOOL'],
  ['to datetime', 'DATETIME']
];

const DATETIME_PARTS = [
  ['year', 'year'],
  ['month', 'month'],
  ['day', 'day'],
  ['weekday', 'weekday'],
  ['hour', 'hour'],
  ['minute', 'minute'],
  ['second', 'second']
];

const MATH_FUNS = [
  ['abs', 'abs'],
  ['round', 'round'],
  ['floor', 'floor'],
  ['ceil', 'ceil'],
  ['sqrt', 'sqrt'],
  ['log', 'log'],
  ['exp', 'exp']
];

const STR_OPS = [
  ['upper', 'upper'],
  ['lower', 'lower'],
  ['strip', 'strip'],
  ['length', 'len']
];

Blockly.defineBlocksWithJsonArray([
  // Arithmetic
  {
    type: 'tidyblocks_op_arithmetic',
    message0: '%1 %2 %3',
    args0: [
      { type: 'input_value', name: 'LEFT' },
      { type: 'field_dropdown', name: 'OP', options: ARITH_OPS },
      { type: 'input_value', name: 'RIGHT' }
    ],
    output: 'Number',
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Arithmetic operation between two values.'
  },
  // Comparison
  {
    type: 'tidyblocks_op_compare',
    message0: '%1 %2 %3',
    args0: [
      { type: 'input_value', name: 'LEFT' },
      { type: 'field_dropdown', name: 'OP', options: CMP_OPS },
      { type: 'input_value', name: 'RIGHT' }
    ],
    output: 'Boolean',
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Comparison between two values.'
  },
  // Logic AND / OR
  {
    type: 'tidyblocks_op_logic',
    message0: '%1 %2 %3',
    args0: [
      { type: 'input_value', name: 'LEFT', check: 'Boolean' },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['and', 'AND'],
          ['or', 'OR']
        ]
      },
      { type: 'input_value', name: 'RIGHT', check: 'Boolean' }
    ],
    output: 'Boolean',
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Logical AND / OR of two boolean expressions.'
  },
  // NOT
  {
    type: 'tidyblocks_op_not',
    message0: 'not %1',
    args0: [{ type: 'input_value', name: 'VALUE', check: 'Boolean' }],
    output: 'Boolean',
    colour: '#F9B5B2',
    tooltip: 'Logical NOT.'
  },
  // If/else ternary
  {
    type: 'tidyblocks_op_ifelse',
    message0: 'if %1 then %2 else %3',
    args0: [
      { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
      { type: 'input_value', name: 'IF_TRUE' },
      { type: 'input_value', name: 'IF_FALSE' }
    ],
    output: null,
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Ternary if/else expression.'
  },
  // Type check
  {
    type: 'tidyblocks_op_typecheck',
    message0: '%1 %2',
    args0: [
      { type: 'input_value', name: 'VALUE' },
      { type: 'field_dropdown', name: 'CHECK', options: TYPE_CHECKS }
    ],
    output: 'Boolean',
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Check the type of a value.'
  },
  // Type convert
  {
    type: 'tidyblocks_op_convert',
    message0: 'convert %1 %2',
    args0: [
      { type: 'input_value', name: 'VALUE' },
      { type: 'field_dropdown', name: 'TO', options: TYPE_CONVERTS }
    ],
    output: null,
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Convert a value to a different type.'
  },
  // Datetime part extraction
  {
    type: 'tidyblocks_op_datetime',
    message0: '%1 of %2',
    args0: [
      { type: 'field_dropdown', name: 'PART', options: DATETIME_PARTS },
      { type: 'input_value', name: 'VALUE' }
    ],
    output: 'Number',
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Extract a component from a datetime column.'
  },
  // Shift (lag/lead)
  {
    type: 'tidyblocks_op_shift',
    message0: 'shift %1 by %2',
    args0: [
      { type: 'input_value', name: 'VALUE' },
      { type: 'field_number', name: 'PERIODS', value: 1 }
    ],
    output: null,
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Shift column values forward (positive) or backward (negative).'
  },
  // Math functions
  {
    type: 'tidyblocks_op_math',
    message0: '%1 ( %2 )',
    args0: [
      { type: 'field_dropdown', name: 'FUN', options: MATH_FUNS },
      { type: 'input_value', name: 'VALUE' }
    ],
    output: 'Number',
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Apply a math function to a value.'
  },
  // String operations
  {
    type: 'tidyblocks_op_string',
    message0: '%1 . %2',
    args0: [
      { type: 'input_value', name: 'VALUE' },
      { type: 'field_dropdown', name: 'OP', options: STR_OPS }
    ],
    output: null,
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Apply a string operation to a column.'
  },
  // String contains
  {
    type: 'tidyblocks_op_str_contains',
    message0: '%1 contains %2',
    args0: [
      { type: 'input_value', name: 'VALUE' },
      { type: 'field_input', name: 'PATTERN', text: 'text' }
    ],
    output: 'Boolean',
    colour: '#F9B5B2',
    inputsInline: true,
    tooltip: 'Check whether a string column contains a pattern.'
  }
]);
